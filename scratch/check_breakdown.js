const fs = require('fs');

const en = fs.readFileSync('apps/web/public/cal_files/pricing-dom-en.html', 'utf8');
const tr = fs.readFileSync('apps/web/public/cal_files/pricing-dom-tr.html', 'utf8');

const idxEn = en.indexOf('id="feature-breakdown"');
console.log('id="feature-breakdown" in en:', idxEn);
if (idxEn !== -1) {
  console.log(en.substring(idxEn, idxEn + 3000));
}

// Check where the footer is in relation to feature-breakdown:
const fEn = en.indexOf('All rights reserved');
console.log('All rights reserved in en at:', fEn);
console.log('Distance between breakdown and footer:', fEn - idxEn);
console.log(en.substring(fEn - 300, fEn + 800));
