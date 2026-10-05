const fs = require('fs');

const css = fs.readFileSync('apps/web/public/cal_files/cal-pricing-framer.css', 'utf8');

console.log('=== SEARCH FOR ROW CLASSES ===');
['framer-1okf87k', 'framer-1xbzont', 'framer-1p8ymlz', 'framer-19inx37', 'feature-breakdown'].forEach(cls => {
  let pos = 0;
  while ((pos = css.indexOf(cls, pos)) !== -1) {
    console.log(`Class ${cls} at ${pos}:`);
    console.log(css.substring(Math.max(0, pos - 50), pos + 250));
    pos += cls.length;
  }
});

console.log('=== SEARCH FOR FOOTER CLASSES ===');
['framer-mnsa1o', 'Status Wrapper', 'All rights reserved', 'framer-10twttb', 'QWu52BRlL'].forEach(cls => {
  let pos = 0;
  while ((pos = css.indexOf(cls, pos)) !== -1) {
    console.log(`Footer class ${cls} at ${pos}:`);
    console.log(css.substring(Math.max(0, pos - 50), pos + 250));
    pos += cls.length;
  }
});
