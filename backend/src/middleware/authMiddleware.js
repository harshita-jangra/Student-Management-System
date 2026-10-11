const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes that require authentication
// Verifies the JSON Web Token (JWT) sent in the HTTP Authorization header
const protect = async (req, res, next) => {
  try {
    let token;

    // Check if Authorization header exists and begins with 'Bearer '
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Extract token string after 'Bearer '
      token = req.headers.authorization.split(' ')[1];
    }

    // If no token was found in the header, deny access
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please log in first.'
      });
    }

    // Verify token using secret key from environment variables
    const secret = process.env.JWT_SECRET || 'college_project_jwt_secret_key_123';
    const decoded = jwt.verify(token, secret);

    // Find the user corresponding to the token payload (excluding password)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User belonging to this token no longer exists.'
      });
    }

    // Attach user information to request object for downstream handlers
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please log in again.'
    });
  }
};

module.exports = { protect };
