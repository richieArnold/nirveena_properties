//propertyControllers.js
const { formatPrice, isValidImage } = require("./propertyFormater");
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
          rera_completion,
          property_description
        )
        VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15  // ADD $15
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
          project.property_description?.trim() || null,
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

//     const result = await pool.query(
//       `
//       SELECT
//         p.id,
//         p.slug,
//         p.project_name,
//         p.project_location,
//         p.price,
//         p.project_type,
//         p.project_status,
//         img.image_url
//       FROM projects p
//       LEFT JOIN LATERAL (
//         SELECT image_url
//         FROM project_images pi
//         WHERE pi.project_id = p.project_id
//         ORDER BY pi.sort_order ASC
//         LIMIT 1
//       ) img ON true
//       ORDER BY p.id DESC
//       `,
//     );

//     console.log("Query successful, rows:", result.rows.length);

//     res.json({
//       success: true,
//       count: result.rows.length,
//       data: result.rows,
//     });
//   } catch (error) {
//     console.error("ERROR in getAllProjects:", error); // This will show in your terminal
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch projects",
//       error: error.message,
//     });
//   }
// };

// controllers/propertyControllers.js

// exports.getAllProjects = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const offset = (page - 1) * limit;

//     // Get total count for pagination
//     const countResult = await pool.query("SELECT COUNT(*) FROM projects");
//     const totalCount = parseInt(countResult.rows[0].count);

//     // Get paginated projects with images
//     const result = await pool.query(
//       `
//       SELECT
//         p.id,
//         p.project_id,
//         p.slug,
//         p.project_name,
//         p.project_location,
//         p.price,
//         p.project_type,
//         p.project_status,
//         p.total_acres,
//         p.no_of_units,
//         p.club_house_size,
//         p.structure,
//         p.typology,
//         p.sba,
//         p.rera_completion,
//         p.property_description,
//         p.created_at,
//         p.updated_at,
//         img.image_url
//       FROM projects p
//       LEFT JOIN LATERAL (
//         SELECT image_url
//         FROM project_images pi
//         WHERE pi.project_id = p.project_id
//         ORDER BY pi.sort_order ASC
//         LIMIT 1
//       ) img ON true
//       ORDER BY p.id DESC
//       LIMIT $1 OFFSET $2
//       `,
//       [limit, offset],
//     );

//     console.log("Query successful, rows:", result.rows.length);

//     // Format prices and Formated images
//     const formattedProjects = result.rows
//       .filter(
//         (project) => !project.image_url || isValidImage(project.image_url),
//       )
//       .map((project) => ({
//         ...project,
//         price: formatPrice(project.price),
//       }));

//     res.json({
//       success: true,
//       data: formattedProjects,
//       pagination: {
//         currentPage: page,
//         totalPages: Math.ceil(totalCount / limit),
//         totalCount: totalCount,
//         limit: limit,
//       },
//     });
//   } catch (error) {
//     console.error("ERROR in getAllProjects:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch projects",
//       error: error.message,
//     });
//   }
// };

// Update getAllProjects to include display_order in SELECT and ORDER BY
exports.getAllProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get sort parameters
    const sortBy = req.query.sortBy || "display_order";
    const sortOrder = req.query.sortOrder || "asc";

    // Validate sortBy to prevent SQL injection
    const validSortFields = ["display_order", "project_id", "project_name"];
    const finalSortBy = validSortFields.includes(sortBy)
      ? sortBy
      : "display_order";
    const finalSortOrder = sortOrder === "desc" ? "DESC" : "ASC";

    // Get total count for pagination
    const countResult = await pool.query("SELECT COUNT(*) FROM projects");
    const totalCount = parseInt(countResult.rows[0].count);

    // Get paginated projects with images
    const result = await pool.query(
      `
      SELECT 
        p.id,
        p.project_id,
        p.slug,
        p.project_name,
        p.project_location,
        p.price,
        p.project_type,
        p.project_status,
        p.total_acres,
        p.no_of_units,
        p.club_house_size,
        p.structure,
        p.typology,
        p.sba,
        p.rera_completion,
        p.property_description,
        p.display_order,
        p.created_at,
        p.youtube_video_url,
        p.updated_at,
        img.image_url
      FROM projects p
      LEFT JOIN LATERAL (
        SELECT image_url
        FROM project_images pi
        WHERE pi.project_id = p.project_id
        ORDER BY pi.sort_order ASC
        LIMIT 1
      ) img ON true
      ORDER BY p.${finalSortBy} ${finalSortOrder}, p.id DESC
      LIMIT $1 OFFSET $2
      `,
      [limit, offset],
    );

    console.log("Query successful, rows:", result.rows.length);

    // Format prices, images, and transform status
    const formattedProjects = result.rows
      .filter(
        (project) => !project.image_url || isValidImage(project.image_url),
      )
      .map((project) => {
        // Transform status to display format
        let displayStatus = project.project_status;

        if (project.project_status) {
          const statusLower = project.project_status.toLowerCase();
          if (statusLower === "uc" || "og") {
            displayStatus = "On Going";
          } else if (statusLower === "rtm") {
            displayStatus = "Ready to Move";
          } else if (statusLower === "eoi") {
            displayStatus = "Expression of Interest";
          }
        }

        return {
          ...project,
          price: formatPrice(project.price),
          project_status: displayStatus, // Replace with transformed status
          original_status: project.project_status, // Optional: keep original if needed for filtering
        };
      });

    res.json({
      success: true,
      data: formattedProjects,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount: totalCount,
        limit: limit,
      },
    });
  } catch (error) {
    console.error("ERROR in getAllProjects:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
      error: error.message,
    });
  }
};

exports.getAllPropertiesUnfiltered = async (req, res) => {
  try {
    const { status } = req.query; // Get status from query params

    let query = `
      SELECT 
        p.id,
        p.slug,
        p.project_name,
        p.project_location,
        p.price,
        p.project_type,
        p.project_status,
        p.display_order,
        p.property_description,  
        img.image_url
      FROM projects p
      LEFT JOIN LATERAL (
        SELECT image_url
        FROM project_images pi
        WHERE pi.project_id = p.id
        ORDER BY pi.sort_order ASC
        LIMIT 1
      ) img ON true
    `;

    const queryParams = [];

    // Add status filter if provided and not 'all'
    if (status && status !== "all") {
      query += ` WHERE LOWER(p.project_status) = LOWER($${queryParams.length + 1})`;
      queryParams.push(status);
    }

    // Modified ORDER BY: Projects with display_order > 0 come first, ordered by display_order,
    // then projects with display_order = 0 or NULL come last, ordered by id DESC
    query += ` ORDER BY 
        CASE 
          WHEN p.display_order > 0 THEN 0 
          ELSE 1 
        END,
        p.display_order ASC,
        p.id DESC`;

    const result = await pool.query(query, queryParams);

    // Format prices, images, and transform status
    const formattedData = result.rows
      .filter(
        (project) => !project.image_url || isValidImage(project.image_url),
      )
      .map((project) => {
        // Transform status to display format
        let displayStatus = project.project_status;

        if (project.project_status) {
          const statusLower = project.project_status.toLowerCase();
          if (statusLower === "uc") {
            displayStatus = "On Going";
          } else if (statusLower === "rtm") {
            displayStatus = "Ready to Move";
          } else if (statusLower === "eoi") {
            displayStatus = "Expression of Interest";
          }
        }

        return {
          ...project,
          price: formatPrice(project.price),
          project_status: displayStatus,
          original_status: project.project_status,
        };
      });

    res.json({
      success: true,
      count: formattedData.length,
      data: formattedData,
    });
  } catch (error) {
    console.error("ERROR in getAllPropertiesUnfiltered:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
      error: error.message,
    });
  }
};

// exports.getProjectBySlug = async (req, res) => {
//   try {
//     const { slug } = req.params;

//     const projectResult = await pool.query(
//       `SELECT * FROM projects WHERE slug = $1`,
//       [slug],
//     );

//     if (projectResult.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Project not found",
//       });
//     }

//     const project = projectResult.rows[0];

//     const imagesResult = await pool.query(
//       `
//       SELECT image_url, sort_order
//       FROM project_images
//       WHERE project_id = $1
//       ORDER BY sort_order ASC
//       `,
//       [project.project_id],
//     );

//     // Filter only valid images
//     const validImages = imagesResult.rows.filter((img) =>
//       isValidImage(img.image_url)
//     );

//     project.images = validImages;

//     res.json({
//       success: true,
//       data: project,
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch project",
//       error: error.message,
//     });
//   }
// };

// Update addProject to include display_order

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
    const projectId = project.project_id;

    // Format main price
    project.price = formatPrice(project.price);

    const [
      imagesResult,
      featuresResult,
      featureItemsResult,
      configurationsResult,
      floorPlansResult,
    ] = await Promise.all([
      pool.query(
        `
        SELECT image_url, sort_order
        FROM project_images
        WHERE project_id = $1
        ORDER BY sort_order ASC
        `,
        [projectId],
      ),

      pool.query(
        `
        SELECT id, feature_name
        FROM project_features
        WHERE project_id = $1
        ORDER BY sort_order
        `,
        [projectId],
      ),

      pool.query(`SELECT * FROM project_feature_items`),

      pool.query(
        `
        SELECT *
        FROM project_configurations
        WHERE project_id = $1
        ORDER BY id
        `,
        [projectId],
      ),

      pool.query(
        `
        SELECT *
        FROM project_floor_plans
        WHERE project_id = $1
        ORDER BY sort_order
        `,
        [projectId],
      ),
    ]);

    const validImages = imagesResult.rows.filter((img) =>
      isValidImage(img.image_url),
    );

    const features = featuresResult.rows.map((feature) => ({
      ...feature,
      items: featureItemsResult.rows.filter(
        (item) => item.feature_id === feature.id,
      ),
    }));

    const configurations = configurationsResult.rows.map((config) => ({
      ...config,
      price: formatPrice(config.price),
    }));

    res.json({
      success: true,
      data: {
        project,
        images: validImages,
        features,
        configurations,
        floorplans: floorPlansResult.rows,
      },
    });
  } catch (error) {
    console.error("Fetch project error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch project",
      error: error.message,
    });
  }
};

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
      property_description,
      display_order = 0, // ADD THIS with default 0
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

    // Insert project - ADD display_order
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
        property_description,
        display_order
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16
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
        property_description || null,
        display_order, // ADD THIS
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
      [id],
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const { project_id, slug } = projectResult.rows[0];

    // Get all image URLs for this project
    const imagesResult = await client.query(
      `SELECT image_url FROM project_images WHERE project_id = $1`,
      [project_id],
    );

    console.log(
      `Deleting ${imagesResult.rows.length} images from S3 for project: ${slug}`,
    );

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
          Key: key,
        });

        await s3.send(deleteCommand);
      } catch (s3Error) {
        console.error("Error deleting from S3:", s3Error);
        // Continue with database deletion even if S3 delete fails
      }
    }

    // Delete from project_images
    await client.query("DELETE FROM project_images WHERE project_id = $1", [
      project_id,
    ]);

    // Delete from projects
    const result = await client.query(
      "DELETE FROM projects WHERE id = $1 RETURNING *",
      [id],
    );

    await client.query("COMMIT");

    res.json({
      success: true,
      message: `Project deleted successfully. Removed ${imagesResult.rows.length} images from S3.`,
      data: {
        project: result.rows[0],
        images_deleted: imagesResult.rows.length,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Delete project error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete project",
      error: error.message,
    });
  } finally {
    client.release();
  }
};

/////////////////////////////   BELOW IS THE UPDATE PROPERTIES CONTROLLER ////////////////////////////////////////////////

// Get single project by ID for editing
// exports.getProjectById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const projectResult = await pool.query(
//       `SELECT * FROM projects WHERE id = $1`,
//       [id],
//     );

//     if (projectResult.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Project not found",
//       });
//     }

//     const project = projectResult.rows[0];

//     // Get project images
//     const imagesResult = await pool.query(
//       `SELECT id, image_url, sort_order
//        FROM project_images
//        WHERE project_id = $1
//        ORDER BY sort_order ASC`,
//       [project.project_id],
//     );

//     project.images = imagesResult.rows;

//     res.json({
//       success: true,
//       data: project,
//     });
//   } catch (error) {
//     console.error("Get project by ID error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch project",
//       error: error.message,
//     });
//   }
// };

// Get single project by ID for editing / viewing
exports.getProjectById = async (req, res) => {
  try {
    const { project_id } = req.params;

    /* ---------------- PROJECT ---------------- */

    const projectResult = await pool.query(
      `SELECT * FROM projects WHERE project_id = $1`,
      [project_id],
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const project = projectResult.rows[0];
    const projectId = project.project_id;

    /* ---------------- IMAGES ---------------- */

    const imagesResult = await pool.query(
      `SELECT id, image_url, sort_order
       FROM project_images
       WHERE project_id = $1
       ORDER BY sort_order ASC`,
      [projectId],
    );

    /* ---------------- FEATURES ---------------- */

    const featuresResult = await pool.query(
      `SELECT id, feature_name
       FROM project_features
       WHERE project_id = $1
       ORDER BY sort_order`,
      [projectId],
    );

    const featureItemsResult = await pool.query(
      `SELECT *
       FROM project_feature_items`,
    );

    const features = featuresResult.rows.map((feature) => ({
      ...feature,
      items: featureItemsResult.rows.filter(
        (item) => item.feature_id === feature.id,
      ),
    }));

    /* ---------------- CONFIGURATIONS ---------------- */

    const configurationsResult = await pool.query(
      `SELECT *
       FROM project_configurations
       WHERE project_id = $1
       ORDER BY sort_order`,
      [projectId],
    );

    /* ---------------- FLOORPLANS ---------------- */

    const floorPlansResult = await pool.query(
      `SELECT *
       FROM project_floor_plans
       WHERE project_id = $1
       ORDER BY sort_order`,
      [projectId],
    );

    /* ---------------- ATTACH DATA ---------------- */

    project.images = imagesResult.rows;
    project.features = features;
    project.configurations = configurationsResult.rows;
    project.floorplans = floorPlansResult.rows;

    /* ---------------- RESPONSE ---------------- */

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error("Get project by ID error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch project",
      error: error.message,
    });
  }
};

// Update updateProject to include display_order
exports.updateProject = async (req, res) => {
  const client = await pool.connect();

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
      display_order, // ADD THIS
      existing_images = [],
      new_images = [],
    } = req.body;
    console.log(req.body);
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

    const slug = generateSlug(project_name);

    await client.query("BEGIN");

    // Update project - ADD display_order
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
        display_order = $17,
        updated_at = NOW()
      WHERE id = $18
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
        youtube_video_url || null,
        property_description || null,
        display_order !== undefined ? display_order : 0, // ADD THIS
        id,
      ],
    );

    // Handle images if provided
    if (existing_images.length > 0 || new_images.length > 0) {
      // Delete images that are no longer needed
      await client.query(
        "DELETE FROM project_images WHERE project_id = $1 AND image_url NOT IN (SELECT unnest($2::text[]))",
        [Number(project_id), existing_images],
      );

      // Add new images
      let nextSortOrder = existing_images.length;
      for (let i = 0; i < new_images.length; i++) {
        await client.query(
          `
          INSERT INTO project_images (project_id, image_url, sort_order)
          VALUES ($1, $2, $3)
          ON CONFLICT DO NOTHING
          `,
          [Number(project_id), new_images[i], nextSortOrder + i],
        );
      }
    }

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "Project updated successfully",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Update project error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update project",
      error: error.message,
    });
  } finally {
    client.release();
  }
};

// NEW FUNCTION: Update display order only (for quick updates from list)
exports.updateDisplayOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { display_order } = req.body;

    if (display_order === undefined || display_order === null) {
      return res.status(400).json({
        success: false,
        message: "Display order is required",
      });
    }

    // Check if project exists
    const projectCheck = await pool.query(
      "SELECT id FROM projects WHERE id = $1",
      [id],
    );

    if (projectCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Update display order
    await pool.query(
      "UPDATE projects SET display_order = $1, updated_at = NOW() WHERE id = $2",
      [parseInt(display_order), id],
    );

    res.json({
      success: true,
      message: "Display order updated successfully",
    });
  } catch (error) {
    console.error("Error updating display order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update display order",
      error: error.message,
    });
  }
};

// Get all unique property types
exports.getPropertyTypes = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT DISTINCT project_type FROM projects WHERE project_type IS NOT NULL ORDER BY project_type",
    );
    const types = result.rows.map((row) => row.project_type);
    res.json({ success: true, types });
  } catch (error) {
    console.error("Error fetching property types:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch property types" });
  }
};

// Save new property type (optional)
exports.savePropertyType = async (req, res) => {
  // This is optional - you might not need to save types separately
  // They'll be saved when you create a project with that type
  res.json({ success: true });
};
