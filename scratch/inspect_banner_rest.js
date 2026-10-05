const fs = require('fs');

const tr = fs.readFileSync('apps/web/public/cal_files/cal-dom-tr.html', 'utf8');

const bannerIdx = tr.indexOf('framer-3gy7g1-container');
if (bannerIdx !== -1) {
  console.log(tr.substring(bannerIdx + 2000, bannerIdx + 6000));
}
