const fs = require('fs');

const tr = fs.readFileSync('apps/web/public/cal_files/cal-dom-tr.html', 'utf8');

const regex = /<([a-zA-Z0-9]+)\s+([^>]*?style="[^"]*background(?:-color)?:\s*(?:rgb\(245,\s*245,\s*245\)|rgb\(243,\s*244,\s*246\))[^"]*"[^>]*)>/gi;

let m;
while ((m = regex.exec(tr)) !== null) {
  const tag = m[1];
  const attrs = m[2];
  const nameMatch = attrs.match(/data-framer-name="([^"]+)"/);
  const classMatch = attrs.match(/class="([^"]+)"/);
  console.log(`<${tag}> name="${nameMatch ? nameMatch[1] : 'NONE'}" class="${classMatch ? classMatch[1] : 'NONE'}"`);
}
