const fs = require('fs');

const tr1 = fs.readFileSync('apps/web/public/cal_files/cal-dom-tr.html', 'utf8');
const css1 = fs.readFileSync('apps/web/public/cal_files/cal-framer.css', 'utf8');
const tr2 = fs.readFileSync('apps/web/public/cal_files/pricing-dom-tr.html', 'utf8');
const css2 = fs.readFileSync('apps/web/public/cal_files/cal-pricing-framer.css', 'utf8');

// Find all elements in cal-dom-tr that have a class starting with framer-
const sectionRegex = /<div\s+[^>]*class="([^"]*framer-[^"]*)"[^>]*data-framer-name="([^"]*)"/g;
let m;
console.log('--- Home Page Sections ---');
while ((m = sectionRegex.exec(tr1)) !== null) {
  if (m[2].includes('Section') || m[2].includes('Wrapper') || m[2].includes('Card') || m[2].includes('Container')) {
    console.log(m[2], '=> classes:', m[1].split(' ').filter(c => c.startsWith('framer-')).join(', '));
  }
}

console.log('--- Pricing Page Sections ---');
while ((m = sectionRegex.exec(tr2)) !== null) {
  if (m[2].includes('Section') || m[2].includes('Wrapper') || m[2].includes('Card') || m[2].includes('Container') || m[2].includes('Row')) {
    console.log(m[2], '=> classes:', m[1].split(' ').filter(c => c.startsWith('framer-')).join(', '));
  }
}
