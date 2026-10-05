const fs = require('fs');

const tr = fs.readFileSync('apps/web/public/cal_files/cal-dom-tr.html', 'utf8');
const inlineImportant = [...tr.matchAll(/style="[^"]*!important[^"]*"/g)];
console.log('Inline !important count in cal-dom-tr.html:', inlineImportant.length);

const en = fs.readFileSync('apps/web/public/cal_files/cal-dom-en.html', 'utf8');
const enInlineImportant = [...en.matchAll(/style="[^"]*!important[^"]*"/g)];
console.log('Inline !important count in cal-dom-en.html:', enInlineImportant.length);
