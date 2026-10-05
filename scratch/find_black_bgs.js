const fs = require('fs');

const files = [
  'apps/web/modules/home/home-view.tsx',
  'apps/web/modules/pricing/pricing-view.tsx',
  'apps/web/app/layout.tsx',
  'apps/web/styles/globals.css',
  'apps/web/public/cal_files/cal-framer.css',
  'apps/web/public/cal_files/cal-pricing-framer.css'
];

for (const file of files) {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const matches = [...content.matchAll(/(?:background(?:-color)?:\s*#000000|bg-\[#000000\]|backgroundColor\s*=\s*["']#000000["'])/gi)];
    console.log(`${file}: ${matches.length} occurrences of #000000 background`);
  }
}
