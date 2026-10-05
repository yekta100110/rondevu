const fs = require('fs');

const tr = fs.readFileSync('apps/web/public/cal_files/cal-dom-tr.html', 'utf8');

for (const cls of ['framer-qm9fst', 'framer-igaxec']) {
  const idx = tr.indexOf(cls);
  const endIdx = tr.indexOf('framer-l5bt33', idx);
  console.log(`\n=== Card ${cls} full content ===`);
  console.log(tr.substring(idx, Math.min(tr.length, idx + 3000)));
}
