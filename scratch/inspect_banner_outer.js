const fs = require('fs');

const tr = fs.readFileSync('apps/web/public/cal_files/cal-dom-tr.html', 'utf8');

const bannerIdx = tr.indexOf('framer-3gy7g1-container');
// Find parent tags
const before = tr.substring(bannerIdx - 3000, bannerIdx);
// Let's find all opening div tags before bannerIdx
const divMatches = [...before.matchAll(/<div[^>]*>/gi)];
console.log('Last 10 divs before framer-3gy7g1-container:');
for (const d of divMatches.slice(-10)) {
  console.log(d[0].substring(0, 150));
}

// Check what is between bannerIdx and footer
const footerIdx = tr.indexOf('framer-jNEDA');
console.log('\nFrom bannerIdx to footerIdx length:', footerIdx - bannerIdx);
console.log('Snippet after banner (last 1000 chars before footer):');
console.log(tr.substring(footerIdx - 1000, footerIdx));
