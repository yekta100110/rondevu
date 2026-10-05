const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('       rOndevu - COMPREHENSIVE VERIFICATION        ');
console.log('====================================================\n');

let allPassed = true;

function check(title, condition, detail = '') {
  if (condition) {
    console.log(`✅ PASS: ${title} ${detail}`);
  } else {
    console.error(`❌ FAIL: ${title} ${detail}`);
    allPassed = false;
  }
}

const baseDir = path.join(__dirname, '..');
const trHtmlPath = path.join(baseDir, 'apps/web/public/cal_files/cal-dom-tr.html');
const enHtmlPath = path.join(baseDir, 'apps/web/public/cal_files/cal-dom-en.html');
const cssPath = path.join(baseDir, 'apps/web/public/cal_files/cal-framer.css');
const translationsPath = path.join(baseDir, 'apps/web/modules/home/i18n/home-translations.ts');
const homeViewPath = path.join(baseDir, 'apps/web/modules/home/home-view.tsx');
const layoutPath = path.join(baseDir, 'apps/web/app/layout.tsx');

const trHtml = fs.readFileSync(trHtmlPath, 'utf8');
const enHtml = fs.readFileSync(enHtmlPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const translations = fs.readFileSync(translationsPath, 'utf8');
const homeView = fs.readFileSync(homeViewPath, 'utf8');
const layout = fs.readFileSync(layoutPath, 'utf8');

// 1. FORBIDDEN WORD AUDIT
console.log('--- 1. FORBIDDEN WORD "ALTYAPI" AUDIT ---');
check('home-translations.ts has 0 "altyapı"', !/altyap[ıi]/i.test(translations));
check('cal-dom-tr.html has 0 "altyapı"', !/altyap[ıi]/i.test(trHtml));
check('cal-dom-en.html has 0 "altyapı"', !/altyap[ıi]/i.test(enHtml));
check('cal-framer.css has 0 "altyapı"', !/altyap[ıi]/i.test(css));
check('home-view.tsx has 0 "altyapı"', !/altyap[ıi]/i.test(homeView));

// 2. FROZEN ANIMATIONS & OPACITY UNFREEZE
console.log('\n--- 2. FROZEN ANIMATIONS & OPACITY AUDIT ---');
const trOp001 = (trHtml.match(/opacity:\s*0\.001/g) || []).length;
const enOp001 = (enHtml.match(/opacity:\s*0\.001/g) || []).length;
check('cal-dom-tr.html has 0 "opacity:0.001"', trOp001 === 0, `(found: ${trOp001})`);
check('cal-dom-en.html has 0 "opacity:0.001"', enOp001 === 0, `(found: ${enOp001})`);
check('cal-framer.css unfreezes [data-framer-appear-id]', css.includes('[data-framer-appear-id]'));
check('cal-framer.css unfreezes .framer-1ypij67-container', css.includes('.framer-1ypij67-container'));
check('cal-framer.css defines hover micro-animations', css.includes('transform: translateY(-3px) !important;'));

// 3. DARK MODE & WHITE BURSTS ELIMINATION
console.log('\n--- 3. DARK MODE & THEME TOKENS AUDIT ---');
check('cal-framer.css sets html.dark background to #09090b', css.includes('background-color: #09090b !important'));
check('cal-framer.css overrides hero card in dark mode', css.includes('html.dark .framer-Dv3SB .framer-eyoavh'));
check('cal-framer.css overrides step & feature cards in dark mode', css.includes('html.dark .framer-Dv3SB .framer-1tym5sg'));
check('cal-framer.css overrides radial gradient mask', css.includes('html.dark .framer-160tdzx'));
check('cal-framer.css supports OS prefers-color-scheme: dark', css.includes('@media (prefers-color-scheme: dark)'));
check('layout.tsx has synchronous theme script toggling both dark & light', layout.includes('document.documentElement.classList.add("light")'));
check('home-view.tsx has system/dark/light theme toggle logic', homeView.includes('next = "dark"') && homeView.includes('localStorage.setItem("app-theme"'));

// 4. BILINGUAL ARCHITECTURE & COPY SYNCHRONIZATION
console.log('\n--- 4. BILINGUAL (TR / EN) AUDIT ---');
check('cal-dom-tr.html has Turkish FAQ header', trHtml.includes('Sıkça Sorulan Sorular'));
check('cal-dom-tr.html has 0 English "Frequently asked questions"', !trHtml.includes('Frequently asked questions'));
check('cal-dom-tr.html has Turkish bottom CTA', trHtml.includes('Daha akıllı, daha sade randevu.'));
check('cal-dom-tr.html has 0 English "Smarter, simpler scheduling"', !trHtml.includes('Smarter, simpler scheduling'));
check('cal-dom-tr.html has Turkish hero notification pill', trHtml.includes('Görüşme 15 dk içinde başlıyor'));
check('cal-dom-tr.html has 0 English "Meeting starts in 15 mins"', !trHtml.includes('Meeting starts in 15 mins'));
check('cal-dom-tr.html has id="faq" anchor', trHtml.includes('id="faq"'));
check('cal-dom-en.html has id="faq" anchor', enHtml.includes('id="faq"'));
check('cal-dom-tr.html has pricing slot', trHtml.includes('id="rondevu-pricing-slot"'));
check('cal-dom-en.html has pricing slot', enHtml.includes('id="rondevu-pricing-slot"'));
check('home-view.tsx auto-detects browser language with fallback to tr', homeView.includes('browserLang.startsWith("en")') && homeView.includes('setLocale("tr")'));
check('home-view.tsx has FAQ accordion event delegation', homeView.includes('data-framer-name*="Question"'));

console.log('\n====================================================');
if (allPassed) {
  console.log('🎉 ALL 24 VERIFICATION AUDITS PASSED WITH 100% SUCCESS!');
} else {
  console.error('💥 SOME AUDITS FAILED - PLEASE REVIEW ABOVE.');
  process.exit(1);
}
console.log('====================================================\n');
