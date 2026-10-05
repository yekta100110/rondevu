const fs = require('fs');

const tr = fs.readFileSync('apps/web/public/cal_files/cal-dom-tr.html', 'utf8');

// Find all cards inside Bento grid (class contains framer-eyoavh, framer-1tym5sg, framer-qm9fst, framer-igaxec, framer-l5bt33, framer-cf392j, framer-pry2jb, framer-54l76e, framer-g2qg4s)
const cardClasses = [
  'framer-eyoavh',
  'framer-1tym5sg',
  'framer-qm9fst',
  'framer-igaxec',
  'framer-l5bt33',
  'framer-cf392j',
  'framer-pry2jb',
  'framer-54l76e',
  'framer-g2qg4s'
];

for (const cls of cardClasses) {
  const idx = tr.indexOf(cls);
  if (idx !== -1) {
    const titleMatch = tr.substring(idx, idx + 1000).match(/<(h[1-4]|p)[^>]*>(.*?)<\/\1>/i);
    const title = titleMatch ? titleMatch[2].replace(/<[^>]+>/g, '').trim() : 'Unknown Title';
    console.log(`\nCard [${cls}] - "${title}":`);
    
    // Check if card has an Image Wrapper
    const imgWrapperIdx = tr.indexOf('data-framer-name="Image Wrapper"', idx);
    if (imgWrapperIdx !== -1 && imgWrapperIdx < idx + 2500) {
      const snippet = tr.substring(imgWrapperIdx, imgWrapperIdx + 600);
      console.log('  Image Wrapper snippet:', snippet.replace(/\s+/g, ' ').substring(0, 300));
    }
  }
}
