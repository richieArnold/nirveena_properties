//propertyRoutes.js


const express = require("express");
const router = express.Router();
const {
  importProjects,
  getAllProjects,
} = require("../controllers/propertyControllers");



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
router.get("/getAllProjects", getAllProjects);
//single project 
router.get("/getSingleProject/:slug", getProjectBySlug);

module.exports = router;
