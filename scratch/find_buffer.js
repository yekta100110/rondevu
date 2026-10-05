const fs = require('fs');

const en = fs.readFileSync('apps/web/public/cal_files/pricing-dom-en.html', 'utf8');

const regex = /buffer/gi;
let match;
while ((match = regex.exec(en)) !== null) {
  console.log('Match at', match.index);
  console.log(en.substring(Math.max(0, match.index - 100), match.index + 200));
}
