const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const pool = require("../rds_setup/db/index");
require("dotenv").config();

// Configure S3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

// Configure multer for S3 upload
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      // Generate slug from project_name
      const projectName = req.body.project_name;
      if (!projectName) {
        return cb(new Error("project_name is required for image upload"));
      }

      const slug = projectName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

      const cleanFileName = file.originalname.replace(/[^a-zA-Z0-9.]/g, "-");
      const key = `images/${slug}/${Date.now()}-${cleanFileName}`;
      cb(null, key);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
});

// Middleware for multiple file upload (max 10 files)
exports.uploadImages = upload.array("images", 10);

// Controller to handle property + images upload (CREATE)
// Controller to handle property + images upload (CREATE)
exports.addProjectWithImages = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      project_id,
      project_name,
      project_type,
      project_status,
      project_location,
      total_acres,
      no_of_units,
      club_house_size,
      structure,
      typology,
      sba,
      price,
      rera_completion,
      property_description,
    } = req.body;

    // Basic validation
    if (!project_id || !project_name) {
      return res.status(400).json({
        success: false,
        message: "project_id and project_name are required",
      });
    }

    // Generate slug
    const slug = project_name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    await client.query("BEGIN");

    // Insert project - ADD property_description to query
    await client.query(
      `
      INSERT INTO projects (
        project_id,
        project_name,
        slug,
        project_type,
        project_status,
        project_location,
        total_acres,
        no_of_units,
        club_house_size,
        structure,
        typology,
        sba,
        price,
        rera_completion,
        property_description
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) 
      `,
      [
        Number(project_id),
        project_name.trim(),
        slug,
        project_type || null,
        project_status || null,
        project_location || null,
        total_acres || null,
        no_of_units || null,
        club_house_size || null,
        structure || null,
        typology || null,
        sba || null,
        price || null,
        rera_completion || null,
        property_description || null,
      ],
    );

    // Rest of the function remains the same...
    // Insert image records if files were uploaded
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.key}`;

        await client.query(
          `
          INSERT INTO project_images (project_id, image_url, sort_order)
          VALUES ($1, $2, $3)
          `,
          [Number(project_id), imageUrl, i],
        );
      }
    }

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "Project and images uploaded successfully",
      data: {
        project_id: Number(project_id),
        slug: slug,
        images_uploaded: req.files ? req.files.length : 0,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Create project error:", error);
    res.status(500).json({
      success: false,
      message: "Project creation failed",
      error: error.message,
    });
  } finally {
    client.release();
  }
};

// UPDATE PROJECT WITH IMAGES - FIXED WITH S3 DELETION
exports.updateProjectWithImages = async (req, res) => {
  const client = await pool.connect();
  const s3DeleteResults = { success: [], failed: [] };

  try {
    const { id } = req.params;
    const {
      project_id,
      project_name,
      project_type,
      project_status,
      project_location,
      total_acres,
      no_of_units,
      club_house_size,
      structure,
      typology,
      sba,
      price,
      rera_completion,
      youtube_video_url,
      property_description,
      existing_images,
    } = req.body;

    // Basic validation
    if (!project_id || !project_name) {
      return res.status(400).json({
        success: false,
        message: "project_id and project_name are required",
      });
    }

    // Check if project exists
    const projectCheck = await client.query(
      "SELECT * FROM projects WHERE id = $1",
      [id],
    );

    if (projectCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const projectData = projectCheck.rows[0];
    const projectIdValue = Number(project_id);

    // Parse existing_images
    let imagesToKeep = [];
    if (existing_images) {
      try {
        imagesToKeep =
          typeof existing_images === "string"
            ? JSON.parse(existing_images)
            : existing_images;
      } catch (e) {
        console.error("Error parsing existing_images:", e);
        imagesToKeep = [];
      }
    }

    // Get current images from database
    const currentImages = await client.query(
      "SELECT image_url FROM project_images WHERE project_id = $1",
      [projectIdValue],
    );

    // Find images to delete (ones in DB but not in imagesToKeep)
    const imagesToDelete = currentImages.rows.filter(
      (row) => !imagesToKeep.includes(row.image_url),
    );

    console.log(`Found ${imagesToDelete.length} images to delete from S3`);

    // Delete from S3 with tracking
    for (const img of imagesToDelete) {
      try {
        const url = new URL(img.image_url);
        const key = url.pathname.substring(1);

        console.log("Attempting to delete from S3:", key);

        const deleteCommand = new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
        });

        await s3.send(deleteCommand);
        console.log("✅ Successfully deleted from S3:", key);
        s3DeleteResults.success.push(key);
      } catch (s3Error) {
        console.error("❌ Error deleting from S3:", s3Error.message);
        s3DeleteResults.failed.push({
          url: img.image_url,
          error: s3Error.message,
        });
      }
    }

    await client.query("BEGIN");

    // Generate slug
    const slug = project_name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    // Update project - ADD property_description
    await client.query(
      `
      UPDATE projects SET
        project_id = $1,
        project_name = $2,
        slug = $3,
        project_type = $4,
        project_status = $5,
        project_location = $6,
        total_acres = $7,
        no_of_units = $8,
        club_house_size = $9,
        structure = $10,
        typology = $11,
        sba = $12,
        price = $13,
        rera_completion = $14,
        youtube_video_url = $15,
        property_description = $16, 
        updated_at = NOW()
      WHERE id = $17  
      `,
      [
        projectIdValue,
        project_name.trim(),
        slug,
        project_type || null,
        project_status || null,
        project_location || null,
        total_acres || null,
        no_of_units || null,
        club_house_size || null,
        structure || null,
        typology || null,
        sba || null,
        price || null,
        rera_completion || null,
        youtube_video_url || null,
        property_description || null,
        id,
      ],
    );

    // Rest of the function remains the same...
    // Delete images from database that are NOT in imagesToKeep
    if (imagesToKeep.length > 0) {
      await client.query(
        "DELETE FROM project_images WHERE project_id = $1 AND image_url != ALL($2::text[])",
        [projectIdValue, imagesToKeep],
      );
    } else {
      await client.query("DELETE FROM project_images WHERE project_id = $1", [
        projectIdValue,
      ]);
    }

    // Get current max sort order
    const sortResult = await client.query(
      "SELECT COALESCE(MAX(sort_order), -1) as max_sort FROM project_images WHERE project_id = $1",
      [projectIdValue],
    );
    let nextSortOrder = sortResult.rows[0].max_sort + 1;

    // Add new images
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.key}`;

        await client.query(
          `
          INSERT INTO project_images (project_id, image_url, sort_order)
          VALUES ($1, $2, $3)
          `,
          [projectIdValue, imageUrl, nextSortOrder + i],
        );
      }
    }

    await client.query("COMMIT");

    // Prepare response message based on S3 deletion results
    let responseMessage = "Project updated successfully";
    if (s3DeleteResults.failed.length > 0) {
      responseMessage = `Project updated but ${s3DeleteResults.failed.length} image(s) failed to delete from S3`;
    } else if (s3DeleteResults.success.length > 0) {
      responseMessage = `Project updated successfully. Removed ${s3DeleteResults.success.length} old image(s) from S3.`;
    }

    res.json({
      success: true,
      message: responseMessage,
      data: {
        project_id: projectIdValue,
        slug: slug,
        images_updated: {
          added: req.files?.length || 0,
          kept: imagesToKeep.length,
          deleted_from_db: imagesToDelete.length,
          deleted_from_s3: {
            success: s3DeleteResults.success.length,
            failed: s3DeleteResults.failed,
          },
        },
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Update project error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update project",
      error: error.message,
      s3_deletion: s3DeleteResults,
    });
  } finally {
    client.release();
  }
};

exports.updateImageOrder = async (req, res) => {
  try {
    const { images } = req.body;

    const values = [];
    const cases = [];

    images.forEach((img, index) => {
      values.push(img.id);
      cases.push(`WHEN id = ${img.id} THEN ${index}`);
    });

    await pool.query(`
      UPDATE project_images
      SET sort_order = CASE
        ${cases.join(" ")}
      END
      WHERE id IN (${values.join(",")})
    `);
      console.log(images)
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};
