const fs = require('fs');

const tr = fs.readFileSync('apps/web/public/cal_files/cal-dom-tr.html', 'utf8');

// Find all elements between FAQ section and footer
const faqIdx = tr.indexOf('Sıkça Sorulan Sorular');
const footerIdx = tr.indexOf('framer-jNEDA');
console.log('FAQ index:', faqIdx);
console.log('Footer index:', footerIdx);

const between = tr.substring(faqIdx, footerIdx);
console.log('Length between FAQ and footer:', between.length);

// Let's find classes inside between
const classMatches = [...between.matchAll(/class="([^"]+)"/g)].map(m => m[1]);
console.log('Unique classes between FAQ and footer:', new Set(classMatches.flatMap(c => c.split(' '))).size);

// Let's print the entire banner markup from the start of its section
const bannerStart = tr.indexOf('framer-3gy7g1-container');
console.log('Banner container snippet (first 2500 chars):');
console.log(tr.substring(bannerStart, bannerStart + 2500));
