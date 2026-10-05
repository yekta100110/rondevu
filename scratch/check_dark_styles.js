const fs = require('fs');

const darkHtml = fs.readFileSync('example/dark Cal.com _ Scheduling Software for Online Bookings.htm', 'utf8');

const styleTags = [...darkHtml.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)];
console.log('Style tags lengths:', styleTags.map(s => s[1].length));

// Check if any style tag mentions dark or token
for (let i = 0; i < styleTags.length; i++) {
  const content = styleTags[i][1];
  console.log(`\nStyle tag [${i}] snippet:`, content.substring(0, 200));
  
  const darkMatches = content.match(/dark/gi);
  console.log(`Dark occurrences in style tag [${i}]:`, darkMatches ? darkMatches.length : 0);
  
  const tokenMatches = content.match(/--token-[a-f0-9-]+/gi);
  console.log(`Token occurrences in style tag [${i}]:`, tokenMatches ? new Set(tokenMatches).size : 0);
}

// Let's also check if there are CSS variables defined on :root or body or .dark
for (let i = 0; i < styleTags.length; i++) {
  const content = styleTags[i][1];
  const rootMatches = [...content.matchAll(/(:root|body|\.dark|\[data-theme=[^\]]+\])[^{]*\{([^}]+)\}/gi)];
  if (rootMatches.length > 0) {
    console.log(`\nFound selectors in style tag [${i}]:`, rootMatches.map(m => m[1]));
  }
}
