const express = require("express");
const cors = require("cors");   
const app = express();

app.use(cors());               
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Add this for form data

const projectRoutes = require("./routes/propertyRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/api/projects", projectRoutes);

const { S3Client, ListBucketsCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

app.get("/test-s3", async (req, res) => {
  try {
    const data = await s3.send(new ListBucketsCommand({}));
    res.json(data.Buckets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use("/api/auth", authRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});