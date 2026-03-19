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
  updateProjectFeature,
  deleteProjectFeature,
  deleteFeatureItem,
  getConnectivity,
} = require("../controllers/featureController");
const {
  addConfiguration,
  getProjectConfigurations,
  addFloorPlan,
  uploadFloorPlan,
  getProjectFloorPlans,
  deleteConfiguration,
  deleteFloorPlan,
} = require("../controllers/floorConfigController");
const { getIcons } = require("../controllers/iconController");
const { uploadAndSaveProjectLogo, uploadProjectLogoMiddleware } = require("../controllers/logoController");

// Imports
router.post("/importProjects", importProjects);
router.post("/import-images", importProjectImages);

router.post(
  "/logo/:project_id/logo",
  uploadProjectLogoMiddleware.single("logo"),
  uploadAndSaveProjectLogo
);

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
router.put("/features/:feature_id", updateProjectFeature);
router.delete("/features/:feature_id", deleteProjectFeature);
router.delete("/feature-item/:item_id", deleteFeatureItem);
router.get("/connectivity/:project_id", getConnectivity);

router.post("/upload/icon", uploadIconMiddleware.single("icon"), uploadIcon);
router.get("/icons", getIcons);
router.post("/:project_id/addConfiguration", addConfiguration);
router.get("/:project_id/getProjectConfigurations", getProjectConfigurations);
router.delete("/configuration/:id", deleteConfiguration);

router.post(
  "/:project_id/floorplans",
  uploadFloorPlan.single("image"),
  addFloorPlan,
);
router.get("/:project_id/floorplans", getProjectFloorPlans);
router.delete("/floorplan/:id", deleteFloorPlan);
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
