const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/auth - Status and endpoint list (friendly check in browser)
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Auth API is running smoothly',
    endpoints: {
      register: 'POST /api/auth/register (Requires: name, email, password)',
      login: 'POST /api/auth/login (Requires: email, password)',
      me: 'GET /api/auth/me (Requires: Authorization: Bearer <token>)'
    }
  });
});

// POST /api/auth/register - Register a new user
router.post('/register', registerUser);

// POST /api/auth/login - Log in an existing user
router.post('/login', loginUser);

// GET /api/auth/me - Protected route to verify JWT authentication
router.get('/me', protect, getMe);

module.exports = router;

