const pool = require("../rds_setup/db");

/* ================= ADD FEATURE ================= */

exports.addProjectFeature = async (req, res) => {
  try {
    const { project_id } = req.params;
    const { feature_name, items = [] } = req.body;

    const feature = await pool.query(
      `
      INSERT INTO project_features (project_id, feature_name, description)
      VALUES ($1,$2,$3)
      RETURNING id
      `,
      [project_id, feature_name, description],
    );

    const featureId = feature.rows[0].id;

    for (let i = 0; i < items.length; i++) {
      await pool.query(
        `
        INSERT INTO project_feature_items
        (feature_id, label, icon_url, image_url, description, sort_order)
        VALUES ($1,$2,$3,$4,$5,$6)
        `,
        [
          featureId,
          items[i].label,
          items[i].icon_url || null,
          items[i].image_url || null,
          items[i].description || null,
          i,
        ],
      );
    }

    res.json({
      success: true,
      message: "Feature added successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to add feature",
      error: error.message,
    });
  }
};

/* ================= GET FEATURES ================= */

exports.getProjectFeatures = async (req, res) => {
  try {
    const { project_id } = req.params;

    const result = await pool.query(
      `SELECT 
        pf.id,
        pf.feature_name,
        (
          SELECT json_agg(
            json_build_object(
              'id', pfi.id,
              'label', pfi.label,
              'icon_url', pfi.icon_url,
              'image_url', pfi.image_url,
              'description', pfi.description,
              'sort_order', pfi.sort_order
            )
            ORDER BY pfi.sort_order
          )
          FROM project_feature_items pfi
          WHERE pfi.feature_id = pf.id
        ) AS items
      FROM project_features pf
      WHERE pf.project_id = $1
      ORDER BY pf.sort_order
      `,
      [project_id],
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Get project features error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch features",
      error: error.message,
    });
  }
};

/* ================= ICON UPLOAD ================= */

const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

const uploadIconMiddleware = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const fileName = `feature-icons/${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
});

exports.uploadIconMiddleware = uploadIconMiddleware;

exports.uploadIcon = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    res.json({
      success: true,
      icon_url: req.file.location,
    });
  } catch (error) {
    console.error("Icon upload error:", error);

    res.status(500).json({
      success: false,
      message: "Upload failed",
      error: error.message,
    });
  }
};

/* ================= UPDATE FEATURE ================= */

exports.updateProjectFeature = async (req, res) => {
  try {
    const { feature_id } = req.params;
    const { feature_name, items = [] } = req.body;

    // update feature name
    await pool.query(
      `
      UPDATE project_features
      SET feature_name = $1
      WHERE id = $2
      `,
      [feature_name, feature_id],
    );

    // delete old items
    await pool.query(
      `
      DELETE FROM project_feature_items
      WHERE feature_id = $1
      `,
      [feature_id],
    );

    // insert new items
    for (let i = 0; i < items.length; i++) {
      await pool.query(
        `
        INSERT INTO project_feature_items
        (feature_id, label, icon_url, image_url, description, sort_order)
        VALUES ($1,$2,$3,$4,$5,$6)
        `,
        [
          feature_id,
          items[i].label,
          items[i].icon_url || null,
          items[i].image_url || null,
          items[i].description || null,
          i,
        ],
      );
    }

    res.json({
      success: true,
      message: "Feature updated successfully",
    });
  } catch (error) {
    console.error("Update feature error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update feature",
      error: error.message,
    });
  }
};

/* ================= DELETE FEATURE ================= */

exports.deleteProjectFeature = async (req, res) => {
  try {
    const { feature_id } = req.params;

    await pool.query(
      `DELETE FROM project_feature_items WHERE feature_id = $1`,
      [feature_id],
    );

    await pool.query(`DELETE FROM project_features WHERE id = $1`, [
      feature_id,
    ]);

    res.json({
      success: true,
      message: "Feature deleted successfully",
    });
  } catch (error) {
    console.error("Delete feature error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete feature",
      error: error.message,
    });
  }
};

/* ================= DELETE FEATURE ITEM ================= */

exports.deleteFeatureItem = async (req, res) => {
  try {
    const { item_id } = req.params;

    await pool.query(`DELETE FROM project_feature_items WHERE id = $1`, [
      item_id,
    ]);

    res.json({
      success: true,
      message: "Feature item deleted successfully",
    });
  } catch (error) {
    console.error("Delete feature item error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete feature item",
      error: error.message,
    });
  }
};
// ----------Connectivity--------------------------

exports.getConnectivity = async (req, res) => {
  try {
    const { project_id } = req.params;

    const result = await pool.query(
      `SELECT * FROM project_connectivity WHERE project_id = $1 ORDER BY id`,
      [project_id],
    );

    // group by category
    const grouped = {};

    result.rows.forEach((row) => {
      if (!grouped[row.category]) {
        grouped[row.category] = [];
      }
      grouped[row.category].push(row.description);
    });

    res.json({
      success: true,
      data: grouped,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

// exports.addConnectivity = async (req, res) => {
//   const client = await pool.connect();

//   try {
//     const { project_id, connectivity } = req.body;

//     /*
//     Expected format from frontend:

//     {
//       project_id: 124,
//       connectivity: [
//         {
//           category: "Strategic Connectivity",
//           items: [
//             "Sarjapur Main Road / Project Entrance – 2 Mins",
//             "Outer Ring Road (ORR) – 15 Mins"
//           ]
//         },
//         {
//           category: "Leisure & Lifestyle",
//           items: [
//             "Supermarkets nearby – 3 Mins"
//           ]
//         }
//       ]
//     }
//     */

//     if (!project_id || !connectivity) {
//       return res.status(400).json({
//         success: false,
//         message: "project_id and connectivity are required",
//       });
//     }

//     await client.query("BEGIN");

//     // Optional: delete existing connectivity (if updating)
//     await client.query(
//       "DELETE FROM project_connectivity WHERE project_id = $1",
//       [project_id],
//     );

//     for (const section of connectivity) {
//       const { category, items } = section;

//       for (const item of items) {
//         await client.query(
//           `
//           INSERT INTO project_connectivity (project_id, category, title, description)
//           VALUES ($1, $2, $3, $4)
//           `,
//           [
//             project_id,
//             category,
//             null, // title is null as per your DB
//             item,
//           ],
//         );
//       }
//     }

//     await client.query("COMMIT");

//     res.json({
//       success: true,
//       message: "Connectivity added successfully",
//     });
//   } catch (error) {
//     await client.query("ROLLBACK");

//     console.error("Connectivity insert error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to add connectivity",
//       error: error.message,
//     });
//   } finally {
//     client.release();
//   }
// };

exports.bulkUpsertFeatures = async (req, res) => {
  const client = await pool.connect();

  try {
    const { project_id } = req.params;
    const { features } = req.body;

    await client.query("BEGIN");

    // 1. Delete existing features + items
    await client.query(
      `DELETE FROM project_feature_items 
       WHERE feature_id IN (
         SELECT id FROM project_features WHERE project_id = $1
       )`,
      [project_id],
    );

    await client.query(`DELETE FROM project_features WHERE project_id = $1`, [
      project_id,
    ]);

    // 2. Insert features
    const featureInsertQuery = `
      INSERT INTO project_features (project_id, feature_name, sort_order)
      VALUES ${features.map((_, i) => `($1, $${i + 2}, ${i})`).join(",")}
      RETURNING id
    `;

    const featureValues = [project_id, ...features.map((f) => f.feature_name)];

    const featureResult = await client.query(featureInsertQuery, featureValues);

    // 3. Prepare bulk items insert
    const itemsValues = [];
    const itemsQueryParts = [];

    let paramIndex = 1;

    featureResult.rows.forEach((featureRow, i) => {
      const items = features[i].items || [];

      items.forEach((item, j) => {
        itemsQueryParts.push(
          `($${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++})`,
        );

        itemsValues.push(
          featureRow.id,
          item.label || null,
          item.icon_url || null,
          item.image_url || null,
          item.description || null,
          j,
        );
      });
    });

    if (itemsValues.length > 0) {
      await client.query(
        `
        INSERT INTO project_feature_items
        (feature_id, label, icon_url, image_url, description, sort_order)
        VALUES ${itemsQueryParts.join(",")}
        `,
        itemsValues,
      );
    }

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "Features updated successfully",
    });
  } catch (err) {
    await client.query("ROLLBACK");

    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to update features",
      error: err.message,
    });
  } finally {
    client.release();
  }
};

exports.addConnectivity = async (req, res) => {
  const client = await pool.connect();

  try {
    const { project_id, connectivity } = req.body;

    await client.query("BEGIN");

    await client.query(
      "DELETE FROM project_connectivity WHERE project_id = $1",
      [project_id],
    );

    const values = [];
    const placeholders = [];
    let paramIndex = 1;

    connectivity.forEach((section) => {
      section.items.forEach((item) => {
        placeholders.push(
          `($${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++})`,
        );

        values.push(project_id, section.category, null, item);
      });
    });

    if (values.length > 0) {
      await client.query(
        `
        INSERT INTO project_connectivity (project_id, category, title, description)
        VALUES ${placeholders.join(",")}
        `,
        values,
      );
    }

    await client.query("COMMIT");

    res.json({ success: true });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);

    res.status(500).json({ success: false });
  } finally {
    client.release();
  }
};
exports.bulkUpsertConnectivity = async (req, res) => {
  const client = await pool.connect();

  try {
    const { project_id } = req.params;
    const { connectivity } = req.body;

    await client.query("BEGIN");

    // delete existing
    await client.query(
      "DELETE FROM project_connectivity WHERE project_id = $1",
      [project_id],
    );

    const values = [];
    const placeholders = [];
    let paramIndex = 1;

    connectivity.forEach((section) => {
      section.items.forEach((item) => {
        placeholders.push(
          `($${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++})`
        );

        values.push(project_id, section.category, null, item);
      });
    });

    if (values.length > 0) {
      await client.query(
        `
        INSERT INTO project_connectivity (project_id, category, title, description)
        VALUES ${placeholders.join(",")}
        `,
        values
      );
    }

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "Connectivity updated",
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to update connectivity",
    });
  } finally {
    client.release();
  }
};