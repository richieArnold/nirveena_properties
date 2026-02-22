const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const pool = require("../rds_setup/db/index");
require('dotenv').config();

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
      
      const cleanFileName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '-');
      const key = `images/${slug}/${Date.now()}-${cleanFileName}`;
      cb(null, key);
    },
    // Add Content-Type setting
    contentType: multerS3.AUTO_CONTENT_TYPE  // This automatically sets correct Content-Type based on file extension
  }),
  limits: { fileSize: 10 * 1024 * 1024 }
});

// Middleware for multiple file upload (max 10 files)
exports.uploadImages = upload.array('images', 10);

// Controller to handle property + images upload
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
      rera_completion
    } = req.body;

    // Basic validation
    if (!project_id || !project_name) {
      return res.status(400).json({
        success: false,
        message: "project_id and project_name are required"
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

    // Insert project
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
        rera_completion
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
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
      ]
    );

    // Insert image records if files were uploaded
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        // Construct the S3 URL - the key already has the slug from the upload middleware
        const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.key}`;

        await client.query(
          `
          INSERT INTO project_images (project_id, image_url, sort_order)
          VALUES ($1, $2, $3)
          `,
          [Number(project_id), imageUrl, i]
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
        images_uploaded: req.files ? req.files.length : 0
      }
    });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Create project error:", error);
    res.status(500).json({
      success: false,
      message: "Project creation failed",
      error: error.message
    });
  } finally {
    client.release();
  }
};


