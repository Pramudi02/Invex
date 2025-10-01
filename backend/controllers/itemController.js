const { Item } = require('../models');
const { Op } = require('sequelize');

// Get all items (All authenticated users)
const getAllItems = async (req, res) => {
  try {
    const items = await Item.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      message: 'Items retrieved successfully',
      data: {
        items,
        count: items.length
      }
    });
  } catch (error) {
    console.error('Get all items error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve items',
      error: error.message
    });
  }
};

// Get item by ID (All authenticated users)
const getItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findByPk(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item retrieved successfully',
      data: { item }
    });
  } catch (error) {
    console.error('Get item by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve item',
      error: error.message
    });
  }
};

// Create new item (Admin only)
const createItem = async (req, res) => {
  try {
    const { name, description, quantity, price } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Item name is required'
      });
    }

    // Check if item already exists
    const existingItem = await Item.findOne({ where: { name } });
    if (existingItem) {
      return res.status(409).json({
        success: false,
        message: 'Item with this name already exists'
      });
    }

    // Create item
    const item = await Item.create({
      name,
      description: description || '',
      quantity: quantity || 0,
      price: price || 0.00
    });

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: { item }
    });
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create item',
      error: error.message
    });
  }
};

// Update item (Admin: full access, Staff: quantity only)
const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, quantity, price } = req.body;
    const userRole = req.user.role;

    // Find item
    const item = await Item.findByPk(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Role-based update logic
    if (userRole === 'admin') {
      // Admin can update everything
      if (name !== undefined) {
        // Check if new name conflicts with existing item
        if (name !== item.name) {
          const existingItem = await Item.findOne({ where: { name } });
          if (existingItem) {
            return res.status(409).json({
              success: false,
              message: 'Item with this name already exists'
            });
          }
        }
        item.name = name;
      }
      if (description !== undefined) item.description = description;
      if (quantity !== undefined) item.quantity = quantity;
      if (price !== undefined) item.price = price;
    } else if (userRole === 'staff') {
      // Staff can only update quantity
      if (name !== undefined || description !== undefined || price !== undefined) {
        return res.status(403).json({
          success: false,
          message: 'Staff can only update item quantity'
        });
      }
      if (quantity !== undefined) {
        item.quantity = quantity;
      } else {
        return res.status(400).json({
          success: false,
          message: 'No quantity provided to update'
        });
      }
    }

    await item.save();

    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      data: { item }
    });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update item',
      error: error.message
    });
  }
};

// Delete item (Admin only)
const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    // Find item
    const item = await Item.findByPk(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Store item info before deletion
    const deletedItem = {
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price
    };

    // Delete item
    await item.destroy();

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully',
      data: { deletedItem }
    });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete item',
      error: error.message
    });
  }
};

// Search items (All authenticated users)
const searchItems = async (req, res) => {
  try {
    const { query, minPrice, maxPrice, minQuantity, maxQuantity } = req.query;

    // Build search conditions
    const whereConditions = {};

    // Text search in name and description
    if (query) {
      whereConditions[Op.or] = [
        { name: { [Op.like]: `%${query}%` } },
        { description: { [Op.like]: `%${query}%` } }
      ];
    }

    // Price range filter
    if (minPrice || maxPrice) {
      whereConditions.price = {};
      if (minPrice) whereConditions.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) whereConditions.price[Op.lte] = parseFloat(maxPrice);
    }

    // Quantity range filter
    if (minQuantity || maxQuantity) {
      whereConditions.quantity = {};
      if (minQuantity) whereConditions.quantity[Op.gte] = parseInt(minQuantity);
      if (maxQuantity) whereConditions.quantity[Op.lte] = parseInt(maxQuantity);
    }

    const items = await Item.findAll({
      where: whereConditions,
      order: [['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      message: 'Search completed successfully',
      data: {
        items,
        count: items.length,
        filters: { query, minPrice, maxPrice, minQuantity, maxQuantity }
      }
    });
  } catch (error) {
    console.error('Search items error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search items',
      error: error.message
    });
  }
};

// Get low stock items (All authenticated users)
const getLowStockItems = async (req, res) => {
  try {
    const { threshold = 10 } = req.query; // Default threshold is 10

    const items = await Item.findAll({
      where: {
        quantity: { [Op.lte]: parseInt(threshold) }
      },
      order: [['quantity', 'ASC']]
    });

    res.status(200).json({
      success: true,
      message: 'Low stock items retrieved successfully',
      data: {
        items,
        count: items.length,
        threshold: parseInt(threshold)
      }
    });
  } catch (error) {
    console.error('Get low stock items error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve low stock items',
      error: error.message
    });
  }
};

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  searchItems,
  getLowStockItems
};