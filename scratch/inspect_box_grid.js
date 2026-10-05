const fs = require('fs');

const tr = fs.readFileSync('apps/web/public/cal_files/cal-dom-tr.html', 'utf8');

const gridIdx = tr.indexOf('Background Box Grid');
console.log('Background Box Grid found at:', gridIdx);

if (gridIdx !== -1) {
  console.log('\n--- 1500 chars before Background Box Grid ---');
  console.log(tr.substring(gridIdx - 1500, gridIdx));
  console.log('\n--- 3000 chars after Background Box Grid ---');
  console.log(tr.substring(gridIdx, gridIdx + 3000));
}
