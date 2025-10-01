const bcrypt = require('bcryptjs');
const { User, testConnection, syncDatabase } = require('../models');

const seedAdmin = async () => {
  try {
    // Connect to database
    await testConnection();
    await syncDatabase(false);

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      where: { username: 'admin' }
    });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('Username: admin');
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin user
    const admin = await User.create({
      username: 'admin',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('✅ Admin user created successfully!');
    console.log('═══════════════════════════════════════');
    console.log('📧 Username: admin');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: admin');
    console.log('═══════════════════════════════════════');
    console.log('⚠️  IMPORTANT: Change this password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();