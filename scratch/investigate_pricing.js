const fs = require('fs');

const en = fs.readFileSync('apps/web/public/cal_files/pricing-dom-en.html', 'utf8');
const tr = fs.readFileSync('apps/web/public/cal_files/pricing-dom-tr.html', 'utf8');

console.log('=== PRICING EN FOOTER ===');
const fIdxEn = en.indexOf('All rights reserved');
if (fIdxEn !== -1) {
  console.log(en.substring(Math.max(0, fIdxEn - 400), fIdxEn + 400));
}

console.log('=== PRICING TR FOOTER ===');
const fIdxTr = tr.indexOf('haklar');
if (fIdxTr !== -1) {
  console.log(tr.substring(Math.max(0, fIdxTr - 400), fIdxTr + 400));
}

console.log('=== PRICING EN BUFFER ROW ===');
const bIdxEn = en.indexOf('Buffer time before');
if (bIdxEn !== -1) {
  console.log(en.substring(Math.max(0, bIdxEn - 300), bIdxEn + 700));
}
