const fs = require('fs');

const tr = fs.readFileSync('apps/web/public/cal_files/cal-dom-tr.html', 'utf8');

// Let's search for Bento cards, Hero mockups, etc.
// 1. Hero Booking Mockup
const heroIdx = tr.indexOf('framer-647xse');
console.log('Hero container framer-647xse found:', heroIdx !== -1);

// 2. Search for SMS or notification in the text
const smsMatches = [...tr.matchAll(/([^<>{}]*(?:SMS|sms|Hatırlatma|Bildirim|Notification|Mesaj)[^<>{}]*)/gi)];
console.log('\nSMS/Notification text occurrences:');
for (const m of smsMatches.slice(0, 10)) {
  console.log('-', m[1].trim());
}

// 3. Search for elements around these SMS texts
for (const m of smsMatches.slice(0, 5)) {
  const idx = tr.indexOf(m[0]);
  if (idx !== -1) {
    const snippet = tr.substring(Math.max(0, idx - 400), Math.min(tr.length, idx + 400));
    console.log('\n--- Context around: "' + m[0].trim() + '" ---');
    console.log(snippet);
  }
}
