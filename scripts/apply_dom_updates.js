const fs = require('fs');
const path = require('path');

const trPath = path.join(__dirname, '..', 'apps', 'web', 'public', 'cal_files', 'cal-dom-tr.html');
const enPath = path.join(__dirname, '..', 'apps', 'web', 'public', 'cal_files', 'cal-dom-en.html');

let trHtml = fs.readFileSync(trPath, 'utf8');
let enHtml = fs.readFileSync(enPath, 'utf8');

console.log('--- STARTING SURGICAL DOM UPDATES ---');

function unfreezeOpacities(html) {
  // Replace opacity:0.001 with opacity:1
  html = html.replace(/opacity:\s*0\.001/g, 'opacity:1');
  return html;
}

trHtml = unfreezeOpacities(trHtml);
enHtml = unfreezeOpacities(enHtml);

// Add id="faq" to FAQ Section if not present
if (!trHtml.includes('id="faq"')) {
  trHtml = trHtml.replace('data-framer-name="FAQ Section"', 'id="faq" data-framer-name="FAQ Section"');
}
if (!enHtml.includes('id="faq"')) {
  enHtml = enHtml.replace('data-framer-name="FAQ Section"', 'id="faq" data-framer-name="FAQ Section"');
}

// Add pricing slot after More Features in both files if not present
if (!trHtml.includes('id="rondevu-pricing-slot"')) {
  // Find where More Features section ends or right before FAQ
  trHtml = trHtml.replace(
    'id="faq" data-framer-name="FAQ Section"',
    '<div id="rondevu-pricing-slot"></div><div id="faq" data-framer-name="FAQ Section"'
  );
}
if (!enHtml.includes('id="rondevu-pricing-slot"')) {
  enHtml = enHtml.replace(
    'id="faq" data-framer-name="FAQ Section"',
    '<div id="rondevu-pricing-slot"></div><div id="faq" data-framer-name="FAQ Section"'
  );
}

// ==========================================
// TURKISH DOM UPDATES (cal-dom-tr.html)
// ==========================================

// 1. Notification Pills in Hero
trHtml = trHtml.replace(/Meeting starts in 15 mins/g, 'Görüşme 15 dk içinde başlıyor');
trHtml = trHtml.replace(/Booking rescheduled/g, 'Randevu yeniden planlandı');
trHtml = trHtml.replace(/New booking confirmed/g, 'Yeni randevu onaylandı');

// 2. Bottom CTA
trHtml = trHtml.replace(/Smarter, simpler scheduling/g, 'Daha akıllı, daha sade randevu.');
trHtml = trHtml.replace(
  /Spend your time connecting with clients and doing what you do best, not juggling emails\./g,
  'Zamanınızı planlama karmaşasına değil, danışanlarınıza ve işinize ayırın.'
);

// 3. FAQ Header & Subtitle
trHtml = trHtml.replace(/Frequently asked questions/g, 'Sıkça Sorulan Sorular');
trHtml = trHtml.replace(
  /These are some of our most frequently asked questions\./g,
  'Sistemin çalışması, takvim eşitleme ve özellikler hakkında en çok karşılaştığımız sorular.'
);

// 4. FAQ Questions & Answers in TR
const trFaqReplacements = [
  {
    qOld: 'What is rOndevu and how does it work as a scheduling app?',
    qNew: 'Acil bir durumda veya izne çıktığımda randevuları nasıl yönetirim?',
    aOld: 'rOndevu is a scheduling app and meeting scheduling software used by over a million people to eliminate booking back-and-forth. You share a link, and rOndevu handles calendar syncing, timezone detection, reminders, and video calls through Zoom, Google Meet, Microsoft Teams, and Google Meet. It works as a simple meeting scheduler for 1-on-1s or a full automated scheduling system with routing and workflows, making it both a flexible scheduling tool and a powerful online booking system.',
    aNew: 'İzin modunu açtığınızda o günkü randevularınız iptal edilir ve danışanlarınıza açıklama mesajınız otomatik iletilir.'
  },
  {
    qOld: 'What makes rOndevu different from other scheduling apps?',
    qNew: 'Kendi web sitemin adresini (ör. doktorayse.com) bağlayabilir miyim?',
    aOld: 'Most scheduling apps limit free users heavily and force them to upgrade to paid tiers. rOndevu’s free tier is robust and always free for individuals. As a scheduler, rOndevu offers exceptional value to users by integrating seamlessly with common workflow tools like Google Calendar, Zoom, and Stripe. It also works as a lead routing, distribution, and management tool for inbound-focused teams. Overall, rOndevu is built for flexibility and customization. As a meeting scheduler, it has a robust free tier and very affordable paid tiers. Rare among scheduling tools, it provides high-impact features like custom domain support via your own SMTP server. This is currently an upcoming feature. Here’s the <!--$--><a class="framer-text framer-styles-preset-14qx97p" href="./custom-domain-email-waitlist">waitlist</a><!--/$-->.',
    aNew: 'Evet, kendi alan adınızı sisteme bağlayabilir ve randevu sayfanızı kendi adresiniz üzerinden kesintisiz kullanabilirsiniz.'
  },
  {
    qOld: "How much does rOndevu cost and what's included in each plan?",
    qNew: 'Danışanların SMS doğrulaması yapması neden gerekli?',
    aOld: "rOndevu's free plan includes unlimited event types, calendar syncing, workflow automation, Stripe payments, and Google Meet, making it one of the most fully featured free scheduling tools on the market. For teams, the booking software scales across four tiers. Teams ($16/user/month) adds round-robin scheduling, shared availability, and team workflows, making it ideal scheduling software for small business. Organizations ($37/user/month) include org-wide admin controls and centralized management for larger companies using rOndevu’s scheduler as their meeting scheduling software. Enterprise offers custom pricing with priority support, dedicated database, and higher SLAs. This is crucial for industries that require a secure online booking system.",
    aNew: 'Randevu öncesi telefona 6 haneli kod gönderilerek sahte veya hatalı numaralarla takviminizin doldurulması önlenir.'
  },
  {
    qOld: "What are rOndevu's pricing plans, and is it good scheduling software for small businesses?",
    qNew: 'Google Takvim veya Apple Calendar bağlantısı nasıl çalışıyor?',
    aOld: "rOndevu is one of the best options for scheduling software for small business thanks to a free tier that includes unlimited event types, workflow automation, Stripe payments, and Google Meet, making it the most generous free scheduling tool available. Small businesses needing booking software with team features can upgrade to Teams at $16/user/month for round-robin scheduling and shared availability. It also works as an online booking system for small businesses with embeddable booking pages. Organizations ($37/user/month) adds admin controls for mid-size to large companies. Enterprise offers custom pricing with priority support, dedicated database, and higher SLAs. The enterprise plan features are crucial for industries that require a secure meeting scheduling software with a secure database.",
    aNew: 'Kişisel takviminizdeki herhangi bir meşguliyet rOndevu\'da o saati otomatik kapatır; yeni alınan randevular da takviminize işlenir.'
  },
  {
    qOld: 'Can rOndevu be used as scheduling software for Healthcare, Sales, Support, and B2B teams?',
    qNew: 'Randevu başına komisyon veya gizli ek bir ücret var mı?',
    aOld: 'Evet. rOndevu, randevularınızı ve müsaitliklerinizi güvenle yönetmeniz için tasarlanmıştır. Kişisel takvim notlarınız danışanlara gösterilmez, tüm verileriniz şifreli ve güvenli olarak korunur.',
    aNew: 'Hayır, randevu başına komisyon veya gizli ücret yoktur. Randevu sistemi her iki pakette de tüm özellikleriyle tam olarak açıktır.'
  }
];

trFaqReplacements.forEach(r => {
  if (trHtml.includes(r.qOld)) {
    trHtml = trHtml.replace(r.qOld, r.qNew);
    console.log(`[TR] Replaced Q: ${r.qNew}`);
  }
  if (r.aOld && trHtml.includes(r.aOld)) {
    trHtml = trHtml.replace(r.aOld, r.aNew);
    console.log(`[TR] Replaced A for: ${r.qNew}`);
  }
});

// ==========================================
// ENGLISH DOM UPDATES (cal-dom-en.html)
// ==========================================

const enFaqReplacements = [
  {
    qOld: 'What is rOndevu and how does it work as a scheduling app?',
    qNew: 'How do I handle emergencies or vacations?',
    aOld: 'rOndevu is a scheduling app and meeting scheduling software used by over a million people to eliminate booking back-and-forth. You share a link, and rOndevu handles calendar syncing, timezone detection, reminders, and video calls through Zoom, Google Meet, Microsoft Teams, and Google Meet. It works as a simple meeting scheduler for 1-on-1s or a full automated scheduling system with routing and workflows, making it both a flexible scheduling tool and a powerful online booking system.',
    aNew: 'Turning on time-off mode pauses your schedule, closes available slots, and optionally notifies affected clients.'
  },
  {
    qOld: 'What makes rOndevu different from other scheduling apps?',
    qNew: 'Can I connect my own custom domain (e.g. drsmith.com)?',
    aOld: 'Most scheduling apps limit free users heavily and force them to upgrade to paid tiers. rOndevu’s free tier is robust and always free for individuals. As a scheduler, rOndevu offers exceptional value to users by integrating seamlessly with common workflow tools like Google Calendar, Zoom, and Stripe. It also works as a lead routing, distribution, and management tool for inbound-focused teams. Overall, rOndevu is built for flexibility and customization. As a meeting scheduler, it has a robust free tier and very affordable paid tiers. Rare among scheduling tools, it provides high-impact features like custom domain support via your own SMTP server. This is currently an upcoming feature. Here’s the <!--$--><a class="framer-text framer-styles-preset-14qx97p" href="./custom-domain-email-waitlist">waitlist</a><!--/$-->.',
    aNew: 'Yes, you can easily map your custom domain and run your booking page under your personal brand.'
  },
  {
    qOld: "How much does rOndevu cost and what's included in each plan?",
    qNew: 'Why is SMS verification required for bookers?',
    aOld: "rOndevu's free plan includes unlimited event types, calendar syncing, workflow automation, Stripe payments, and Google Meet, making it one of the most fully featured free scheduling tools on the market. For teams, the booking software scales across four tiers. Teams ($16/user/month) adds round-robin scheduling, shared availability, and team workflows, making it ideal scheduling software for small business. Organizations ($37/user/month) include org-wide admin controls and centralized management for larger companies using rOndevu’s scheduler as their meeting scheduling software. Enterprise offers custom pricing with priority support, dedicated database, and higher SLAs. This is crucial for industries that require a secure online booking system.",
    aNew: "A 6-digit code is sent to the client's phone before confirmation, preventing fake submissions and empty slots."
  },
  {
    qOld: "What are rOndevu's pricing plans, and is it good scheduling software for small businesses?",
    qNew: 'How does the calendar synchronization work?',
    aOld: "rOndevu is one of the best options for scheduling software for small business thanks to a free tier that includes unlimited event types, workflow automation, Stripe payments, and Google Meet, making it the most generous free scheduling tool available. Small businesses needing booking software with team features can upgrade to Teams at $16/user/month for round-robin scheduling and shared availability. It also works as an online booking system for small businesses with embeddable booking pages. Organizations ($37/user/month) adds admin controls for mid-size to large companies. Enterprise offers custom pricing with priority support, dedicated database, and higher SLAs. The enterprise plan features are crucial for industries that require a secure meeting scheduling software with a secure database.",
    aNew: 'Any personal event in your Google or Apple Calendar instantly blocks that time in rOndevu, eliminating conflicts.'
  },
  {
    qOld: 'Can rOndevu be used as scheduling software for Healthcare, Sales, Support, and B2B teams?',
    qNew: 'Is there any commission or per-booking fee?',
    aOld: 'rOndevu has enterprise features for security and workflows, plus custom integrations with APIs and self-hosting options, making it ideal for teams with complex needs.',
    aNew: 'None. You keep 100% of your business; there are no hidden fees or per-appointment charges.'
  }
];

enFaqReplacements.forEach(r => {
  if (enHtml.includes(r.qOld)) {
    enHtml = enHtml.replace(r.qOld, r.qNew);
    console.log(`[EN] Replaced Q: ${r.qNew}`);
  }
  if (r.aOld && enHtml.includes(r.aOld)) {
    enHtml = enHtml.replace(r.aOld, r.aNew);
    console.log(`[EN] Replaced A for: ${r.qNew}`);
  }
});

// Write updated files
fs.writeFileSync(trPath, trHtml, 'utf8');
fs.writeFileSync(enPath, enHtml, 'utf8');

console.log('--- DOM UPDATES COMPLETED SUCCESSFULLY ---');
console.log('TR file size:', trHtml.length);
console.log('EN file size:', enHtml.length);
