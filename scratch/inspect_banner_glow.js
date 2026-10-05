const fs = require('fs');

const tr = fs.readFileSync('apps/web/public/cal_files/cal-dom-tr.html', 'utf8');

const bannerIdx = tr.indexOf('framer-3gy7g1-container');
const bannerEnd = tr.indexOf('framer-jNEDA', bannerIdx);
const bannerHtml = tr.substring(bannerIdx, bannerEnd !== -1 ? bannerEnd : bannerIdx + 15000);

console.log('Banner HTML length:', bannerHtml.length);

// Look for mask, radial, gradient, glow, or images
const bgMatches = [...bannerHtml.matchAll(/style="[^"]*background[^"]*"/gi)];
console.log('Background styles in banner:');
for (const b of bgMatches) {
  console.log(b[0]);
}

// Check images in banner
const imgMatches = [...bannerHtml.matchAll(/<img[^>]*src="([^"]+)"[^>]*>/gi)];
console.log('\nImages in banner:');
for (const img of imgMatches) {
  console.log(img[1]);
}
