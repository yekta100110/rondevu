const fs = require('fs');

for (const file of ['apps/web/public/cal_files/cal-framer.css', 'apps/web/public/cal_files/cal-pricing-framer.css']) {
  console.log(`\n=== ${file} ===`);
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('#000000')) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  });
}
