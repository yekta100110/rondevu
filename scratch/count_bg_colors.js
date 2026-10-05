const fs = require('fs');

const tr = fs.readFileSync('apps/web/public/cal_files/cal-dom-tr.html', 'utf8');

// Find all elements with class containing 'card' or 'mockup' or 'framer-' that have background-color
// Let's find all background-color declarations in cal-dom-tr.html
const bgDeclarations = [...tr.matchAll(/style="[^"]*background(?:-color)?:\s*([^;"]+)[^"]*"/gi)];
console.log('Total elements with inline background(-color):', bgDeclarations.length);

const colorCounts = {};
for (const decl of bgDeclarations) {
  const val = decl[1].trim();
  colorCounts[val] = (colorCounts[val] || 0) + 1;
}

console.log('\nBackground color counts:');
for (const [color, count] of Object.entries(colorCounts)) {
  console.log(`- ${color}: ${count}`);
}
