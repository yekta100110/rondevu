const fs = require('fs');

const tr = fs.readFileSync('apps/web/public/cal_files/cal-dom-tr.html', 'utf8');

const ttsIdx = tr.indexOf('talk-to-sales');
if (ttsIdx !== -1) {
  console.log(tr.substring(ttsIdx, ttsIdx + 4000));
}
