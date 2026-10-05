const fs = require('fs');

const tr = fs.readFileSync('apps/web/public/cal_files/cal-dom-tr.html', 'utf8');

const bannerIdx = tr.indexOf('Daha akıllı, daha sade randevu');
if (bannerIdx !== -1) {
  console.log('--- BANNER CONTEXT (before 1500 chars, after 3000 chars) ---');
  console.log(tr.substring(Math.max(0, bannerIdx - 1500), Math.min(tr.length, bannerIdx + 4500)));
}
