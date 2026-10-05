const fs = require('fs');

const en = fs.readFileSync('apps/web/public/cal_files/pricing-dom-en.html', 'utf8');

const bPos = en.indexOf('id="feature-breakdown"');
const fPos = en.indexOf('data-framer-name="Footer Wrapper"');

console.log('Breakdown position:', bPos);
console.log('Footer position:', fPos);
console.log('What is right before feature-breakdown?');
console.log(en.substring(bPos - 400, bPos + 100));

console.log('What is around breakdown closure and footer?');
console.log(en.substring(fPos - 300, fPos + 200));
