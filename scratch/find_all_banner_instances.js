const fs = require('fs');

const tr = fs.readFileSync('apps/web/public/cal_files/cal-dom-tr.html', 'utf8');

const regex = /Daha akıllı, daha sade randevu/g;
let m;
while ((m = regex.exec(tr)) !== null) {
  const pos = m.index;
  console.log(`\nFound at index ${pos}:`);
  console.log('Surrounding 400 chars:');
  console.log(tr.substring(Math.max(0, pos - 200), Math.min(tr.length, pos + 300)));
}
