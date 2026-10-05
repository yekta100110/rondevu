const fs = require('fs');

const tr = fs.readFileSync('apps/web/public/cal_files/cal-dom-tr.html', 'utf8');
const css = fs.readFileSync('apps/web/public/cal_files/cal-framer.css', 'utf8');

// Find all classes used in cal-dom-tr.html
const classMatches = tr.match(/class="([^"]+)"/g) || [];
const usedClasses = new Set();
for (const cm of classMatches) {
  const parts = cm.replace('class="', '').replace('"', '').split(/\s+/);
  parts.forEach(p => usedClasses.add(p));
}

console.log('Total unique classes in cal-dom-tr.html:', usedClasses.size);

// Now find which of these used classes have background-color or background in css
const regex = /\.([a-zA-Z0-9_\-]+)\s*\{([^}]+)\}/g;
let m;
const bgRules = [];
while ((m = regex.exec(css)) !== null) {
  const cls = m[1];
  const body = m[2];
  if (usedClasses.has(cls) && (body.includes('background') || body.includes('background-color'))) {
    const bgMatch = body.match(/background(?:-color)?:\s*([^;]+)/);
    if (bgMatch) {
      bgRules.push({ cls, bg: bgMatch[1].trim() });
    }
  }
}
console.log('Classes used in cal-dom-tr that set background (' + bgRules.length + '):');
bgRules.forEach(r => console.log(' .', r.cls, '=>', r.bg));
