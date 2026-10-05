const fs = require('fs');

const files = [
  'apps/web/modules/home/home-view.tsx',
  'apps/web/modules/pricing/pricing-view.tsx',
  'apps/web/app/layout.tsx',
  'apps/web/styles/globals.css'
];

for (const file of files) {
  console.log(`\n=== ${file} ===`);
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('#000000')) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  });
}
