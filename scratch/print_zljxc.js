const fs = require('fs');

const tr = fs.readFileSync('apps/web/public/cal_files/cal-dom-tr.html', 'utf8');

const zlIdx = tr.indexOf('framer-ZlJxc');
if (zlIdx !== -1) {
  console.log('--- framer-ZlJxc FULL MOCKUP ---');
  console.log(tr.substring(zlIdx, zlIdx + 4500));
}
