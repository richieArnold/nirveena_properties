const express = require("express");
const router = express.Router();
const { importProjects } = require("../controllers/propertyControllers");

// POST /api/projects/import
router.post("/importProjects", importProjects);

module.exports = router;