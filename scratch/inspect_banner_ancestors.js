const fs = require('fs');

const tr = fs.readFileSync('apps/web/public/cal_files/cal-dom-tr.html', 'utf8');

const bannerIdx = tr.indexOf('framer-3gy7g1-container');
console.log('--- 2000 chars before framer-3gy7g1-container ---');
console.log(tr.substring(bannerIdx - 2000, bannerIdx));
