const fs = require('fs');

const tr = fs.readFileSync('apps/web/public/cal_files/cal-dom-tr.html', 'utf8');

const styleTags = [...tr.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)];
console.log('Embedded style tags in cal-dom-tr.html:', styleTags.length);
for (let i = 0; i < styleTags.length; i++) {
  console.log(`Tag [${i}] length:`, styleTags[i][1].length);
  if (styleTags[i][1].includes('framer-12jqh3g')) {
    console.log(`Tag [${i}] CONTAINS framer-12jqh3g!`);
  }
  if (styleTags[i][1].includes('framer-1xsfqxx')) {
    console.log(`Tag [${i}] CONTAINS framer-1xsfqxx!`);
  }
}
