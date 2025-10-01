const bcrypt = require('bcryptjs');
const { User, testConnection, syncDatabase } = require('../models');

const seedStaff = async () => {
  try {
    // Connect to database
    await testConnection();
    await syncDatabase(false);

    // Check if staff already exists
    const existingStaff = await User.findOne({
      where: { username: 'staff' }
    });

    if (existingStaff) {
      console.log('⚠️  Staff user already exists!');
      console.log('Username: staff');
      process.exit(0);
    }

    // Create staff user (password will be hashed by model hook)
    const staff = await User.create({
      username: 'staff',
      password: 'staff123',
      role: 'staff'
    });

    console.log('✅ Staff user created successfully!');
    console.log('═══════════════════════════════════════');
    console.log('📧 Username: staff');
    console.log('🔑 Password: staff123');
    console.log('👤 Role: staff');
    console.log('═══════════════════════════════════════');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding staff:', error.message);
    process.exit(1);
  }
};

seedStaff();