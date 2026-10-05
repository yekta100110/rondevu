const fs = require('fs');

const tr = fs.readFileSync('apps/web/public/cal_files/cal-dom-tr.html', 'utf8');

// Find the section that contains framer-3gy7g1-container
const bannerIdx = tr.indexOf('framer-3gy7g1-container');
const sectionStart = tr.lastIndexOf('<div class="framer-', bannerIdx - 100);
console.log('Section start around:', sectionStart);
console.log(tr.substring(bannerIdx - 800, bannerIdx + 1500));
