const express = require('express');
const router = express.Router();
const {
  uploadExcel,
  importProjectsFromExcel,
  getColumnMappingGuide,
  downloadSampleTemplate
} = require('../controllers/excelImportController');
const { verifyToken } = require('../controllers/authController');

// All routes are protected
router.use(verifyToken);

// Get column mapping guide
router.get('/guide', getColumnMappingGuide);

// Download sample template
router.get('/template', downloadSampleTemplate);

// Import projects from Excel
router.post('/import', uploadExcel, importProjectsFromExcel);

module.exports = router;