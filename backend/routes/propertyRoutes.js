const express = require("express");
const router = express.Router();

/* ---------------- CONTROLLERS ---------------- */

// Property
const {
  importProjects,
  getAllProjects,
  getProjectBySlug,
  getProjectById,
  getAllPropertiesUnfiltered,
  updateProject,
  deleteProject,
  updateDisplayOrder,
  getPropertyTypes,
  savePropertyType,
  getProjectFullDetails,
} = require("../controllers/propertyControllers");

// Images
const { importProjectImages } = require("../controllers/imageControllers");

// Upload (Project Images)
const uploadController = require("../controllers/uploadController");

// Features & Connectivity
const {
  bulkUpsertFeatures,
  bulkUpsertConnectivity,
  uploadIcon,
  uploadIconMiddleware,
} = require("../controllers/featureController");

// Configurations & Floor Plans
// Configurations & Floor Plans
const {
  bulkUpsertConfigurations,
  bulkInsertFloorPlans,
  uploadFloorPlan,
} = require("../controllers/floorConfigController");

// Icons
const { getIcons } = require("../controllers/iconController");

// Logo
const {
  uploadAndSaveProjectLogo,
  uploadProjectLogoMiddleware,
} = require("../controllers/logoController");

/* =========================================================
   ======================= IMPORT ===========================
   ========================================================= */

router.post("/importProjects", importProjects);
router.post("/import-images", importProjectImages);

/* =========================================================
   ======================= LOGO =============================
   ========================================================= */

router.post(
  "/logo/:project_id/logo",
  uploadProjectLogoMiddleware.single("logo"),
  uploadAndSaveProjectLogo,
);

/* =========================================================
   ======================= FETCH ============================
   ========================================================= */

router.get("/getAllProjects", getAllProjects);
router.get("/getAllPropertiesUnfiltered", getAllPropertiesUnfiltered);

router.get("/getSingleProject/:slug", getProjectBySlug);
router.get("/full-details/:slug", getProjectFullDetails);

router.get("/getProject/:id", getProjectById);

router.put("/:id/update-display-order", updateDisplayOrder);

router.get("/property-types", getPropertyTypes);
router.post("/property-types", savePropertyType);

/* =========================================================
   =================== BULK APIs (🔥 CORE) ==================
   ========================================================= */

/**
 * FEATURES (Bulk Insert/Update/Delete)
 */
router.post("/:project_id/bulk-features", bulkUpsertFeatures);

/**
 * CONFIGURATIONS (Bulk)
 */
router.post("/:project_id/bulk-configurations", bulkUpsertConfigurations);

/**
 * FLOOR PLANS (Bulk + Images)
 */
router.post(
  "/:project_id/bulk-floorplans",
  uploadFloorPlan.array("images"),
  bulkInsertFloorPlans,
);
/**
 * CONNECTIVITY (Bulk)
 */
router.post("/:project_id/bulk-connectivity", bulkUpsertConnectivity);

/* =========================================================
   ======================= ICONS ============================
   ========================================================= */

router.post("/upload/icon", uploadIconMiddleware.single("icon"), uploadIcon);

router.get("/icons", getIcons);

/* =========================================================
   ======================= ADMIN ============================
   ========================================================= */

/**
 * ADD PROJECT
 */
router.post(
  "/addProject",
  uploadController.uploadImages,
  uploadController.addProjectWithImages,
);

/**
 * UPDATE PROJECT
 */
router.put(
  "/updateProject/:id",
  uploadController.uploadImages,
  uploadController.updateProjectWithImages,
);

/**
 * DELETE PROJECT
 */
router.delete("/deleteProject/:id", deleteProject);

// reorder images
router.put("/images/order", uploadController.updateImageOrder);

module.exports = router;
