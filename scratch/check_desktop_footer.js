const fs = require('fs');

const en = fs.readFileSync('apps/web/public/cal_files/pricing-dom-en.html', 'utf8');

const fIdx = en.indexOf('All rights reserved');
console.log('Desktop footer around All rights reserved:');
console.log(en.substring(Math.max(0, fIdx - 800), fIdx + 200));
