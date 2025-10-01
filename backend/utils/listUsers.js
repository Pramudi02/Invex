const { testConnection, syncDatabase, User } = require('../models');

const listUsers = async () => {
  try {
    await testConnection();
    // Do not force sync; just ensure DB is reachable
    await syncDatabase(false);

    const users = await User.findAll({ attributes: ['id', 'username', 'role', 'password', 'createdAt'] });
    if (!users || users.length === 0) {
      console.log('No users found in the database.');
      process.exit(0);
    }

    console.log('Users in database:');
    users.forEach(u => {
      console.log('-----------------------------');
      console.log(`id: ${u.id}`);
      console.log(`username: ${u.username}`);
      console.log(`role: ${u.role}`);
      console.log(`passwordHash: ${u.password}`);
      console.log(`createdAt: ${u.createdAt}`);
    });

    process.exit(0);
  } catch (err) {
    console.error('Error listing users:', err.message || err);
    process.exit(1);
  }
};

listUsers();
