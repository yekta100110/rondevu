const fs = require('fs');

const tr = fs.readFileSync('apps/web/public/cal_files/cal-dom-tr.html', 'utf8');

const smsStepIdx = tr.indexOf('SMS ve e-posta ile otomatik hatırlatma');
if (smsStepIdx !== -1) {
  console.log('--- SMS CARD MOCKUP SNIPPET ---');
  console.log(tr.substring(smsStepIdx, smsStepIdx + 2500));
}
