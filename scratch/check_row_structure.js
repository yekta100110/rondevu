const fs = require('fs');

const en = fs.readFileSync('apps/web/public/cal_files/pricing-dom-en.html', 'utf8');
const tr = fs.readFileSync('apps/web/public/cal_files/pricing-dom-tr.html', 'utf8');

console.log('=== EN around 109561 ===');
console.log(en.substring(109300, 112000));
