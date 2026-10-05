const fs = require('fs');

const tr = fs.readFileSync('apps/web/public/cal_files/cal-dom-tr.html', 'utf8');

// Target selectors to test:
const selectors = [
  // 1. Time slots in Hero Booking Mockup
  '[data-framer-name="Time Wrapper"]',
  '.framer-cdg224',
  '.framer-1mpt9uu',
  '.framer-q3q3yl',
  '.framer-1agen48',
  '.framer-9w3sx3',
  '.framer-19egib7',

  // 2. 12h/24h toggle
  '[data-framer-name="12h"]',
  '.framer-1fcbxls',

  // 3. Step 02 availability mockup
  '.framer-1huq9cu',
  '.framer-5kl9mh',
  '.framer-w7banu',

  // 4. Step 03 meeting method mockup
  '.framer-qy9xu',

  // 5. Buffer & limit inputs ("Aşırı randevu yükünden kaçının" / "Ön bildirim ve mola süreleri")
  '.framer-Tkbfq',
  '.framer-gJkts',
  '.framer-hzaknl',
  '.framer-jnz7nj',

  // 6. Custom link mockup ("Size özel randevu bağlantısı")
  '.framer-nz98m',
  '.framer-rvy1t6',
  '.framer-1jvlc9f',
  '.framer-p10lqm',

  // 7. Booking flow calendar mockup ("Danışanlarınız için akıcı akış")
  '.framer-cDA3t',
  '.framer-3yv7sl',
  '.framer-11w9zad',
  '.framer-1gspuy9',
  '.framer-16pho97',
  '.framer-7bqwyh',
  '.framer-iuyy6y',
  '.framer-167g4cj',
  '.framer-1afols4',
  '.framer-wamzbo',
  '.framer-lb0273',
  '.framer-1gph01q',
  '.framer-1669y0q',
  '.framer-z1tgqc',
  '.framer-1httwsa',
  '.framer-8c4sqs',
  '.framer-s5k8ht',
  '.framer-1j8fmy',
  '.framer-1vhsju6',
  '.framer-1ps50ik',

  // 8. SMS & Notification bubbles ("SMS ve e-posta ile otomatik hatırlatma")
  '.framer-ZlJxc',
  '.framer-jVPgn',
  '[data-framer-name="Not Highlighted"]',
  '[data-framer-name="Highlighted"]',

  // 9. Function buttons & wrappers
  '.framer-1616k9q',
];

console.log('Testing selectors against cal-dom-tr.html:');
for (const sel of selectors) {
  let count = 0;
  if (sel.startsWith('.')) {
    const cls = sel.slice(1);
    const regex = new RegExp(`class="[^"]*\\b${cls}\\b[^"]*"`, 'g');
    const m = tr.match(regex);
    count = m ? m.length : 0;
  } else if (sel.includes('=')) {
    const attrVal = sel.match(/="([^"]+)"/)[1];
    const regex = new RegExp(`data-framer-name="${attrVal}"`, 'g');
    const m = tr.match(regex);
    count = m ? m.length : 0;
  }
  console.log(`${sel.padEnd(35)} : ${count} matches`);
}
