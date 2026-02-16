const express = require("express");
const router = express.Router();
const { importProjects } = require("../controllers/propertyControllers");
const {importProjectImages} = require("../controllers/imageControllers")

// POST /api/projects/import
router.post("/importProjects", importProjects);
router.post("/import-images", importProjectImages);

module.exports = router;