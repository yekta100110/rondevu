const fs = require('fs');

const css = fs.readFileSync('apps/web/public/cal_files/cal-framer.css', 'utf8');

for (const cls of ['framer-1x0adn6', 'framer-12jqh3g', 'framer-EJrvE', 'framer-3gy7g1']) {
  let idx = 0;
  while ((idx = css.indexOf(cls, idx)) !== null && idx !== -1) {
    console.log(`\n=== Rule for ${cls} at ${idx} ===`);
    console.log(css.substring(Math.max(0, idx - 50), Math.min(css.length, idx + 300)));
    idx += cls.length;
  }
}
