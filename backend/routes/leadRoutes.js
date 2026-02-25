const express = require("express");
const router = express.Router();
const {
  submitLead,
  getAllLeads,
  getLeadById,
  updateLeadStatus,
  updateLeadNotes,
  getLeadsStats,
  deleteLead
} = require("../controllers/leadController");
const { verifyToken } = require("../controllers/authController");

// Public route - no authentication needed
router.post("/submit", submitLead);

// Admin routes - protected
router.get("/stats", verifyToken, getLeadsStats);
router.get("/all", verifyToken, getAllLeads);
router.get("/:id", verifyToken, getLeadById);
router.put("/:id/status", verifyToken, updateLeadStatus);
router.put("/:id/notes", verifyToken, updateLeadNotes);
router.delete("/:id", verifyToken, deleteLead);

module.exports = router;