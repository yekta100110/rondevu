const fs = require('fs');

const tr = fs.readFileSync('apps/web/public/cal_files/cal-dom-tr.html', 'utf8');

const zlIdx = tr.indexOf('framer-ZlJxc');
if (zlIdx !== -1) {
  const zlSub = tr.substring(zlIdx, zlIdx + 4500);
  const items = [...zlSub.matchAll(/data-framer-name="([^"]+)"[^>]*?style="([^"]*)"/g)];
  console.log('Items inside framer-ZlJxc:');
  for (const item of items) {
    console.log(item[1], '--> style:', item[2].substring(0, 150));
  }
}
