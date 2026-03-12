const express = require("express");
const router = express.Router();
const {
  importProjects,
  getAllProjects,
  getProjectBySlug,
  getProjectById,
  getAllPropertiesUnfiltered, // ADD THIS
  updateProject, // ADD THIS
  deleteProject,
  updateDisplayOrder,
  getPropertyTypes,
  savePropertyType,
} = require("../controllers/propertyControllers");
const { importProjectImages } = require("../controllers/imageControllers");
const uploadController = require("../controllers/uploadController");
const {
  addProjectFeature,
  getProjectFeatures,
  uploadIcon,
  uploadIconMiddleware,
} = require("../controllers/featureController");
const {
  addConfiguration,
  getProjectConfigurations,
  addFloorPlan,
  uploadFloorPlan,
  getProjectFloorPlans
} = require("../controllers/floorConfigController");

// Imports
router.post("/importProjects", importProjects);
router.post("/import-images", importProjectImages);

// Fetch routes
router.get("/getAllProjects", getAllProjects);
router.get("/getAllPropertiesUnfiltered", getAllPropertiesUnfiltered);
router.get("/getSingleProject/:slug", getProjectBySlug);
router.get("/getProject/:id", getProjectById);
router.put("/:id/update-display-order", updateDisplayOrder);
router.get("/property-types", getPropertyTypes);
router.post("/property-types", savePropertyType); // ADD THIS - Get project by ID for editing

router.post("/:project_id/features", addProjectFeature);
router.get("/:project_id/features", getProjectFeatures);
router.post("/upload/icon", uploadIconMiddleware.single("icon"), uploadIcon);
router.post("/:project_id/addConfiguration", addConfiguration);
router.get("/:project_id/getProjectConfigurations", getProjectConfigurations);
router.post(
  "/:project_id/floorplans",
  uploadFloorPlan.single("floorplan"),
  addFloorPlan
);
router.get(
  "/:project_id/floorplans",getProjectFloorPlans);

// Admin routes
router.post(
  "/addProject",
  uploadController.uploadImages,
  uploadController.addProjectWithImages,
);

router.put(
  "/updateProject/:id",
  uploadController.uploadImages,
  uploadController.updateProjectWithImages, // We'll create this next
);

router.delete("/deleteProject/:id", deleteProject);

module.exports = router;
