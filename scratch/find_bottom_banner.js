const fs = require('fs');

const tr = fs.readFileSync('apps/web/public/cal_files/cal-dom-tr.html', 'utf8');

// Find occurrences of footer or CTA
const footerIdx = tr.indexOf('framer-jNEDA');
console.log('framer-jNEDA (footer) index:', footerIdx);

// Look backwards from the end of the file
const len = tr.length;
console.log('Total file length:', len);

// Find headings near the end of the file
const headings = [...tr.matchAll(/<(h[1-4])[^>]*>(.*?)<\/\1>/gi)];
console.log('Total headings:', headings.length);
for (let i = Math.max(0, headings.length - 10); i < headings.length; i++) {
  console.log(`[${headings[i][1]}] ${headings[i][2].replace(/<[^>]+>/g, '')}`);
}
