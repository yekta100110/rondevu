const fs = require('fs');

const en = fs.readFileSync('apps/web/public/cal_files/pricing-dom-en.html', 'utf8');
const tr = fs.readFileSync('apps/web/public/cal_files/pricing-dom-tr.html', 'utf8');

const idxEn = en.indexOf('feature-breakdown');
console.log('feature-breakdown index in en:', idxEn);
if (idxEn !== -1) {
  console.log('EN breakdown HTML:');
  console.log(en.substring(idxEn, idxEn + 2500));
}

const idxTr = tr.indexOf('feature-breakdown');
console.log('feature-breakdown index in tr:', idxTr);
if (idxTr !== -1) {
  console.log('TR breakdown HTML:');
  console.log(tr.substring(idxTr, idxTr + 2500));
}
