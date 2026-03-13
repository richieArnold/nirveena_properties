const { S3Client, ListObjectsV2Command } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

exports.getIcons = async (req, res) => {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_BUCKET_NAME,
      Prefix: "feature-icons/",
    });

    const data = await s3.send(command);

    const icons =
      data.Contents?.map((item) => ({
        name: item.Key.split("/").pop(),
        url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`,
      })) || [];

    res.json({
      success: true,
      data: icons,
    });
  } catch (error) {
    console.error("Fetch icons error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch icons",
      error: error.message,
    });
  }
};