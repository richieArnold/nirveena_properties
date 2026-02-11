// server.js
const express = require("express");
const app = express();

app.use(express.json());

const projectRoutes = require("./routes/propertyRoutes");

app.use("/api/projects", projectRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});