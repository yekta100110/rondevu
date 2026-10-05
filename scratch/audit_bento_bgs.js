const fs = require('fs');

const tr = fs.readFileSync('apps/web/public/cal_files/cal-dom-tr.html', 'utf8');

// Find all elements inside framer-Dv3SB that have background or background-color
const bentoIdx = tr.indexOf('framer-Dv3SB');
const bentoSub = tr.substring(bentoIdx, bentoIdx + 55000);

const bgMatches = [...bentoSub.matchAll(/style="[^"]*background(?:-color)?:\s*([^;"]+)[^"]*"/gi)];
const uniqueBgs = new Set(bgMatches.map(m => m[1].trim()));
console.log('Unique backgrounds in Bento section:', [...uniqueBgs]);

// Check if any unique bg is white or near white
const whiteLike = [...uniqueBgs].filter(bg => 
  bg.includes('255, 255, 255') || 
  bg.includes('244, 244, 244') || 
  bg.includes('245, 245, 245') || 
  bg.includes('243, 244, 246') ||
  bg.includes('#fff') ||
  bg.includes('token-dfc22ccd') ||
  bg.includes('token-929b8a8e')
);
console.log('\nWhite-like backgrounds in Bento:', whiteLike);
