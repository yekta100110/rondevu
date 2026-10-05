const fs = require('fs');

const tr = fs.readFileSync('apps/web/public/cal_files/cal-dom-tr.html', 'utf8');

const bannerIdx = tr.indexOf('framer-3gy7g1-container');
console.log('framer-3gy7g1-container found at:', bannerIdx);

if (bannerIdx !== -1) {
  // Let's find where this section starts and ends
  const before = tr.substring(bannerIdx - 500, bannerIdx);
  console.log('\n--- BEFORE CONTAINER ---');
  console.log(before);
  
  const content = tr.substring(bannerIdx, bannerIdx + 5000);
  console.log('\n--- CONTAINER CONTENT (5000 chars) ---');
  console.log(content);
}
