const fs = require('fs');

const tr1 = fs.readFileSync('apps/web/public/cal_files/cal-dom-tr.html', 'utf8');
const tr2 = fs.readFileSync('apps/web/public/cal_files/pricing-dom-tr.html', 'utf8');

function findInlineBgs(html, name) {
  console.log('=== ' + name + ' ===');
  const regex = /<([a-z0-9]+)\s+[^>]*style="([^"]*background[^"]*)"/gi;
  let m;
  let count = 0;
  while ((m = regex.exec(html)) !== null) {
    count++;
    console.log(`[${count}] <${m[1]}>: ${m[2]}`);
  }
}

findInlineBgs(tr1, 'Home DOM (cal-dom-tr)');
findInlineBgs(tr2, 'Pricing DOM (pricing-dom-tr)');
