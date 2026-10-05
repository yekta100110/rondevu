const fs = require('fs');

const tr = fs.readFileSync('apps/web/public/cal_files/cal-dom-tr.html', 'utf8');

const copyrightIdx = tr.indexOf('© 2026 rOndevu');
console.log('Copyright index:', copyrightIdx);

const bannerIdx = tr.indexOf('framer-3gy7g1-container');
console.log('Banner index:', bannerIdx);

console.log('Distance between banner and copyright:', copyrightIdx - bannerIdx);

console.log('\n--- Between banner and copyright (3000 chars) ---');
console.log(tr.substring(bannerIdx, Math.min(tr.length, bannerIdx + 3000)));
