const { testConnection, syncDatabase, User } = require('../models');
const bcrypt = require('bcryptjs');

const fixPassword = async () => {
  try {
    await testConnection();
    await syncDatabase(false);

    const staff = await User.findOne({ where: { username: 'staff' } });
    if (!staff) {
      console.log('Staff user not found.');
      process.exit(0);
    }

    const plain = 'staff123';
    const hashed = await bcrypt.hash(plain, 10);

    // Update password directly without running hooks to avoid double-hashing
    await User.update({ password: hashed }, { where: { username: 'staff' }, hooks: false });

    console.log('Staff password updated to new hash (hooks disabled).');
    process.exit(0);
  } catch (err) {
    console.error('Error fixing staff password:', err.message || err);
    process.exit(1);
  }
};

fixPassword();
