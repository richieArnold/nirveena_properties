const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const pool = require("../rds_setup/db/index");
require("dotenv").config();

/* ---------------- S3 CONFIG ---------------- */

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

/* ---------------- MULTER CONFIG ---------------- */

const uploadProjectLogoMiddleware = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const fileName = `project-logos/${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
});

/* ✅ EXPORT MIDDLEWARE */
exports.uploadProjectLogoMiddleware = uploadProjectLogoMiddleware;

/* ---------------- OPTIONAL: ONLY UPLOAD ---------------- */

exports.uploadProjectLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    res.json({
      success: true,
      logo_url: req.file.location,
    });
  } catch (error) {
    console.error("Upload error:", error);

    res.status(500).json({
      success: false,
      message: "Upload failed",
      error: error.message,
    });
  }
};

/* ---------------- MAIN: UPLOAD + SAVE ---------------- */

exports.uploadAndSaveProjectLogo = async (req, res) => {
  try {
    const { project_id } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    /* 🔍 CHECK PROJECT EXISTS */
    const projectCheck = await pool.query(
      `SELECT builder_logo FROM projects WHERE project_id = $1`,
      [project_id],
    );

    if (projectCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const oldLogo = projectCheck.rows[0].builder_logo;
    const newLogoUrl = req.file.location;

    /* 🔁 UPDATE DB */
    const result = await pool.query(
      `
      UPDATE projects
      SET builder_logo = $1
      WHERE project_id = $2
      RETURNING *
      `,
      [newLogoUrl, project_id],
    );

    /* 🧹 OPTIONAL: DELETE OLD LOGO FROM S3 */
    if (oldLogo) {
      try {
        const key = oldLogo.split(".amazonaws.com/")[1];

        if (key) {
          await s3.send(
            new DeleteObjectCommand({
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: key,
            }),
          );
        }
      } catch (err) {
        console.warn("Old logo delete failed:", err.message);
      }
    }

    res.json({
      success: true,
      message: "Logo uploaded and saved",
      logo_url: newLogoUrl,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Upload+Save error:", error);

    res.status(500).json({
      success: false,
      message: "Upload failed",
      error: error.message,
    });
  }
};
