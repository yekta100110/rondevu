const fs = require('fs');

const css = fs.readFileSync('apps/web/public/cal_files/cal-pricing-framer.css', 'utf8');
const en = fs.readFileSync('apps/web/public/cal_files/pricing-dom-en.html', 'utf8');

const yPos = en.indexOf('framer-YAKWS');
console.log('framer-YAKWS in HTML at:', yPos);
if (yPos !== -1) {
  console.log(en.substring(Math.max(0, yPos - 300), yPos + 700));
}

let pos = 0;
while ((pos = css.indexOf('.framer-YAKWS', pos)) !== -1) {
  console.log('framer-YAKWS in CSS at:', pos);
  console.log(css.substring(pos, pos + 250));
  pos += 13;
}
