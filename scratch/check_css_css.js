const fs = require('fs');

// Check css.css in dark Cal.com files
const cssPath = 'example/dark Cal.com _ Scheduling Software for Online Bookings_files/css.css';
if (fs.existsSync(cssPath)) {
  const css = fs.readFileSync(cssPath, 'utf8');
  console.log('css.css length:', css.length);
  console.log('css.css snippet:', css.substring(0, 500));
} else {
  console.log('css.css not found');
}
