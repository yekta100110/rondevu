const fs = require('fs');

const tr = fs.readFileSync('apps/web/public/cal_files/cal-dom-tr.html', 'utf8');

for (const cls of ['framer-l5bt33', 'framer-cf392j']) {
  const idx = tr.indexOf(cls);
  console.log(`\n=== Card ${cls} full inner markup (first 1500 chars) ===`);
  console.log(tr.substring(idx, idx + 1500));
}
