const fs = require('fs');

const css = fs.readFileSync('apps/web/public/cal_files/cal-framer.css', 'utf8');
console.log('CSS length:', css.length);
console.log('Includes 12jqh3g:', css.includes('12jqh3g'));
console.log('Includes 1xsfqxx:', css.includes('1xsfqxx'));
console.log('Includes 3gy7g1:', css.includes('3gy7g1'));
console.log('Includes EJrvE:', css.includes('EJrvE'));

if (css.includes('3gy7g1')) {
  const idx = css.indexOf('3gy7g1');
  console.log('3gy7g1 snippet:', css.substring(idx - 100, idx + 200));
}
