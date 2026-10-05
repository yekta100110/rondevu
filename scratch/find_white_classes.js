const fs = require('fs');

const css1 = fs.readFileSync('apps/web/public/cal_files/cal-framer.css', 'utf8');

// Find all classes that set background to white or f4f4f4 or fcfcfc or #fff or token-dfc22ccd or token-929b8a8e
const regex = /\.([a-zA-Z0-9_\-\.]+)\s*\{[^}]*background(?:-color)?:\s*([^;\}]+)[^}]*\}/g;
let m;
const whiteClasses = [];
while ((m = regex.exec(css1)) !== null) {
  const cls = m[1];
  const bg = m[2];
  if (bg.includes('#fff') || bg.includes('white') || bg.includes('255, 255, 255') || bg.includes('#f4f4f4') || bg.includes('token-dfc') || bg.includes('token-929') || bg.includes('token-851')) {
    whiteClasses.push({ cls, bg });
  }
}
console.log('Total white/light background classes in cal-framer.css:', whiteClasses.length);
whiteClasses.slice(0, 30).forEach(w => console.log('  .', w.cls, '=>', w.bg));
