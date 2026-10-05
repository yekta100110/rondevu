const fs = require('fs');

const tr = fs.readFileSync('apps/web/public/cal_files/cal-dom-tr.html', 'utf8');

const zlIdx = tr.indexOf('framer-ZlJxc');
if (zlIdx !== -1) {
  const zlSub = tr.substring(zlIdx, zlIdx + 4500);
  const m = zlSub.match(/name="1"[\s\S]*?<\/div><\/div><\/div>/);
  if (m) {
    console.log('Item 1:', m[0].substring(0, 500));
  } else {
    console.log('No item 1 found with simple regex, printing lines with name=');
    for (const match of zlSub.matchAll(/name="([^"]+)"/g)) {
      console.log('name:', match[1]);
    }
  }
}
