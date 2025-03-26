const express = require('express');
const { register, login, getMe, updateProfile } = require('../controllers/authController.js');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Routes
router.post('/register', register);
router.post('/login', login);

// Use route chaining for '/me' endpoints
router.route('/me')
  .get(protect, getMe)
  .put(protect, updateProfile);

module.exports = router;