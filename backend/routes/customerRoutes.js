const express = require("express");
const router = express.Router();
const {
  createCustomerEnquiry,
  getAllCustomers,
  getCustomerById,
  getAllEnquiries,
  deleteCustomer,
  deleteEnquiry,
  getCustomerStats
} = require("../controllers/customerController");
const { verifyToken } = require("../controllers/authController");

// Public route - no auth needed
router.post("/create", createCustomerEnquiry);

// Admin routes - protected
router.get("/stats", verifyToken, getCustomerStats);
router.get("/customers/all", verifyToken, getAllCustomers);
router.get("/customers/:id", verifyToken, getCustomerById);
router.delete("/customers/:id", verifyToken, deleteCustomer);
router.get("/enquiries/all", verifyToken, getAllEnquiries);
router.delete("/enquiries/:id", verifyToken, deleteEnquiry);

module.exports = router;