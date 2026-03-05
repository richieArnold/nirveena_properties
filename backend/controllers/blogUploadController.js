const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

exports.uploadMiddleware = upload.array("images");

exports.uploadBlogImages = async (req, res) => {
  try {

    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No images uploaded",
      });
    }

    const uploadedImages = [];

    for (const file of files) {

      const key = `blogs/${Date.now()}-${file.originalname}`;

      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await s3.send(command);

      const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

      uploadedImages.push(imageUrl);
    }

    res.json({
      success: true,
      images: uploadedImages,
    });

  } catch (error) {
    console.error("Upload error:", error);

    res.status(500).json({
      success: false,
      message: "Image upload failed",
    });
  }
};