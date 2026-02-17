const express = require("express");
const router = express.Router();

const {
  importProjects,
  getAllProjects,
  getProjectBySlug
} = require("../controllers/propertyControllers");

const { importProjectImages } = require("../controllers/imageControllers");

// Imports
router.post("/importProjects", importProjects);
router.post("/import-images", importProjectImages);

// Fetch routes
router.get("/", getAllProjects);
router.get("/:slug", getProjectBySlug);

module.exports = router;
