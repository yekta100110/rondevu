const fs = require('fs');

const en = fs.readFileSync('apps/web/public/cal_files/pricing-dom-en.html', 'utf8');

const fIdx = en.indexOf('All rights reserved');
console.log('--- Substring 1500 chars before and 500 after footer: ---');
console.log(en.substring(Math.max(0, fIdx - 1500), fIdx + 500));
