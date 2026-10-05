const fs = require('fs');

const tr = fs.readFileSync('apps/web/public/cal_files/cal-dom-tr.html', 'utf8');

for (const cls of ['framer-1tym5sg', 'framer-qm9fst', 'framer-igaxec']) {
  const idx = tr.indexOf(cls);
  console.log(`\n=== Card ${cls} full inner markup (first 1000 chars) ===`);
  console.log(tr.substring(idx, idx + 1000));
}
