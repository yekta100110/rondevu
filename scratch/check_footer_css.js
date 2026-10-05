const fs = require('fs');

const css = fs.readFileSync('apps/web/public/cal_files/cal-pricing-framer.css', 'utf8');

['framer-6c2yx', 'framer-12aw6q8', 'framer-1cjzev6'].forEach(cls => {
  let pos = 0;
  while ((pos = css.indexOf(cls, pos)) !== -1) {
    console.log(`Class ${cls} at ${pos}:`);
    console.log(css.substring(Math.max(0, pos - 50), pos + 250));
    pos += cls.length;
  }
});
