const http = require('http');

http.get('http://localhost:3000', (res) => {
  console.log('Status code:', res.statusCode);
  process.exit(0);
}).on('error', (err) => {
  console.log('Error:', err.message);
  process.exit(1);
});
