const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Simple admin credentials (in production, store in database)
const ADMIN_USER = {
  username: 'admin',
  // This is 'admin123' hashed - generate your own with bcrypt
  passwordHash: '$2a$10$YourHashedPasswordHere',
  id: 1
};

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Simple validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Check username (in production, query database)
    if (username !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Check password (in production, compare with bcrypt)
    // For now, simple check - in production use bcrypt.compare()
    if (password !== 'admin123') {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: 1, username: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: 1,
        username: 'admin'
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

// Middleware to verify token
exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};