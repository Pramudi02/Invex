const { testConnection, syncDatabase, User } = require('../models');

const fixStaffRole = async () => {
  try {
    await testConnection();
    await syncDatabase(false);

    const staff = await User.findOne({ where: { username: 'staff' } });
    if (!staff) {
      console.log('No user with username "staff" found.');
      process.exit(0);
    }

    if (staff.role === 'staff') {
      console.log('Staff user already has role "staff". No change needed.');
      console.log(`username: ${staff.username}, role: ${staff.role}`);
      process.exit(0);
    }

    console.log(`Fixing role for user 'staff' from '${staff.role}' -> 'staff'`);
    staff.role = 'staff';
    await staff.save();

    console.log('Role updated successfully.');
    console.log(`username: ${staff.username}, role: ${staff.role}`);
    process.exit(0);
  } catch (err) {
    console.error('Error fixing staff role:', err.message || err);
    process.exit(1);
  }
};

fixStaffRole();
