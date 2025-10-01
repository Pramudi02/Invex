const http = require('http');

const testUser = async (username, password) => {
  return new Promise((resolve) => {
    const postData = JSON.stringify({ username, password });
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', (err) => { resolve({ error: err.message || err }); });
    req.write(postData);
    req.end();
  });
};

const runTests = async () => {
  console.log('\nTesting admin login...');
  const adminResult = await testUser('admin', 'admin123');
  console.log('Admin result:', adminResult);

  console.log('\nTesting staff login...');
  const staffResult = await testUser('staff', 'staff123');
  console.log('Staff result:', staffResult);
};

runTests();
