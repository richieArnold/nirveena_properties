const express = require('express');
const router = express.Router();
const { 
  login, 
  verifyToken,
  getProfile,
  updatePassword 
} = require('../controllers/authController');

// Public route
router.post('/login', login);

// Protected routes
router.get('/profile', verifyToken, getProfile);
router.put('/password', verifyToken, updatePassword);

module.exports = router;