const fs = require('fs');

const tr1 = fs.readFileSync('apps/web/public/cal_files/cal-dom-tr.html', 'utf8');
const tr2 = fs.readFileSync('apps/web/public/cal_files/pricing-dom-tr.html', 'utf8');

// Find all unique color and background inline styles
function findStyles(html, name) {
  console.log('=== Analyzing ' + name + ' ===');
  const bgMatches = html.match(/background(?:-color)?:\s*[^;"]+/gi) || [];
  const textMatches = html.match(/--framer-text-color:\s*[^;"]+/gi) || [];
  const extractedMatches = html.match(/--extracted-[a-z0-9]+:\s*[^;"]+/gi) || [];

  const uniqueBgs = new Set(bgMatches.map(s => s.trim()));
  const uniqueTexts = new Set(textMatches.map(s => s.trim()));
  const uniqueExtracted = new Set(extractedMatches.map(s => s.trim()));

  console.log('Unique background inline styles (' + uniqueBgs.size + '):');
  Array.from(uniqueBgs).slice(0, 10).forEach(s => console.log('  ', s));

  console.log('Unique --framer-text-color (' + uniqueTexts.size + '):');
  Array.from(uniqueTexts).slice(0, 10).forEach(s => console.log('  ', s));

  console.log('Unique --extracted (' + uniqueExtracted.size + '):');
  Array.from(uniqueExtracted).slice(0, 10).forEach(s => console.log('  ', s));
}

findStyles(tr1, 'Home DOM (cal-dom-tr)');
findStyles(tr2, 'Pricing DOM (pricing-dom-tr)');
