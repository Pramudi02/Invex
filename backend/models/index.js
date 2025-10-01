const { sequelize, testConnection } = require('../config/database');
// const User = require('./User'); // Commented out - User model not created yet
const Item = require('./Item');

// Define relationships here if needed in future
// Example: User.hasMany(Item, { foreignKey: 'userId' });

// Sync all models with database
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force }); // force: true will drop tables
    console.log('✅Database synced successfully');
  } catch (error) {
    console.error('❌Error syncing database:', error.message);
    throw error;
  }
};

module.exports = {
  sequelize,
  testConnection,
  syncDatabase,
  // User, // Commented out - User model not created yet
  Item
};