const express = require("express");
const router = express.Router();
const {
  importProjects,
  getAllProjects,
  getProjectBySlug,
  getProjectById,
  getAllPropertiesUnfiltered,      // ADD THIS
  updateProject,       // ADD THIS
  deleteProject
} = require("../controllers/propertyControllers");
const { importProjectImages } = require("../controllers/imageControllers");
const uploadController = require("../controllers/uploadController");

// Imports
router.post("/importProjects", importProjects);
router.post("/import-images", importProjectImages);

// Fetch routes
router.get("/getAllProjects", getAllProjects);
router.get("/getAllPropertiesUnfiltered", getAllPropertiesUnfiltered);
router.get("/getSingleProject/:slug", getProjectBySlug);
router.get("/getProject/:id", getProjectById);           // ADD THIS - Get project by ID for editing

// Admin routes
router.post(
  "/addProject", 
  uploadController.uploadImages,
  uploadController.addProjectWithImages
);

router.put(
  "/updateProject/:id", 
  uploadController.uploadImages,
  uploadController.updateProjectWithImages  // We'll create this next
);

router.delete("/deleteProject/:id", deleteProject);

module.exports = router;