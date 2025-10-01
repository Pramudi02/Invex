const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Item = sequelize.define('Item', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: {
      msg: 'Item name already exists'
    },
    validate: {
      notEmpty: {
        msg: 'Item name cannot be empty'
      },
      len: {
        args: [2, 100],
        msg: 'Item name must be between 2 and 100 characters'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: ''
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'Quantity cannot be negative'
      },
      isInt: {
        msg: 'Quantity must be an integer'
      }
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0.00,
    validate: {
      min: {
        args: [0],
        msg: 'Price cannot be negative'
      },
      isDecimal: {
        msg: 'Price must be a valid decimal number'
      }
    }
  }
}, {
  tableName: 'items',
  timestamps: true, // Adds createdAt and updatedAt
  indexes: [
    {
      unique: true,
      fields: ['name']
    }
  ]
});

module.exports = Item;