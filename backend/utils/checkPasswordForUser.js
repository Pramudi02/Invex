const { testConnection, syncDatabase, User } = require('../models');
const bcrypt = require('bcryptjs');

const check = async (username, plain) => {
  try {
    await testConnection();
    await syncDatabase(false);
    const user = await User.findOne({ where: { username }, attributes: ['id','username','password','role'] });
    if (!user) return console.log('User not found:', username);
    console.log('Found user:', user.username, 'role:', user.role);
    const match = await bcrypt.compare(plain, user.password);
    console.log('bcrypt.compare result for', username, ':', match);
  } catch (err) {
    console.error('Error:', err.message || err);
  }
};

const args = process.argv.slice(2);
const username = args[0] || 'staff';
const plain = args[1] || 'staff123';
check(username, plain);
