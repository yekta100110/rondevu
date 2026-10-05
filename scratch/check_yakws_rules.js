const fs = require('fs');

const css = fs.readFileSync('apps/web/public/cal_files/cal-pricing-framer.css', 'utf8');
const en = fs.readFileSync('apps/web/public/cal_files/pricing-dom-en.html', 'utf8');

const m = css.match(/\.framer-YAKWS[^{]*\{[^}]*\}/g);
console.log('Matches for framer-YAKWS:', m ? m.length : 0);
if (m) console.log(m.slice(0, 5));

// Also let's inspect the entire DOM structure around framer-YAKWS in pricing-dom-en.html:
const idx = en.indexOf('framer-YAKWS');
console.log('In en at:', idx);
console.log(en.substring(Math.max(0, idx - 400), idx + 800));
