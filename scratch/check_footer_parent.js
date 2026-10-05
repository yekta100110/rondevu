const fs = require('fs');

const en = fs.readFileSync('apps/web/public/cal_files/pricing-dom-en.html', 'utf8');

const fIdx = en.indexOf('All rights reserved');
console.log('Containers before All rights reserved:');
console.log(en.substring(Math.max(0, fIdx - 2500), fIdx - 700));
