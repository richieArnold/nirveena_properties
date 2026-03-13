const pool = require('../rds_setup/db');


exports.addProjectFeature = async (req, res) => {
  try {
    const { project_id } = req.params;
    const { feature_name, items = [] } = req.body;

    const feature = await pool.query(
      `
      INSERT INTO project_features (project_id, feature_name)
      VALUES ($1,$2)
      RETURNING id
      `,
      [project_id, feature_name]
    );

    const featureId = feature.rows[0].id;

    for (let i = 0; i < items.length; i++) {
      await pool.query(
        `
        INSERT INTO project_feature_items
        (feature_id, label, icon_url, image_url, sort_order)
        VALUES ($1,$2,$3,$4,$5)
        `,
        [
          featureId,
          items[i].label,
          items[i].icon_url || null,
          items[i].image_url || null,
          i
        ]
      );
    }

    res.json({
      success: true,
      message: "Feature added successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add feature",
      error: error.message,
    });
  }
};

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
      [project_id]
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

// icon upload controller 
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
      [feature_name, feature_id]
    );

    // delete old items
    await pool.query(
      `
      DELETE FROM project_feature_items
      WHERE feature_id = $1
      `,
      [feature_id]
    );

    // insert new items
    for (let i = 0; i < items.length; i++) {

      await pool.query(
        `
        INSERT INTO project_feature_items
        (feature_id, label, icon_url, image_url, sort_order)
        VALUES ($1,$2,$3,$4,$5)
        `,
        [
          feature_id,
          items[i].label,
          items[i].icon_url || null,
          items[i].image_url || null,
          i
        ]
      );

    }

    res.json({
      success: true,
      message: "Feature updated successfully"
    });

  } catch (error) {

    console.error("Update feature error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update feature",
      error: error.message
    });

  }
};

exports.deleteProjectFeature = async (req, res) => {

  try {

    const { feature_id } = req.params;

    // delete items first
    await pool.query(
      `
      DELETE FROM project_feature_items
      WHERE feature_id = $1
      `,
      [feature_id]
    );

    // delete feature
    await pool.query(
      `
      DELETE FROM project_features
      WHERE id = $1
      `,
      [feature_id]
    );

    res.json({
      success: true,
      message: "Feature deleted successfully"
    });

  } catch (error) {

    console.error("Delete feature error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete feature",
      error: error.message
    });

  }

};

exports.deleteFeatureItem = async (req, res) => {

  try {

    const { item_id } = req.params;

    await pool.query(
      `
      DELETE FROM project_feature_items
      WHERE id = $1
      `,
      [item_id]
    );

    res.json({
      success: true,
      message: "Feature item deleted successfully"
    });

  } catch (error) {

    console.error("Delete feature item error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete feature item",
      error: error.message
    });

  }

};