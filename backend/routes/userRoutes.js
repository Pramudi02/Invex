const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserPassword,
  deleteUser,
  getMyProfile,
  updateMyPassword
} = require('../controllers/userController');
const authenticate = require('../middleware/auth');
const { isAdmin } = require('../middleware/roleCheck');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

// ==========================================
// AUTHENTICATED USER ROUTES (All users)
// ==========================================

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user's profile
 *     description: Retrieve the profile of the currently authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authorized
 *       404:
 *         description: User not found
 */
router.get('/me', authenticate, getMyProfile);

/**
 * @swagger
 * /api/users/me/password:
 *   put:
 *     summary: Update own password
 *     description: Allow authenticated user to update their own password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 description: Current password
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: New password (min 6 characters)
 *                 minLength: 6
 *           example:
 *             currentPassword: "oldpassword123"
 *             newPassword: "newpassword123"
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Bad request (validation error)
 *       401:
 *         description: Current password incorrect or not authorized
 *       404:
 *         description: User not found
 */
router.put('/me/password', authenticate, updateMyPassword);

// ==========================================
// ADMIN ONLY ROUTES
// ==========================================

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Users retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *                     count:
 *                       type: integer
 *                       example: 2
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Insufficient permissions (Admin only)
 */
router.get('/', authenticate, isAdmin, getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve a specific user by their ID (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Insufficient permissions (Admin only)
 *       404:
 *         description: User not found
 */
router.get('/:id', authenticate, isAdmin, getUserById);

/**
 * @swagger
 * /api/users/{id}/role:
 *   put:
 *     summary: Update user role
 *     description: Update a user's role (Admin only). Admin cannot change their own role.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [admin, staff]
 *                 description: New role for the user
 *           example:
 *             role: "admin"
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       400:
 *         description: Bad request (cannot change own role or invalid role)
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Insufficient permissions (Admin only)
 *       404:
 *         description: User not found
 */
router.put('/:id/role', authenticate, isAdmin, updateUserRole);

/**
 * @swagger
 * /api/users/{id}/password:
 *   put:
 *     summary: Update user password
 *     description: Update a user's password (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: New password (min 6 characters)
 *                 minLength: 6
 *           example:
 *             newPassword: "newpassword123"
 *     responses:
 *       200:
 *         description: User password updated successfully
 *       400:
 *         description: Bad request (invalid password)
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Insufficient permissions (Admin only)
 *       404:
 *         description: User not found
 */
router.put('/:id/password', authenticate, isAdmin, updateUserPassword);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user
 *     description: Delete a user (Admin only). Admin cannot delete their own account.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     deletedUser:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         username:
 *                           type: string
 *                         role:
 *                           type: string
 *       400:
 *         description: Bad request (cannot delete own account)
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Insufficient permissions (Admin only)
 *       404:
 *         description: User not found
 */
router.delete('/:id', authenticate, isAdmin, deleteUser);

module.exports = router;