const fs = require('fs');

const css2 = fs.readFileSync('apps/web/public/cal_files/cal-pricing-framer.css', 'utf8');

const regex = /\.([a-zA-Z0-9_\-\.]+)\s*\{[^}]*background(?:-color)?:\s*([^;\}]+)[^}]*\}/g;
let m;
const whiteClasses = [];
while ((m = regex.exec(css2)) !== null) {
  const cls = m[1];
  const bg = m[2];
  if (bg.includes('#fff') || bg.includes('white') || bg.includes('255, 255, 255') || bg.includes('#f4f4f4') || bg.includes('token-dfc') || bg.includes('token-929') || bg.includes('token-851') || bg.includes('fcfcfc') || bg.includes('f7f7f7')) {
    whiteClasses.push({ cls, bg });
  }
}
console.log('Total white/light background classes in cal-pricing-framer.css:', whiteClasses.length);
whiteClasses.forEach(w => console.log('  .', w.cls, '=>', w.bg));
