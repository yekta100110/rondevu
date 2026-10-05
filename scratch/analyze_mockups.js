const fs = require('fs');

const tr = fs.readFileSync('apps/web/public/cal_files/cal-dom-tr.html', 'utf8');

// Find all elements with data-framer-name
const matches = [...tr.matchAll(/data-framer-name="([^"]+)"/g)].map(m => m[1]);
console.log('Unique framer names count:', new Set(matches).size);

// Check mentions of mockup, calendar, sms, notification, time, input, form
const interesting = [...new Set(matches)].filter(n =>
  /time|calendar|sms|notification|form|input|variant|card|mockup|step|booking/i.test(n)
);
console.log('Interesting names:', interesting);

// Find elements with inline background-color containing 255
const bgMatches = [...tr.matchAll(/<([a-zA-Z0-9]+)[^>]*?data-framer-name="([^"]+)"[^>]*?style="([^"]*background-color:[^"]*)"[^>]*>/g)];
console.log('\nFramer elements with inline bg:');
for (const m of bgMatches) {
  if (m[3].includes('255, 255, 255') || m[3].includes('#fff')) {
    console.log(`Tag: <${m[1]}> data-framer-name="${m[2]}"`);
  }
}

// Find any elements with style containing rgb(255, 255, 255)
const allWhiteBg = [...tr.matchAll(/<([a-zA-Z0-9]+)\s+([^>]*?style="[^"]*background-color:\s*rgb\(255,\s*255,\s*255\)[^"]*"[^>]*)>/g)];
console.log('\nTotal elements with inline white bg:', allWhiteBg.length);
for (let i = 0; i < Math.min(25, allWhiteBg.length); i++) {
  const tag = allWhiteBg[i][1];
  const attrs = allWhiteBg[i][2];
  const nameMatch = attrs.match(/data-framer-name="([^"]+)"/);
  const classMatch = attrs.match(/class="([^"]+)"/);
  console.log(`[${i+1}] <${tag}> name="${nameMatch ? nameMatch[1] : 'NONE'}" class="${classMatch ? classMatch[1] : 'NONE'}"`);
}
