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

    // Hash password
    const hashedPassword = await bcrypt.hash('staff123', 10);

    // Create staff user
    const staff = await User.create({
      username: 'staff',
      password: hashedPassword,
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