const fs = require('fs');

const tr = fs.readFileSync('apps/web/public/cal_files/cal-dom-tr.html', 'utf8');

const bannerIdx = 464545;
const copyrightIdx = 493580;
const sub = tr.substring(bannerIdx, copyrightIdx);

// Look for major framer names or components in this range
const framerNames = [...sub.matchAll(/data-framer-name="([^"]+)"/g)].map(m => m[1]);
console.log('Framer names between banner and copyright:', [...new Set(framerNames)]);
