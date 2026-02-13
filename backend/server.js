// server.js


// server.js
const express = require("express");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], // Vite frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(express.json());

const projectRoutes = require("./routes/propertyRoutes");

app.use("/api/projects", projectRoutes);


app.listen(80, () => {
  console.log("Server running on port 80");
});