const express = require('express');
const router = express.Router();
const {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  searchItems,
  getLowStockItems
} = require('../controllers/itemController');
const authenticate = require('../middleware/auth');
const { isAdmin } = require('../middleware/roleCheck');

// ==========================================
// PUBLIC/AUTHENTICATED USER ROUTES
// ==========================================

/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Get all items
 *     description: Retrieve all inventory items. Accessible to all authenticated users.
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Item'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', authenticate, getAllItems);

/**
 * @swagger
 * /api/items/search:
 *   get:
 *     summary: Search items
 *     description: Search for items by name, description, or category. Accessible to all authenticated users.
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Search query string
 *         example: laptop
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *         example: Electronics
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Item'
 *       400:
 *         description: Missing search query
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/search', authenticate, searchItems);

/**
 * @swagger
 * /api/items/low-stock:
 *   get:
 *     summary: Get low stock items
 *     description: Retrieve items with quantity below the minimum stock level. Accessible to all authenticated users.
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: threshold
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Stock threshold (items with quantity below this value)
 *         example: 10
 *     responses:
 *       200:
 *         description: List of low stock items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Item'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/low-stock', authenticate, getLowStockItems);

/**
 * @swagger
 * /api/items/{id}:
 *   get:
 *     summary: Get item by ID
 *     description: Retrieve a specific item by its ID. Accessible to all authenticated users.
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Item ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Item details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Item'
 *       404:
 *         description: Item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/:id', authenticate, getItemById);

// ==========================================
// ADMIN ONLY ROUTES
// ==========================================

/**
 * @swagger
 * /api/items:
 *   post:
 *     summary: Create new item
 *     description: Create a new inventory item. Admin only.
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - category
 *               - quantity
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: Dell Laptop
 *               description:
 *                 type: string
 *                 example: High-performance laptop with 16GB RAM
 *               category:
 *                 type: string
 *                 example: Electronics
 *               quantity:
 *                 type: integer
 *                 minimum: 0
 *                 example: 50
 *               price:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 example: 999.99
 *               minStockLevel:
 *                 type: integer
 *                 minimum: 0
 *                 example: 10
 *     responses:
 *       201:
 *         description: Item created successfully
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
 *                   example: Item created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Item'
 *       400:
 *         description: Validation error
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/', authenticate, isAdmin, createItem);

/**
 * @swagger
 * /api/items/{id}:
 *   delete:
 *     summary: Delete item
 *     description: Delete an item from inventory. Admin only.
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Item ID to delete
 *         example: 1
 *     responses:
 *       200:
 *         description: Item deleted successfully
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
 *                   example: Item deleted successfully
 *       404:
 *         description: Item not found
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete('/:id', authenticate, isAdmin, deleteItem);

// ==========================================
// MIXED ACCESS ROUTES
// ==========================================

/**
 * @swagger
 * /api/items/{id}:
 *   put:
 *     summary: Update item
 *     description: Update an item's details. Admin can update all fields, Staff can only update quantity.
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Item ID to update
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Dell Laptop Pro
 *                 description: Admin only
 *               description:
 *                 type: string
 *                 example: Updated description
 *                 description: Admin only
 *               category:
 *                 type: string
 *                 example: Electronics
 *                 description: Admin only
 *               quantity:
 *                 type: integer
 *                 minimum: 0
 *                 example: 45
 *                 description: Admin and Staff can update
 *               price:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 example: 1099.99
 *                 description: Admin only
 *               minStockLevel:
 *                 type: integer
 *                 minimum: 0
 *                 example: 15
 *                 description: Admin only
 *     responses:
 *       200:
 *         description: Item updated successfully
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
 *                   example: Item updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Item'
 *       400:
 *         description: Validation error or staff trying to update restricted fields
 *       404:
 *         description: Item not found
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Staff users can only update quantity
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put('/:id', authenticate, updateItem);

module.exports = router;