const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: {
      msg: 'Username already exists'
    },
    validate: {
      notEmpty: {
        msg: 'Username cannot be empty'
      },
      len: {
        args: [3, 50],
        msg: 'Username must be between 3 and 50 characters'
      }
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Password cannot be empty'
      }
    }
  },
  role: {
    type: DataTypes.ENUM('ADMIN', 'STAFF'),
    allowNull: false,
    defaultValue: 'STAFF',
    validate: {
      isIn: {
        args: [['ADMIN', 'STAFF']],
        msg: 'Role must be either ADMIN or STAFF'
      }
    }
  }
}, {
  tableName: 'users',
  timestamps: true, // Adds createdAt and updatedAt
  hooks: {
    // Remove password from JSON responses
    afterFind: (users) => {
      if (Array.isArray(users)) {
        users.forEach(user => {
          if (user.dataValues) {
            delete user.dataValues.password;
          }
        });
      } else if (users && users.dataValues) {
        delete users.dataValues.password;
      }
    }
  }
});

// Instance method to hide password in JSON
User.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

module.exports = User;