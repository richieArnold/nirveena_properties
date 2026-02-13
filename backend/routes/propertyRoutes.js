//propertyRoutes.js


const express = require("express");
const router = express.Router();
const {
  importProjects,
  getAllProjects,
} = require("../controllers/propertyControllers");



// POST /api/projects/import
router.post("/importProjects", importProjects);

// GET - all projects
router.get("/", getAllProjects);

module.exports = router;