const express = require("express");
const router = express.Router();
const {
  importProjects,
  getAllProjects,
  getProjectBySlug,
  deleteProject  // ADD THIS IMPORT
} = require("../controllers/propertyControllers");
const { importProjectImages } = require("../controllers/imageControllers");
const uploadController = require("../controllers/uploadController");

// Imports
router.post("/importProjects", importProjects);
router.post("/import-images", importProjectImages);

// Fetch routes
router.get("/getAllProjects", getAllProjects);
router.get("/getSingleProject/:slug", getProjectBySlug);

// Admin routes
router.post(
  "/addProject", 
  uploadController.uploadImages,
  uploadController.addProjectWithImages
);

// ADD THIS DELETE ROUTE
router.delete("/deleteProject/:id", deleteProject);

module.exports = router;