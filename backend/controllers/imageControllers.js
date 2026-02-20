const { S3Client, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const pool = require("../rds_setup/db/index");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

exports.importProjectImages = async (req, res) => {
  try {
    const { rows: projects } = await pool.query(
      "SELECT id, slug FROM projects"
    );

    for (const project of projects) {
        let i = 0;
      const command = new ListObjectsV2Command({
        Bucket: process.env.AWS_BUCKET_NAME,
        Prefix: `images/${project.slug}/`,
      });

      const data = await s3.send(command);

      if (!data.Contents) continue;

      for (const file of data.Contents) {
        if (file.Key.endsWith("/")) continue;

        const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.Key}`;

        await pool.query(
          `
          INSERT INTO project_images (project_id, image_url,sort_order)
          VALUES ($1, $2, $3)
          ON CONFLICT DO NOTHING
          `,
          [project.id, imageUrl, i]
        );
        i++;
      }
    }

    res.json({
      success: true,
      message: "Images imported successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Image import failed",
      error: error.message,
    });
  }
};