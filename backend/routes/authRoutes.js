const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const authenticate = require('../middleware/auth');
const { isAdmin } = require('../middleware/roleCheck');

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and authorization endpoints
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user (Admin only). Creates a new user account with specified role.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *           example:
 *             username: "john_doe"
 *             email: "john@example.com"
 *             password: "password123"
 *             role: "staff"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request - Invalid input or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: User already exists
 *       401:
 *         description: Unauthorized - No token or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: Access denied. Admin only.
 */
router.post('/register', authenticate, isAdmin, register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticate user and receive JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           example:
 *             username: "admin"
 *             password: "admin123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *             example:
 *               message: Login successful
 *               token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *               user:
 *                 id: 1
 *                 username: admin
 *                 email: admin@inventory.com
 *                 role: admin
 *       400:
 *         description: Bad request - Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: Invalid credentials
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: User not found
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user profile
 *     description: Get the profile information of the currently authenticated user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User profile
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *             example:
 *               message: User profile
 *               user:
 *                 id: 1
 *                 username: admin
 *                 email: admin@inventory.com
 *                 role: admin
 *                 createdAt: "2025-10-01T10:30:00.000Z"
 *       401:
 *         description: Unauthorized - No token or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: Not authorized, no token
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: User not found
 */
router.get('/me', authenticate, getMe);

module.exports = router;