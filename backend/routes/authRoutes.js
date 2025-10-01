const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const authenticate = require('../middleware/auth');
const { isAdmin } = require('../middleware/roleCheck');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Admin only
 */
router.post('/register', authenticate, isAdmin, register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private (authenticated users)
 */
router.get('/me', authenticate, getMe);

module.exports = router;