// server.js
const express = require("express");
const app = express();

app.use(express.json());

const projectRoutes = require("./routes/propertyRoutes");

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

app.listen(5000, () => {
  console.log("Server running on port 5000");
});