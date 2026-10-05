const fs = require('fs');

const css = fs.readFileSync('apps/web/public/cal_files/cal-pricing-framer.css', 'utf8');

const pos = css.indexOf('.framer-YAKWS{');
console.log('framer-YAKWS main rule at:', pos);
if (pos !== -1) {
  console.log(css.substring(pos, pos + 400));
}
