const fs = require('fs');

const darkHtml = fs.readFileSync('example/dark Cal.com _ Scheduling Software for Online Bookings.htm', 'utf8');

// Check if dark Cal.com has dark class or style
console.log('HTML tag in dark file:');
const htmlTagMatch = darkHtml.match(/<html[^>]*>/i);
console.log(htmlTagMatch ? htmlTagMatch[0] : 'No html tag');

// Check for Time Wrapper in dark file
const timeWrapperMatch = darkHtml.match(/<div[^>]*data-framer-name="Time Wrapper"[^>]*>/);
console.log('\nTime Wrapper in dark file:');
console.log(timeWrapperMatch ? timeWrapperMatch[0] : 'None');

// Check for Variant 1 in dark file
const variant1Match = darkHtml.match(/<div[^>]*class="[^"]*framer-qy9xu[^"]*"[^>]*>/);
console.log('\nSMS framer-qy9xu in dark file:');
console.log(variant1Match ? variant1Match[0] : 'None');

// Check for 12h in dark file
const h12Match = darkHtml.match(/<div[^>]*data-framer-name="12h"[^>]*>/);
console.log('\n12h in dark file:');
console.log(h12Match ? h12Match[0] : 'None');

// Check if there are CSS files linked in dark file
const linkCssMatches = [...darkHtml.matchAll(/<link[^>]*rel="stylesheet"[^>]*>/gi)];
console.log('\nLinked stylesheets:', linkCssMatches.map(m => m[0]));

// Check for any inline style tag in dark file
const styleTags = [...darkHtml.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)];
console.log('\nNumber of style tags:', styleTags.length);
