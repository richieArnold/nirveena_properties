//propertyControllers.js

const fs = require("fs");
const path = require("path");
const pool = require("../rds_setup/db/index"); // assuming you export pool from db/index.js

//  Slug generator
function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

//  Safe number conversion
function toNumber(value) {
  if (!value) return null;
  const cleaned = value.toString().replace(/[^\d.]/g, "");
  return cleaned ? Number(cleaned) : null;
}

exports.importProjects = async (req, res) => {
  try {
    const filePath = path.join(__dirname, "../data/output/projects.json");
    const rawData = fs.readFileSync(filePath, "utf-8");
    const projects = JSON.parse(rawData);

    for (const project of projects) {
      const slug = generateSlug(project.project_name);

      await pool.query(
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
        VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14
        )
        ON CONFLICT (project_id) DO NOTHING
        `,
        [
          Number(project.project_id),
          project.project_name.trim(),
          slug,
          project.project_type?.trim() || null,
          project.project_status?.trim() || null,
          project.project_location?.trim() || null,
          toNumber(project.total_acres),
          toNumber(project.no_of_units),
          project.club_house_size?.trim() || null,
          project.structure?.trim() || null,
          project.typology?.trim() || null,
          project.sba?.trim() || null,
          project.price?.trim() || null,
          project.rera_completion?.trim() || null,
        ],
      );
    }

    res.status(200).json({
      success: true,
      message: "Projects imported successfully",
    });
  } catch (error) {
    console.error("Import error:", error);
    res.status(500).json({
      success: false,
      message: "Import failed",
      error: error.message,
    });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        p.id,
        p.slug,
        p.project_name,
        p.project_location,
        p.price,
        p.project_type,
        p.project_status,
        img.image_url
      FROM projects p
      LEFT JOIN LATERAL (
        SELECT image_url
        FROM project_images pi
        WHERE pi.project_id = p.project_id
        ORDER BY pi.sort_order ASC
        LIMIT 1
      ) img ON true
      ORDER BY p.id DESC
      `,
    );

    console.log("Query successful, rows:", result.rows.length);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error("ERROR in getAllProjects:", error); // This will show in your terminal
    res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
      error: error.message,
    });
  }
};

exports.getProjectBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const projectResult = await pool.query(
      `SELECT * FROM projects WHERE slug = $1`,
      [slug],
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const project = projectResult.rows[0];

    const imagesResult = await pool.query(
      `
      SELECT image_url, sort_order
      FROM project_images
      WHERE project_id = $1
      ORDER BY sort_order ASC
      `,
      [project.project_id],
    );

    project.images = imagesResult.rows;

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch project",
      error: error.message,
    });
  }
};

//  Add Create Project
exports.addProject = async (req, res) => {
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
      images = [],
    } = req.body;

    // Basic validation
    if (!project_id || !project_name) {
      return res.status(400).json({
        success: false,
        message: "project_id and project_name are required",
      });
    }

    const slug = generateSlug(project_name);

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
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14
      )
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
      ],
    );

    // Insert images if provided
    for (let i = 0; i < images.length; i++) {
      await client.query(
        `
        INSERT INTO project_images (project_id, image_url, sort_order)
        VALUES ($1, $2, $3)
        `,
        [Number(project_id), images[i], i],
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "Project created successfully",
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


const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");

// Configure S3 (add this at the top of your file with other imports)
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

// Delete project (with S3 cleanup)
exports.deleteProject = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { id } = req.params;
    
    await client.query("BEGIN");
    
    // First, get the project details to know the slug and project_id
    const projectResult = await client.query(
      "SELECT project_id, slug FROM projects WHERE id = $1",
      [id]
    );
    
    if (projectResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }
    
    const { project_id, slug } = projectResult.rows[0];
    
    // Get all image URLs for this project
    const imagesResult = await client.query(
      `SELECT image_url FROM project_images WHERE project_id = $1`,
      [project_id]
    );
    
    console.log(`Deleting ${imagesResult.rows.length} images from S3 for project: ${slug}`);
    
    // Delete images from S3
    for (const row of imagesResult.rows) {
      try {
        // Extract the key from the URL
        // URL format: https://bucket-name.s3.region.amazonaws.com/images/slug/filename.jpg
        const url = new URL(row.image_url);
        const key = url.pathname.substring(1); // Remove leading slash
        
        console.log("Deleting from S3:", key);
        
        const deleteCommand = new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key
        });
        
        await s3.send(deleteCommand);
      } catch (s3Error) {
        console.error("Error deleting from S3:", s3Error);
        // Continue with database deletion even if S3 delete fails
      }
    }
    
    // Delete from project_images
    await client.query(
      "DELETE FROM project_images WHERE project_id = $1",
      [project_id]
    );
    
    // Delete from projects
    const result = await client.query(
      "DELETE FROM projects WHERE id = $1 RETURNING *",
      [id]
    );
    
    await client.query("COMMIT");
    
    res.json({
      success: true,
      message: `Project deleted successfully. Removed ${imagesResult.rows.length} images from S3.`,
      data: {
        project: result.rows[0],
        images_deleted: imagesResult.rows.length
      }
    });
    
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Delete project error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete project",
      error: error.message
    });
  } finally {
    client.release();
  }
};