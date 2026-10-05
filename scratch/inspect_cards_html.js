const fs = require('fs');

const tr = fs.readFileSync('apps/web/public/cal_files/cal-dom-tr.html', 'utf8');

// 1. Inspect Steps Card with SMS / Notifications:
const smsStepIdx = tr.indexOf('SMS ve e-posta ile otomatik hatırlatma');
if (smsStepIdx !== -1) {
  const cardStart = tr.lastIndexOf('<div class="framer-54l76e"', smsStepIdx);
  const cardEnd = tr.indexOf('</div></div></div></div></div>', smsStepIdx) + 4000;
  console.log('--- SMS CARD MOCKUP SNIPPET (approx 2000 chars) ---');
  console.log(tr.substring(smsStepIdx - 200, smsStepIdx + 3000));
}

// 2. Inspect "Danışanlarınız için akıcı akış" / Form card
const formCardIdx = tr.indexOf('Danışanlarınız için akıcı akış');
if (formCardIdx !== -1) {
  console.log('\n--- FORM CARD MOCKUP SNIPPET ---');
  console.log(tr.substring(formCardIdx - 200, formCardIdx + 3000));
}

// 3. Inspect "Ön bildirim ve mola süreleri"
const bufferCardIdx = tr.indexOf('Ön bildirim ve mola süreleri');
if (bufferCardIdx !== -1) {
  console.log('\n--- BUFFER CARD MOCKUP SNIPPET ---');
  console.log(tr.substring(bufferCardIdx - 200, bufferCardIdx + 3000));
}
