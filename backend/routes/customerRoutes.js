const express = require("express");
const router = express.Router();
const { createCustomerEnquiry } = require("../controllers/customerController");

router.post("/create", createCustomerEnquiry);

module.exports = router;