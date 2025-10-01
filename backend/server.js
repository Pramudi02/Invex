const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { testConnection, syncDatabase } = require('./models');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Inventory Management System API',
    status: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    database: 'Connected',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Sync database (creates tables if they don't exist)
    await syncDatabase(false); // Set to true to drop and recreate tables
    
    // Start listening
    app.listen(PORT, () => {
      console.log('═══════════════════════════════════════');
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`📍 API URL: http://localhost:${PORT}`);
      console.log(`📊 Database: Connected & Synced`);
      console.log('═══════════════════════════════════════');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();