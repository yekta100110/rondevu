const fs = require('fs');

const tr = fs.readFileSync('apps/web/public/cal_files/cal-dom-tr.html', 'utf8');

const regex = /<([a-zA-Z0-9]+)\s+([^>]*?style="[^"]*background(?:-color)?:\s*([^;"]+)[^"]*"[^>]*)>/gi;

const found = [];
let m;
while ((m = regex.exec(tr)) !== null) {
  const tag = m[1];
  const attrs = m[2];
  const bg = m[3].trim();
  
  // Check if bg is light
  const isLight = 
    bg.includes('255, 255, 255') ||
    bg.includes('244, 244, 244') ||
    bg.includes('245, 245, 245') ||
    bg.includes('243, 244, 246') ||
    bg.includes('225, 226, 227') ||
    bg.includes('229, 231, 235') ||
    bg.includes('224, 224, 224') ||
    bg.includes('211, 211, 211') ||
    bg.includes('token-dfc22ccd') ||
    bg.includes('token-929b8a8e') ||
    bg.includes('token-1707e66c');

  if (isLight) {
    const nameMatch = attrs.match(/data-framer-name="([^"]+)"/);
    const classMatch = attrs.match(/class="([^"]+)"/);
    found.push({
      tag,
      name: nameMatch ? nameMatch[1] : 'NONE',
      cls: classMatch ? classMatch[1] : 'NONE',
      bg
    });
  }
}

console.log('Total light elements found:', found.length);
const group = {};
for (const f of found) {
  const k = `${f.tag} | ${f.name} | ${(f.cls.split(' ')[0])} | ${f.bg}`;
  group[k] = (group[k] || 0) + 1;
}

for (const [k, count] of Object.entries(group)) {
  console.log(`[${count}x] ${k}`);
}
