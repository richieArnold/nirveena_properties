const fs = require("fs");
const path = require("path");
const pool = require("../rds_setup/db/index"); // assuming you export pool from db/index.js

// 🔹 Slug generator
function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// 🔹 Safe number conversion
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
        ]
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

// exports.getAllProjects = async (req, res) => {
//   try {
//     const limit = req.query.limit ? Number(req.query.limit) : 12;

//     const result = await pool.query(`
//       SELECT 
//         p.id,
//         p.slug,
//         p.project_name,
//         p.project_location,
//         p.price,
//         p.project_type,
//         p.project_status,
//         (
//           SELECT image_url
//           FROM project_images pi
//           WHERE pi.project_id = p.project_id
//           ORDER BY sort_order ASC
//           LIMIT 1
//         ) AS image_url
//       FROM projects p
//       ORDER BY p.project_id DESC
//       LIMIT $1
//     `, [limit]);

//     res.json({
//       success: true,
//       count: result.rows.length,
//       data: result.rows
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch projects",
//       error: error.message
//     });
//   }
// };

exports.getAllProjects = async (req, res) => {
  try {
    // const limit = req.query.limit ? Number(req.query.limit) : 12;

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
        WHERE pi.project_id = p.id
        ORDER BY pi.sort_order ASC
        LIMIT 1
      ) img ON true
      ORDER BY p.id DESC
      `,
      // [limit]
    );
console.log(result);
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });

  } catch (error) {
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
      [slug]
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
      [project.project_id]
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