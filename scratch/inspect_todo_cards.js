const fs = require('fs');

const tr = fs.readFileSync('apps/web/public/cal_files/cal-dom-tr.html', 'utf8');

for (const name of ['Hour Wrapper', 'To-do cards', 'framer-11t5dr2']) {
  const idx = tr.indexOf(name);
  if (idx !== -1) {
    console.log(`\n=== Context for ${name} ===`);
    console.log(tr.substring(Math.max(0, idx - 150), Math.min(tr.length, idx + 400)));
  }
}
