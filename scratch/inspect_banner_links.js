const fs = require('fs');

for (const lang of ['tr', 'en']) {
  const file = `apps/web/public/cal_files/cal-dom-${lang}.html`;
  const html = fs.readFileSync(file, 'utf8');
  const bannerMatches = [...html.matchAll(/<a[^>]*href="[^"]*(?:\/pricing|talk-to-sales)[^"]*"[^>]*>/g)];
  console.log(`\n=== Links in cal-dom-${lang}.html ===`);
  for (const m of bannerMatches) {
    if (m.index > 460000) {
      console.log(`[Pos ${m.index}] ${m[0]}`);
    }
  }
}
