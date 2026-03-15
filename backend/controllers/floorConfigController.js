const pool = require('../rds_setup/db');
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");

exports.addConfiguration = async (req, res) => {
  try {
    const { project_id } = req.params;
    const { configuration, size_range, price } = req.body;

    await pool.query(
      `
      INSERT INTO project_configurations
      (project_id, configuration, size_range, price)
      VALUES ($1,$2,$3,$4)
      `,
      [project_id, configuration, size_range, price]
    );

    res.json({
      success: true,
      message: "Configuration added",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add configuration",
      error: error.message,
    });
  }
};


exports.getProjectConfigurations = async (req, res) => {
  try {
    const { project_id } = req.params;

    const result = await pool.query(
      `
      SELECT
        id,
        configuration,
        size_range,
        price,
        sort_order
      FROM project_configurations
      WHERE project_id = $1
      ORDER BY sort_order
      `,
      [project_id]
    );

    res.json({
      success: true,
      data: result.rows,
    });

  } catch (error) {
    console.error("Get configurations error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch configurations",
      error: error.message,
    });
  }
};

exports.deleteFloorPlan = async (req, res) => {

  try {

    const { id } = req.params;

    const result = await pool.query(
      `SELECT image_url FROM project_floor_plans WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Floor plan not found"
      });
    }

    const imageUrl = result.rows[0].image_url;

    // extract key from URL
    const key = imageUrl.split(".amazonaws.com/")[1];

    // delete from S3
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key
      })
    );

    // delete DB record
    await pool.query(
      `DELETE FROM project_floor_plans WHERE id = $1`,
      [id]
    );

    res.json({
      success: true,
      message: "Floor plan deleted successfully"
    });

  } catch (error) {

    console.error("Delete floorplan error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete floor plan",
      error: error.message
    });

  }

};

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

exports.uploadFloorPlan = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const fileName = `floorplans/${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
});

exports.deleteConfiguration = async (req, res) => {
  try {

    const { id } = req.params;

    // delete linked floorplans first
    await pool.query(
      `DELETE FROM project_floor_plans WHERE configuration_id = $1`,
      [id]
    );

    // delete configuration
    await pool.query(
      `DELETE FROM project_configurations WHERE id = $1`,
      [id]
    );

    res.json({
      success: true,
      message: "Configuration deleted successfully"
    });

  } catch (error) {

    console.error("Delete configuration error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete configuration",
      error: error.message
    });

  }
};

exports.addFloorPlan = async (req, res) => {
  try {

    const { project_id } = req.params;
    const { configuration_id, title, area } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Floor plan image required"
      });
    }

    const imageUrl = req.file.location;

    await pool.query(
      `
      INSERT INTO project_floor_plans
      (project_id, configuration_id, title, area, image_url)
      VALUES ($1,$2,$3,$4,$5)
      `,
      [
        project_id,
        configuration_id,
        title,
        area,
        imageUrl
      ]
    );

    res.json({
      success: true,
      message: "Floor plan added successfully",
      image_url: imageUrl
    });

  } catch (error) {

    console.error("Floor plan error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add floor plan",
      error: error.message
    });
  }
};

exports.getProjectFloorPlans = async (req, res) => {
  try {

    const { project_id } = req.params;

    const result = await pool.query(
      `
      SELECT
        id,
        configuration_id,
        title,
        area,
        image_url,
        sort_order
      FROM project_floor_plans
      WHERE project_id = $1
      ORDER BY sort_order
      `,
      [project_id]
    );

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch floor plans",
      error: error.message
    });
  }
};