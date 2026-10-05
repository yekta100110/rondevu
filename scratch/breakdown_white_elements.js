const fs = require('fs');

const tr = fs.readFileSync('apps/web/public/cal_files/cal-dom-tr.html', 'utf8');

// Find all elements with white or near-white background
const whiteRegex = /<([a-zA-Z0-9]+)\s+([^>]*?style="[^"]*background(?:-color)?:\s*(?:rgb\(255,\s*255,\s*255\)|var\(--token-dfc22ccd-cb7d-477e-862b-97507724854f|var\(--token-929b8a8e-1101-4904-980f-6a5ad686df10)[^"]*"[^>]*)>/gi;

let m;
const list = [];
while ((m = whiteRegex.exec(tr)) !== null) {
  const tag = m[1];
  const attrs = m[2];
  const nameMatch = attrs.match(/data-framer-name="([^"]+)"/);
  const classMatch = attrs.match(/class="([^"]+)"/);
  const styleMatch = attrs.match(/style="([^"]+)"/);
  list.push({
    tag,
    name: nameMatch ? nameMatch[1] : null,
    className: classMatch ? classMatch[1] : null,
    style: styleMatch ? styleMatch[1] : null,
  });
}

console.log('Total white elements found:', list.length);

// Group by className or framer name
const summary = {};
for (const item of list) {
  const key = `${item.tag} | name:${item.name || 'none'} | class:${(item.className || 'none').split(' ')[0]}`;
  summary[key] = (summary[key] || 0) + 1;
}

console.log('\nElement breakdown:');
for (const [k, v] of Object.entries(summary)) {
  console.log(`- [${v}x] ${k}`);
}
