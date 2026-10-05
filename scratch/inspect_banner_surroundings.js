const fs = require('fs');

const tr = fs.readFileSync('apps/web/public/cal_files/cal-dom-tr.html', 'utf8');

const bannerIdx = tr.indexOf('framer-12jqh3g');
if (bannerIdx !== -1) {
  console.log('--- SURROUNDING BANNER (before 1000 chars) ---');
  console.log(tr.substring(Math.max(0, bannerIdx - 1000), bannerIdx));
  console.log('\n--- BANNER START (after 2000 chars) ---');
  console.log(tr.substring(bannerIdx, bannerIdx + 2000));
}
