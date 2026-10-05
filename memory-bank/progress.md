# Progress — rOndevu

## 2026-10-05 — Adım ve özellik kartı animasyonları

- Müsaitlik, görüşme şekli, takvim akışı ve otomatik bildirim önizlemelerindeki donuk Framer hareketleri CSS/istemci döngüsüyle etkinleştirildi.
- Tüm hareketler `prefers-reduced-motion` altında kapalıdır.

## 2026-10-05 — Hero hizalama ve randevu varyasyonları

- Ana sayfa hero kartının üst boşluğu azaltıldı.
- Takvim mockup’ına TR/EN dört randevu profili eklendi; ad, başlık, açıklama, süre ve tarih vurgusu tek animasyon döngüsünde güncellenir.

## 2026-10-05 — Deploy hazırlığı (kısmi doğrulama)

- Aktif ana sayfa/fiyatlandırma kaynakları Git index’ine alındı; untracked marketing kaynakları nedeniyle oluşan temiz checkout riski giderildi.
- CSP kapsamı genişletildi: bilinen marketing/giriş rotalarında enforce, diğer sayfalarda report-only. Framer dış görsel/font kaynakları açıkça tanımlandı.
- Kullanılmayan React marketing deneme bileşenleri temizlendi; referans klasörleri ve dışarı aktarılmış kullanılmayan Framer varlıkları Docker context’inden hariç tutuldu.
- Production build başlatıldı ancak sonuç üretemeden sonlandı; `.next/lock` kalıntısı kaldırıldı. Build/staging smoke, kaynak veya rota hatası değil kaynak tüketimi/işlem sonlanması nedeniyle tamamlanamadı ve tekrar doğrulanmalıdır.

## What Works
- SSS Akordiyon ve Yerleşim Düzeltmesi (2026-10-04):
  - Soru tıklamaları artık açık/kapalı Framer varyantlarını aynı state ile güncelliyor; cevap ve ikon animasyonları tanımlı.
  - Türkçe rozet, CTA sırası ve alt divider kalıntısı için scoped düzenlemeler uygulandı.
  - Biome, CSS ayrıştırması ve statik doğrulama geçti; yerel sunucu çalıştırılmadı.

- Pricing Koyu Zemin Patlaması (2026-10-04):
  - Mevcut pricing CSS korunarak inline beyaz kart, açık tablo satırı, dış canvas ve footer yüzeyleri scoped koyu tonlarla eşitlendi.
  - CSS ayrıştırması ve statik içerik doğrulaması geçti; yerel sunucu çalıştırılmadı ve uzak depoya gönderim yapılmadı.

- Bento Takvim Rozeti ve Fiyatlandırma Kartları Düzeltmeleri (2026-10-04):
  - Bento "CONNECT YOUR CALENDAR" merkezindeki rozet (`.framer-894vxg`) koyu temada `#18181b` yüzey, zarif kenarlık ve kristal beyaz "rOndevu" metni ile yüksek kontrasta kavuşturuldu; marka ikonu (`/logos/rondevu-icon.png`) `<h2>` başlığına eklendi.
  - Fiyatlandırma kartlarındaki "Try for free >" ve "Get Started" metinleri kaldırıldı; tüm plan kartları "Planı Seç" (TR) / "Choose Plan" (EN) CTA butonlarına dönüştürüldü ve `PlanContactModal` ile bağlandı.
  - Yıllık plan kartı sağ kenarındaki dikey beyaz taşma çizgisi CSS değişken ve kenarlık düzenlemeleriyle tamamen temizlendi.
  - Yerel sunucu `http://localhost:3000` ve `http://localhost:3000/pricing` üzerinde 200 OK ile doğrulanarak çalışır vaziyette bırakıldı.
  - Kesinlikle `git push` yapılmadı, sıfır yasaklı kelime kuralı korundu.
- Fiyatlandırma Tablosu Metin Çöküşü (Overlap) ve Footer Hizalama Onarımı (2026-10-04):
  - "© 2026 rOndevu. All rights reserved." / "Tüm hakları saklıdır." footer bloğu tablo akışından çıkarıldı; `#main-1` altında tam genişlikli (`framer-pricing-footer-container`) bağımsız ortalı satıra yerleştirildi. Logo, telif metni ve sistem rozeti arasındaki dikey hiyerarşi ve boşluklar normalize edildi.
  - Tablo alt satırlarındaki ("Buffer before & after events", "Minimum notice", "Time-slot intervals", "Limit booking frequency" vb.) metin çöküşü giderildi. Satırların ilk sütununa dikey flex akışı (`flex-direction: column; gap: 6px`) verildi. Uyuşmayan `.framer-3g2Zr` seçicileri `.framer-41gqb` ile eşitlendi.
  - Koyu modda tablonun altındaki kavisli beyaz arka plan temizlendi (`html.dark #feature-breakdown .framer-5bj5pn { background-color: transparent !important; }`).
  - Sıfır "altyapı" kelimesi, `git push` yapılmadı, yerel sunucu çalıştırılmadı.

- Dış Zemin Renk Bütünlüğü (#141414) ve CTA Banner Cerrahi Onarımı (2026-10-04):
  - Kök zemin rengi `globals.css`, `layout.tsx`, `home-view.tsx`, `pricing-view.tsx`, `cal-framer.css`, `cal-pricing-framer.css`, TR/EN DOM dosyalarında saf siyah (#000000) yerine koyu antrasit (#141414) tonuna eşitlendi.
  - "Daha akıllı, daha sade randevu" banner kartı (`.framer-12jqh3g`) `overflow: hidden`, `border-radius: 24px`, `isolation: isolate` ile sınırlandırıldı.
  - Taşan ızgara sınır çizgileri (`.framer-1x0adn6`) kart içine hapsedildi; dış taşıyıcı dikey kenar çizgileri (`--border-left-width: 0px`, `--border-right-width: 0px`) kaldırıldı.
  - Kartın arkasındaki radyal parlama maskesi köşesiz, yumuşak bir degrade ile `#141414` zeminine erir hale getirildi.
  - Banner butonları bağlandı: "Hemen Başla" doğrudan `/pricing` rotasına (aynı sekmede), "Bilgi Alın" ise `home-view.tsx` içerisindeki `PlanContactModal` iletişim modalına bağlandı.
  - Sıfır "altyapı" kelimesi, `git push` yapılmadı, yerel sunucu çalıştırılmadı. Biome denetimi 0 hata ile doğrulandı.

- Ana Sayfa ve Fiyatlandırma Son Rötuşları (2026-10-04):
  - Hero tek fiyatlandırma eylemine indirildi; rozet, kart notu, sosyal kanıt ve eski kayıt seçenekleri TR/EN kaynaklarından kaldırıldı.
  - Koyu tema mockup yüzeyleri, bento/entegrasyon animasyonları ve azaltılmış hareket davranışı tamamlandı.
  - Karşılaştırma tablosu yalnızca bireysel özellikleri ve iki planı gösteriyor; sütunlar okunabilir, mobil kapsayıcı yerel yatay kaydırma kullanıyor.
  - Plan çağrıları tekil `data-plan` değerleriyle doğru Aylık/Yıllık iletişim modalını açıyor; ödeme yönlendirmesi yapılmıyor.
  - Statik denetim, Biome ve çoklu ekran tarayıcı kontrolleri geçti. Turbo tip kontrolü Windows `tsc` çözümleme sorunu nedeniyle çalışmadı; doğrudan denetimde değişiklik dışı mevcut hatalar bulundu, dokunulan sayfa/modül dosyalarında yeni hata görülmedi.
  - Yerel sunucu kullanıcı incelemesine hazır; commit ve `git push` yapılmadı.

- Eksiksiz Çift Dil (TR / EN) Mimarisi ve Çeviri Temizliği:
  - Merkezi Sözlük: `home-translations.ts` merkezi sözlük yapısı tüm bileşenlerle senkronize edildi.
  - Türkçe Zemin: `cal-dom-tr.html` ve `pricing-dom-tr.html` içindeki tüm yarım kalmış İngilizce açıklamalar (karşılaştırma tablosunun 40+ açıklaması, bento kart açıklamaları, hero randevu metinleri, takvim rozetleri, kullanıcı görüşleri ve entegrasyon metinleri) akıcı, kusursuz Türkçeye çevrildi.
  - İngilizce Zemin: `cal-dom-en.html` ve `pricing-dom-en.html` içinde kalan Türkçe ibareler profesyonel İngilizceye uyarlandı.
  - Sekme Başlığı: Dil geçişlerinde `document.title` anlık ve otomatik güncelleniyor.
  - Sıfır "altyapı" kelimesi, kesinlikle `git push` yapılmadı.
  - Yerel sunucu (`localhost:3000`) HTTP 200 OK ile sorunsuz çalışıyor.

- Kök Seviye Karanlık Mod ve Tipografi Kontrast İyileştirmeleri:
  - Zemin Bütünlüğü: Kök seviyede `html.dark`, `body`, `#main`, `#cal-1to1-root`, `#cal-pricing-1to1-root` için saf obsidian siyah (`#000000 !important`) zemin kuruldu.
  - Metin Kontrastı: Framer SSR'ın satır içi `--extracted-r6o4lv` ve `--extracted-a0htzi` değişkenleri `#e4e4e7` ve `#ffffff` olarak ezildi. Başlıklar ve metinler koyu zeminde kristal netliğine ulaştı.
  - Fiyatlandırma Kartları ve Karşılaştırma Tablosu: Kartlar `#121214 !important` yüzeye, karşılaştırma tablosu satırları `#0c0c0e !important` yüzeye ve 1px zarif kenarlıklara (`rgba(255, 255, 255, 0.08)`) kavuşturuldu.
  - Onay Tikleri: Canlı zümrüt yeşili (`#10b981`) ile belirginleştirildi.
  - Sıfır "altyapı" kelimesi, kesinlikle `git push` yapılmadı.

- Cerrahi Arayüz ve Pricing Yerleşim Düzeltmeleri:
  - Navbar Sol Üst Logo: İkon görseli kaldırılarak temiz ve orantılı `rOndevu` metin logosu (`font-cal text-2xl font-bold tracking-tight text-emphasis`) yerleştirildi.
  - Ana Sayfa FAQ Boşluğu ve Akordiyon: `cal-dom-tr.html` ve `cal-dom-en.html` dosyalarındaki kapanmamış etiket sözdizim hatası düzeltildi; SSS akordiyonu sorunsuz render edilmeye başlandı.
  - Ana Sayfa Eski Pricing Bloğu Silindi: `"Daha akıllı, daha sade randevu."` sloganı ve telif satırı korunarak, footer altındaki eski `CalPricingSection` DOM'dan temizlendi.
  - Pricing Çift Başlık Giderildi: `.framer-xw7bcr` kapsayıcısındaki mükerrer başlık varyantı tekil `<h1>` + `<p>` yapısına indirgendi.
  - Pricing 19.589px Yükseklik ve Sayfa Sonu Sonsuz Boşluk Bug'ı Çözüldü: `cal-pricing-framer.css` içine eksik breakpoint medya sorguları eklenerek cihaz varyantlarının üst üste binmesi engellendi, `</body></html>` etiketleri ayıklandı, taban boşlukları normalize edildi.
  - Karşılaştırma Tablosu Onay Tikleri: `svg-templates.html` dosyasına eksik `#svg8830033853` checkmark tanımı eklenip zümrüt yeşili renklendirildi.
  - Ekip Yönetimi Kaldırıldı: Karşılaştırma tablosundaki "Ekip Yönetimi" / "Teams" başlığı ve altındaki 8 satır tablodan tamamen silindi.
  - Sıfır "altyapı" kelimesi, kesinlikle `git push` yapılmadı.

- Project cloned and renamed to rOndevu
- Monorepo structure intact (Yarn 4 + Turborepo)
- Git repository initialized with main branch
- All 61 feature modules present
- All 20 packages present
- Branding rename completed (user-facing logos, constants, metadata, titles)
- All logo SVGs, favicons, app icons, metro tiles, and email logos regenerated with Cal Sans font and exact dimensions
- Historical No-Show Counter Badge in Bookings View with batch credential cross-matching (email, phone, synthetic SMS email)
- 1:1 Cal.com Ground Adaptation for rOndevu (`/example` -> rOndevu):
  - Cal.com homepage file (`/example/Cal.com _ Scheduling Software for Online Bookings.htm`) taken 1:1 as the sole architectural ground.
  - Base layout hierarchy, DOM structure, CSS (`data-framer-css`), Cal Sans/Matter typography, SVG templates, and Framer Motion animation flow preserved intact.
  - Old hybrid components (`HeroPrecisionConsole`, `RealInterfaceShowcase`, etc.) completely eliminated from root page.
  - All brand names replaced: 132 occurrences of "Cal" / "Cal.com" converted to "rOndevu" (0 remaining).
  - Logo assets integrated: `rondevu-icon.png` from `/example/logos` and official SVG wordmarks in header & nav.
  - Accept payments (Stripe/billing), Built-in video conferencing (dahili video), and external sponsor/investor tickers cleanly stripped.
  - Public instant signup removed; all buttons connect to `#pricing` and the 2-tier pricing model: Aylık (990 ₺/ay) & Yıllık (9.900 ₺/yıl - 2 Ay Hediye).
  - Plan selection opens dynamic `PlanContactModal` pulling live admin contacts from `trpc.viewer.public.getPlanContact`.
  - Deep luxury dark mode with automatic OS detection (`prefers-color-scheme`) + manual switcher (System / Dark / Light).
  - Bilingual support with automatic system detection (`navigator.language` -> `en`, default fallback `tr`) + manual `TR / EN` switch.
  - Server-side pre-reading of transformed DOMs (`cal-dom-tr.html`, `cal-dom-en.html`, `svg-templates.html`) delivers instant TTFB and zero hydration issues.
  - Local development server running live with HTTP 200 OK verified on `/` and `/pricing`.
- Karanlık Mod, Donmuş Animasyonların Onarımı ve Çift Dil (TR/EN) Mimarisi:
  - Karanlık Mod Onarımı: `cal-framer.css` içindeki hardcoded beyaz zeminli kartlar (`.framer-eyoavh`, `.framer-1tym5sg`, `.framer-igaxec` vb.) koyu zemin (`#121214`), koyu kenarlık (`#27272a`) ve gölgelerle hem `html.dark` hem de `@media (prefers-color-scheme: dark)` için tam uyumlu hale getirildi; beyaz zemin parlamaları giderildi.
  - Senkron Tema Başlatıcı: `layout.tsx` scripti açık modda `html.light` sınıfını da ekleyerek koyu işletim sistemlerinde açık temanın ezilmesini önledi.
  - Donmuş Animasyon Çözümü: Framer SSR'dan kalan `opacity: 0.001` ve `opacity: 0` inline kilitleri çözüldü (Navbar CTA butonları, takvim haftalık görünümü, rezervasyon kartları). Mikro hover efektleri ve nabız parlamaları eklendi.
  - SSS Akordiyon Etkileşimi: `home-view.tsx` içine event delegation eklenerek sorulara tıklandığında cevap alanlarının akıcı açılıp kapanması sağlandı.
  - YASAKLI KELİME KURALI: `home-translations.ts` dosyasından "altyapı" kelimesi tamamen temizlendi, proje genelinde 0 eşleşme doğrulandı.
  - Tam Çift Dil Senkronizasyonu: `cal-dom-tr.html` içerisinde kalan İngilizce SSS soruları, alt CTA ve bildirim hapları doğal Türkçe metinlere dönüştürüldü.
  - Doğrulama: `scripts/verify_all_fixes.js` 24 testin tümünde 100% PASS verdi. Dev sunucusu başlatılmadı, git push yapılmadı.
- Cerrahi DOM Temizliği & rOndevu Markalama (DOM Purge):
  - Sahte sertifikalar (ISO 27001, SOC 2, CCPA, GDPR, HIPAA) tamamen temizlendi (0).
  - Sahte indirme butonları (Android, iOS, Chrome, Safari, macOS, Windows, Linux) silindi (0).
  - Sahte inceleme rozetleri (Hero Trustpilot, footer G2 ve CTA Product Hunt / G2 / Google Reviews) silindi (0).
  - Alakasız footer link sütunları tamamen silindi; footer'da SADECE rOndevu logosu, sade telif hakkı ve sistem durumu rozeti bırakıldı.
  - Feature Grid'den Accept payments ve Dahili Video kartları silindi (kalan kart sayısı: 6); sponsor/yatırımcı logo şeritleri kaldırıldı.
  - Navbar'dan Enterprise, Developer, Kaynaklar kaldırıldı; menüde sadece "Özellikler", "Fiyatlandırma", "SSS" bırakıldı.
  - Navbar sağ tarafına "Giriş Yap" butonu ile yanına `#rondevu-theme-lang-slot` eklendi; harici yüzen kontrol kutusu kaldırılarak tema ve dil seçicileri React Portal ile navbar içine entegre edildi.
  - 650+ KB gereksiz DOM ve sahte içerik temizlendi, tüm doğrulama testleri 100% PASS ile sonuçlandı. Biome kontrolü hatasız geçti. Sunucu başlatılmadı, git push yapılmadı.


## What's Left to Build
- [ ] Environment setup (`.env` from `.env.example`)
- [ ] Database setup (PostgreSQL + Prisma migrations)
- [ ] Fix suppressed build errors
- [ ] Custom features / modifications (TBD)
- [ ] Deployment configuration

## Current Status
**Phase**: Homepage Simplification, 3-Step Flow & Dark Mode Live on Localhost
**Last Updated**: 2026-10-03

## Known Issues
- TypeScript build errors ignored (`ignoreBuildErrors: true` in next.config)
- ESLint errors ignored (`ignoreDuringBuilds: true` in next.config)

## Evolution
1. Forked from Cal.diy (upstream of Cal.com open source)
2. Renamed to rOndevu (3 days ago)
3. Build config adjusted to suppress errors
4. Initial analysis completed (today)
5. Full user-facing rebranding and asset regeneration (SVGs, favicons, app icons, emails) completed
6. Fixed dark mode logo inversion on mobile/desktop, scaled up logo vector rendering, and replaced Cal.diy on login page with rOndevu (pushed to main)
7. Centered "rOn" lettering precisely in the middle of all favicons, app icons, and metro tiles (top/bottom margins now mathematically equal)
8. Set system default language to Turkish (`tr`), automated Turkish start for all users, added all 41 missing keys to `tr/common.json` (0 missing keys remaining), cleaned up legacy brand strings, and refined home page localization
9. Disabled "Ekibimle birlikte" onboarding plan with "Geliştirme aşamasında" badge; created dedicated minimal homepage at root route with top-right "Giriş Yap" button; added minimal pricing section with 1.000 ₺ monthly and 10.000 ₺ yearly (instead of 12.000 ₺) tiers.
10. Fixed Docker / Next.js production build `module-not-found` failure by correcting deep import of `@calcom/ui/components/logo/Logo` to `@calcom/ui/components/logo` in `apps/web/modules/home/home-view.tsx`.
11. Initial visit system theme persistence, simplified homepage pricing (990 ₺ / 9.900 ₺), framer-motion login entrance animation, minimal `/plan-bilgi` contact page, "Randevu" terminology alignment, email dark mode redesign with Turkish default fallback, and complete SMS transport engine + Admin SMS control menu (`/settings/admin/sms`).
12. Homepage revamp: Set Hero title to "Herkes için randevu altyapısı"; added interactive 3-step booking flow widget (HeroBookingMockup) inspired by interface screenshots with 100% dummy data; positioned 12 core features across 4 operational blocks with UI mockups (Müsaitlik, Out of Office toggle, No-Show listesi, Yinelenen abonelikler); added FaqSection accordion.
13. Cal.diy rebranding sweep across app-store, copyright and footers; domain normalization to `rondevu.org`; aligned calendar sync truth (one-way export of booked appointments to Google/Apple calendar without closing rOndevu availability from personal calendar events).
14. "Ofis Dışında" module overhauled with real screenshots from `interface/`: authentic list view, search & filters, dummy text replacing test entries, interactive public booking preview (day 25 with 🤕), modal overlay; removed "OOO" acronym everywhere (`İzinlerim`, `Ofis Dışı`); fixed Google Calendar API key crash in "Tatil günleri" tab with offline Turkish public holidays fallback; and implemented admin-configurable plan contact channels with role check and sanitization.
15. Server deployment readiness & security audit completed: 0 leaked secrets, strict admin authorization via authedAdminProcedure, sanitized dynamic URLs (tel, mailto, whatsapp), verified tRPC server and client compilation (code 0), updated .gitignore for local UI assets. All changes pushed to GitHub.
16. User feedback implementation:
    - Synchronized `/settings/admin/plan-contact` updates live to homepage (`home-view.tsx` and `AdminFeatureCards.tsx` Block 4) with direct phone, WhatsApp, and email buttons.
    - Restored Hero Step 3 confirmation card to exact fidelity of `Screenshot 2026-09-25 at 16-57-09` with authentic 4 square calendar buttons (Google `G`, Microsoft Outlook, Office 365, Apple Calendar `.ics`) and top navigation link.
    - Re-established minimalist monochromatic Cal aesthetic across all landing modules by removing loud/rainbow colors.
    - Overhauled Block 2 layout with wide switcher tabs and cleanly decoupled the client preview ("Danışan randevu ekranı önizlemesi") into its own spacious distinct card.
    - Implemented phone OTP SMS verification for phone bookings and fixed cancellation SMS dispatch when organizer cancels appointments.
    - Simplified SSS calendar synchronization explanation to state direct export to Google/Apple calendar.
17. Docker deployment error fix (`TS2307` module not found `@calcom/sms/sms-manager`):
    - Corrected dynamic import in `packages/features/auth/lib/verifyEmail.ts` to `@calcom/lib/smsTransport`.
    - Verified `yarn workspace @calcom/trpc run build` passes with exit code 0.
18. End-to-end SMS Verification and Notification Infrastructure:
    - Fixed phone email construction (`contructEmailFromPhoneNumber`) to strictly strip non-digits, eliminating format crashes in auth and booking flows.
    - Resolved phone verification OTP delivery by bypassing email watchlist check for SMS-based virtual emails in `sendEmailVerificationByCode`.
    - Updated `RegularBookingService` to validate verification code against the effective booker email/phone, preventing booking failures on phone-only events.
    - Decoupled SMS notifications from SMTP email failures in `email-manager.ts` using `Promise.allSettled` and isolated try/catch for creation, rescheduling, and cancellation.
    - Enhanced SMS templates with resilient Turkish defaults, registered `@calcom/sms` as a workspace package, and dynamically adjusted UI copy on the booking form and event settings.
    - All unit tests and notification flows validated with exit code 0.
19. Plan Contact Information Synchronization & Admin Usability Fix:
    - Resolved tRPC path discrepancy (`trpc.publicViewer` -> `trpc.viewer.public.getPlanContact`).
    - Added global React Query cache invalidation for both admin and public viewer queries upon saving.
    - Integrated Server-Side Rendering (SSR) in Next.js App Router `page.tsx` and `plan-bilgi/page.tsx`, eliminating layout flash and seeding React Query initialData.
    - Synchronized `AdminFeatureCards` directly with `HomeView` via props.
    - Added route cache revalidation (`revalidatePath`) in `updatePlanContact.handler.ts`.
    - Enhanced `planContactConfig.ts` with named Prisma import, multi-path filesystem resolution for backups, and resilient DB theme parsing.
    - Added "Varsayılana Sıfırla" one-click button in admin panel with confirmation dialog.
    - Validated with automated test suite and verified 0 TypeScript errors on changed files.
20. Homepage Terminology, Single Price Premium Access Highlight & Mobile Booking Flow Overhaul:
    - Aligned Hero title to "Herkes için randevu sistemi" on homepage and manifest.
    - Overhauled features & pricing sections on `/`, `/plan-bilgi`, and FAQ: clearly conveyed that no tiered plans, feature locks, or commissions exist ("Tek fiyata premium erişim").
    - Fixed mobile responsiveness of the live booking flow simulator (`HeroBookingMockup`): eliminated URL overflow/wrap, aligned step switcher into a 3-column mobile grid, made calendar cells square and touch-friendly, arranged mobile slots into a 3-column row, and added clean section dividers.
    - Validated all changes with Biome checks (exit code 0).
21. Phone Verification Gate & Provider-Agnostic SMS Lifecycle Overhaul:
    - **Twilio Architecture Separation**: Integrated Twilio Verify v2 REST API (`TWILIO_VERIFY_SID`) for OTP code sending and verification checks; used Twilio Programmable Messaging API (`TWILIO_MESSAGING_SID` / `TWILIO_PHONE_NUMBER`) for transactional booking notifications. Dokploy environment variables `TWILIO_SID` and `TWILIO_TOKEN` supported alongside `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN`.
    - **Decoupled Provider-Agnostic SMS Layer**: Implemented `ISmsProvider` interface with `TwilioSmsProvider`, `NetgsmSmsProvider`, `WebhookSmsProvider`, and `SimulationSmsProvider` in `packages/lib/smsTransport.ts`.
    - **Strict Phone Verification Gate**: Automatically enforced `requiresBookerEmailVerification` when phone confirmation is toggled (`FormBuilder.tsx`, `EventAdvancedTab.tsx`), stopped frontend bypass until verified (`useVerifyEmail.ts`), and enforced backend verification code validation in `RegularBookingService.ts`.
    - **Complete End-to-End SMS Lifecycle**: Removed artificial `isSmsCalEmail` constraint in `sms-manager.ts` so all booking lifecycle events (confirmation, reschedule, cancellation) dispatch SMS to attendees with phone numbers.
    - **Scheduled Reminders**: Implemented appointment reminder SMS via Tasker queue (`EventReminderSMS`, `tasks/sendSms.ts`, `scheduleReminderSmsTrigger.ts`) and cancellation cleanup (`handleCancelBooking.ts`).
    - **Validation**: All 8 SMSManager unit tests passed and Biome check clean (0 errors).
22. Docker Deploy Build Fix (@calcom/trpc TS2353 & TS2339):
    - Added `smsReminderNumber?: string | null;` to `CalendarEvent` in `packages/types/Calendar.d.ts`.
    - Declared `@calcom/sms` workspace dependency in `packages/features/package.json` and updated `yarn.lock`.
    - Verified locally with `yarn workspace @calcom/trpc run build` (build:server and build:react compile with 0 errors).
    - Verified SMSManager test suite (8 tests passed) and Biome formatting.
23. Frontend Phone Verification Gate Fix, Legal Pages (/privacy & /tos) and Dynamic SEO Sitemap:
    - Fixed Booker frontend to detect phone confirmation mode (`isPhoneConfirmationEvent`), switch action button to "Telefonu Doğrula", dispatch `sendPhoneVerification` via Twilio Verify, open 6-digit `VerifyCodeDialog`, and store `verificationCode` in `BookerStore` before sending booking mutation.
    - Created `/privacy` and `/tos` legal pages with Dark/Light mode support, detailing Data Processor/Controller roles, Twilio and Cloudflare subprocessors, SaaS disclaimers, liability limitations, and anti-spam terms.
    - Created dynamic `app/sitemap.ts` (`/sitemap.xml`) and `app/robots.ts` (`/robots.txt`).
    - Verified with Biome check (0 errors), tRPC build (code 0), and Vitest unit tests (5/5 passed).
24. Resolution of 6 Defect Report Gaps (SMS OTP Flow, Legal Pages, and SEO Sitemap):
    - **Defect 1 (State Race Condition)**: Passed `overrideVerificationCode` directly through `useHandleBookEvent` and `BookerWebWrapper.tsx` on verification success, avoiding asynchronous closure lag.
    - **Defect 2 (E.164 Phone Normalization)**: Implemented universal `normalizePhoneNumber.ts` handling all Turkish and international formats, enforced E.164 regex validation in `phoneVerification.ts`, and sanitized phone numbers in booking mappers and services (5 tests passing).
    - **Defect 3 (Phone Confirmation Detection Logic)**: Enhanced `isPhoneConfirmationEvent` to check `metadata.confirmationOption === "phone"`, etc., correctly enforcing the phone OTP gate even when organizers collect both email and phone as visible/required fields. Fixed `RegularBookingService.ts` to verify phone OTP against attendee phone number (10 tests passing).
    - **Defect 4 (Dynamic Legal Contact Info)**: Removed all hardcoded personal contact info from `privacy-view.tsx` and `tos-view.tsx`. Connected SSR `getPlanContactConfig()` and dynamic `trpc.viewer.public.getPlanContact` query.
    - **Defect 5 (Duplicate Sitemap Aliases)**: Removed `/gizlilik-politikasi` and `/kullanim-kosullari` from `sitemap.ts`, exposing strictly canonical URLs to search crawlers.
    - **Defect 6 (OTP Resend & Modal Dismissal)**: Upgraded `VerifyCodeDialog.tsx` with a 60-second cooldown timer, resend button, and complete state cleanup on dismissal, keeping booking form buttons active and responsive without a page reload.
    - **Validation**: 15 Vitest unit tests passed, `@calcom/trpc` built cleanly (code 0), and Biome check verified.
25. System-Wide Architectural, Logical, and Security Audit Remediation (CRIT-01 through LOW-02):
    - **CRIT-01 (NextAuth Session Privilege Escalation)**: Stripped client-controlled email updates from NextAuth `trigger === "update"`. Anchored session user lookup to immutable user ID (`token.sub`/`token.id`), preventing account takeover via session updates.
    - **CRIT-02 & LOW-01 (Cron Authentication Bypass & Timing Attacks)**: Implemented centralized, constant-time `validateCronAuth.ts` rejecting requests if secrets are unconfigured and eliminating the `"Bearer undefined"` vulnerability across tasker and web cron routes (`cron.ts`, `cleanup.ts`, `calendar-subscriptions`, `selected-calendars`, `calendar-subscriptions-cleanup`, `bookingReminder`, `webhookTriggers`).
    - **CRIT-03 (Unpaid Booking Confirmation Inversion)**: Fixed inverted logic bug in `confirm.handler.ts` by throwing `TRPCError(BAD_REQUEST)` when attempting to confirm an unpaid booking.
    - **HIGH-01 (In-Memory Fallback Rate Limiter)**: Implemented in-memory sliding-window token bucket fallback in `rateLimit.ts` when `UNKEY_ROOT_KEY` is not present, safeguarding SMS OTP and booking routes against toll fraud and brute force in self-hosted environments.
    - **HIGH-02 (Pending Booking Idempotency & Double-Booking Fix)**: Extended `bookingIdempotencyKeyExtension` to generate `idempotencyKey` for both `ACCEPTED` and `PENDING` bookings upon creation, closing the race condition where concurrent users could double-book the same slot.
    - **HIGH-03 (Capability-URL Cancellation & Refund Protection)**: Enforced authorization on unauthenticated cancellation requests in `handleCancelBooking.ts`: caller must supply matching attendee or host email (`cancelledBy`), preventing unauthorized cancellations and automated refunds via intercepted UIDs.
    - **HIGH-04 (Calendar Reservation DoS Defense)**: Added IP rate limiting and enforced a maximum of 3 concurrent active temporary slot reservations per client session UID in `reserveSlot.handler.ts`.
    - **MED-01 (Seated Event Concurrency Protection)**: Verified transaction row-level locking (`SELECT ... FOR UPDATE`) is active on the parent booking row in `createNewSeat.ts`.
    - **MED-02 (Plan Contact Configuration Single Source of Truth)**: Made PostgreSQL database persistence authoritative in `planContactConfig.ts`: throws explicit errors on DB failures rather than silently masking them with ephemeral container file backups.
    - **MED-03 (Outgoing Webhook HTTP Timeout Guard)**: Attached `AbortSignal.timeout(10000)` (10 seconds) to outgoing webhook HTTP POST dispatches in `sendPayload.ts` to prevent worker socket starvation.
    - **LOW-02 (Global Expired Selected Slots Sweeper)**: Added `deleteManyExpiredSlotsAcrossAllEvents` in `PrismaSelectedSlotRepository.ts` and wired it into `calendar-subscriptions-cleanup` cron route.
    - **Validation**: 25 Vitest tests passed across all 4 suites (100%), `@calcom/trpc` compiles cleanly (0 errors), and Biome code check verified (0 errors).
26. Resolution of SMS OTP Twilio Single-Use Rejection and Stale State Loop:
    - **Root Cause 1 (Twilio Verify Single-Use Invalidation)**: Twilio Verify's `VerificationCheck` API is strictly single-use. Once approved in the modal dialog, subsequent calls from `RegularBookingService` fail because Twilio deletes/consumes the pending verification. Resolved by introducing `verifiedPhoneCache` in `packages/features/auth/lib/phoneVerification.ts` with a 15-minute sliding TTL, caching approved statuses across the booking pipeline.
    - **Root Cause 2 (Stale Verification Loop & State Lock)**: If booking creation was rejected, `BookerStore.verificationCode` and `verifiedEmail` remained stored, leaving `isVerified: true` and keeping the form button in "Onayla" (Submit) mode. Submitting immediately resent the rejected code without prompting for a new OTP. Resolved by clearing `verificationCode` and `verifiedEmail` on verification errors in `useBookings.ts`, removing premature `setVerificationCode` from `VerifyCodeDialog.tsx`, and passing exact mutation variables in `useVerifyCode.ts`.
    - **Root Cause 3 (Resend & Cache Invalidation)**: Calling `sendPhoneVerification` now invalidates any previous cached verifications for that phone number via `clearPhoneVerificationCache`, ensuring only fresh codes are valid.
    - **Validation**: 26 Vitest unit tests passed across 5 suites (100%), tRPC server type check compiled with 0 errors, and Biome lint check clean.
27. System-Wide Integrity, Security & Regression Rescan (Zero-Hallucination Directive):
    - **Edge Case 1 (OTP Post-Booking Replay Window)**: Confirmed replay vulnerability in `verifiedPhoneCache` where entries survived booking completion for 15 minutes. Implemented `consumePhoneVerification` in `phoneVerification.ts` and invoked it in `RegularBookingService.ts` upon successful creation of standard bookings or the final recurring slot.
    - **Edge Case 2 (Cancellation Flow for Phone Attendees)**: Confirmed deadlock in `handleCancelBooking.ts` where unauthenticated cancellations only checked `a.email === normalizedCancelledBy`, blocking phone attendees with synthetic emails (`<phone>@sms.rondevu.org`). Expanded authorization check to support direct phone matching, synthetic email mapping via `contructEmailFromPhoneNumber`, and digits matching.
    - **Edge Case 3 (Slot Lockout on Cancelled/Rejected Slots)**: Confirmed 100% clean. `bookingIdempotencyKeyExtension` explicitly nulls `args.data.idempotencyKey = null` on `CANCELLED` and `REJECTED` bookings, and PostgreSQL standard unique indexes allow multiple `NULL` values, freeing the slot for re-booking without key collision.
    - **Edge Case 4 (In-Memory Cache Boundaries & Eviction)**: Resolved heap leak potential in `phoneVerification.ts` and `rateLimit.ts` by introducing bounded capacities (`MAX_VERIFIED_PHONE_CACHE_SIZE = 10000`, `MAX_MEMORY_STORE_SIZE = 10000`) and downlevel-safe FIFO eviction using iterator `next().value`.
    - **Validation**: 100% of Vitest unit tests passed (including new replay protection and cache boundary tests), server type-check passed with 0 errors (`tsc --project packages/trpc/tsconfig.server.json --noEmit` exit 0), and clean code verification completed.
28. Critical Build Fix: Broken Import in CancelBooking.tsx & Web Build Verification:
    - **Broken Module Import Fixed**: Fixed broken import `@calcom/ui/components/form/inputs/TextField` in `apps/web/components/booking/CancelBooking.tsx` by importing `Input` from canonical `@calcom/ui/components/form` export map.
    - **Build Icons Unmatched Files Fix**: Updated `packages/ui/scripts/build-icons.mjs` to add `--no-errors-on-unmatched` flag to Biome format, avoiding exit code 1 when formatting sprite files in ignored `public/` directories.
    - **Full Next.js Web Production Build Verified**: Executed and validated full Next.js 16 (Turbopack) production build for `@calcom/web` locally with exit code 0 (`✓ Compiled successfully in 5.2min`, `✓ Generating static pages using 7 workers (98/98) in 6.1s`).
    - **Validation**: Biome checks clean (0 errors) and production build verified.
29. SMS Template Compression & GSM 7-bit Sanitization (Twilio Error 30044 Fix):
    - **GSM 7-bit ASCII Transliteration Helper**: Created `packages/lib/sanitizeSmsText.ts` and re-exported it in `packages/lib/smsTransport.ts` and `packages/sms/sms-transport.ts`. Automatically maps Turkish characters (`ç, Ç, ğ, Ğ, ı, İ, ö, Ö, ş, Ş, ü, Ü`), circumflex vowels (`â, Â, î, Î, û, Û`), smart quotes (`“”, ‘’`), dashes (`–, —`), ellipsis, and diacritics into standard GSM 7-bit ASCII before dispatch in `sendSMS`, preventing UCS-2 Unicode fallback and preserving 160-character per segment capacity.
    - **Radical Template Shortening (<= 160 Chars / 1 Segment)**: Overhauled all 10 attendee SMS templates in `packages/sms/attendee/` (confirmation, reminder, cancellation, reschedule, booking requested, declined, location changed, awaiting payment, seat cancelled, reschedule requested) into concise, 1-segment structures. Stripped conversational greetings, attendee notes, and protocols (`https://`). Format: `"rOndevu: [Baslik] randevunuz onaylandi. Tarih: [DD.MM HH:mm]. Detay/Iptal: rondevu.org/b/[uid]"`. Added title length capping and compact date formatting (`DD.MM HH:mm`) on `SMSManager`.
    - **Short URL Redirection**: Added `/b/:uid` redirect to `/booking/:uid` in `apps/web/next.config.ts`.
    - **Validation & Tests**: Added unit tests in `packages/sms/test/sanitize-sms.test.ts` (10/10 passed, 18/18 total passed across `packages/sms/test/`). Verified server TypeScript compilation (`tsc --project packages/trpc/tsconfig.server.json --noEmit` exit 0).
30. UI Polishing, "Tatil Günleri" View, Landing Page Copy & Terminology Standardization:
    - **Out of Office Top Navigation Fixes**: Increased tab gap and spacing (`gap-4 sm:gap-6`, `whitespace-nowrap`), removed awkward overflow dot indicator from "Ofis Dışında (İzin & Acil Durum)" button, and prevented label wrapping.
    - **Segmented Control Spacing & Padding**: Fixed container padding to `p-1 rounded-xl` and active pill padding to `px-3 py-1.5 rounded-lg` in both `ToggleGroup.tsx` and `AdminFeatureCards.tsx` to completely eliminate background clipping and wrapper overflow.
    - **"Tatil Günleri" Tab View**: Implemented interactive Turkish public & religious holiday calendar matching `Screenshot 2026-09-27 at 02-24-03 Ofis Dışında Tatil Rondevu.png` with Turkey selector (`🇹🇷 Turkey ˅`), 16 holidays with 📅 and 🌙 icons, dates, and interactive switch toggles. Automatically disables "+ Ekle" button when on the holidays tab.
    - **Landing Page Feature (Smart Calendar Protection)**: Added "Akıllı Takvim Koruması (Çakışma Önleme)" highlight card to Block 1 and added "Akıllı Takvim Koruması (Hizmetler arası otomatik çakışma engelleme)" to `monthlyFeatures` in `apps/web/modules/home/home-view.tsx`.
    - **Terminology Standardization**: Updated 64 attendee-facing translation keys in `packages/i18n/locales/tr/common.json` replacing corporate "Toplantı" with "Randevu" and "Rezervasyon" (e.g. `your_meeting_has_been_booked`, `booking_fail`, `reschedule_fail`, `meeting_is_scheduled`, etc.).
    - **Validation**: Biome checks clean (0 errors), TypeScript server compilation passed (exit code 0), and all SMS unit tests passed (18/18).
31. Runtime Bug Fix: `ReferenceError: cancellationNoShowFeeNotAcknowledged is not defined` in CancelBooking.tsx:
    - Restored `cancellationNoShowFeeNotAcknowledged = !props.isHost && cancellationNoShowFeeWarning && !acknowledgeCancellationNoShowFee` definition in `apps/web/components/booking/CancelBooking.tsx`.
    - Resolved runtime crash on rendering booking cancellation view.
    - Verified via AST diagnostics (0 errors), Biome check (0 errors), and tRPC server type check (exit code 0).
32. Fix October & Future Months Availability Outage (External Calendar Failure Resilience):
    - **Root Cause**: An expired/revoked Google Calendar OAuth credential for the organizer failed with `invalid_grant`. Due to `responseBody.myFetchError` not being inspected in `CalendarAuth.ts`, the credential was never marked `invalid: true`. In turn, `getBusyTimes` threw an error and `getUserAvailability`'s catch block cleared all user working hours (`dateRanges: []`), causing October and all subsequent months to show "Ekim ayında müsaitlik yok".
    - **Remediation**:
      - Updated `CalendarAuth.ts` to inspect `myFetchError` for `"invalid_grant"`, allowing automatic invalidation of expired credentials.
      - Updated `getUserAvailability.ts` to set `busyTimes = []` on external calendar fetch failure, preserving user availability date ranges.
      - Set `_silentCalendarFailures: true` by default in `slots/util.ts` for public slot queries.
    - **Validation**: 29 unit tests passed in Google Calendar app suite, 15 tests passed in busyTimes suite, `Booker.test.tsx` passed, tRPC server type check compiled cleanly with exit 0, and Biome lint check clean.
33. Independent Pricing Card Layout, Feature List Count Simplification, and Natural Turkish FAQ Rewrite:
    - **Independent Pricing Card Layout**: Replaced `items-stretch` with `items-start` on the pricing cards CSS grid container in `apps/web/modules/home/home-view.tsx`. Expanding "Dahil Olan Özellikler" in one card now preserves the other card at its own compact height without creating empty vertical space.
    - **Feature List Count Simplification**: Reduced `monthlyFeatures` from 11 items to 6 concrete, essential features (Sınırsız randevu, Google/Apple Takvim eşitleme, SMS/e-posta hatırlatma, SMS müşteri doğrulama, Özel web adresi bağlama, İzin günleri yönetimi). Reduced `yearlyFeatures` to 4 distinct advantages, completely eliminating dummy/filler entries.
    - **Natural Turkish FAQ Rewrite**: Completely rewrote all 8 questions and answers in `apps/web/modules/home/components/FaqSection.tsx` into plain, friendly, conversational Turkish. Fully eradicated confusing technical jargon such as "anahtar teslim", "güvenli SSL sertifikası", "Out of Office (OOO)", and "entegrasyonu nasıl çalışıyor". Removed redundant top pill.
    - **Validation**: Biome lint & format passed with 0 errors, Vitest passed (19/19 tests), and UI verified via browser subagent.
34. Radical Minimalist Principal Design Engineer Homepage Architecture:
    - **Living Precision Console (`HeroPrecisionConsole.tsx`)**: Replaced generic mockups with an interactive dual-perspective console. Enables instant slot selection (0.4s booking velocity), simulated SMS OTP verification feedback, and live organizer day-view with Google Meet room status.
    - **Kinetic Bento Instruments (`BentoInstruments.tsx`)**: Replaced text-heavy feature blocks with 4 living, interactive instruments: Dual Calendar Collision Shield (0ms conflict prevention), Autonomous GSM-compliant SMS Lifecycle (instant, 24h, 2h triggers), Personal Identity & Custom Domain Omnibar (`rondevu.org` -> `doktorayse.com`), and Instant Time-Off / Vacation Mode switch.
    - **Horological Monetary Cards**: Precision pricing cards (990 ₺ monthly and 9.900 ₺ yearly with 2 months free and 12-month price guarantee), decoupled accordion expansion, and live synced consultation support bar.
    - **Validation & Test Suite**: 19/19 Vitest unit tests passed, Biome code check clean (0 errors), dev server live at `http://localhost:3000` with HTTP 200 OK, full browser subagent visual inspection completed with screenshots and video, 0 commits pushed per user instruction.
35. Cal.com-Referenced Pricing Section & Modular Feature Comparison Matrix:
    - **Aylık & Yıllık 2-Plan Layout with Billing Switcher**: Added interactive toggle switch with "2 Ay Hediye" pill in `CalPricingSection.tsx`.
    - **Modular Comparison Matrix (`PricingMatrix.tsx`)**: Created Cal.com-styled matrix component rendering 18 real rOndevu scheduling capabilities across 5 distinct categories with responsive horizontal scroll and dark mode styling. Omitted "Payments" and "Built-in Video" entirely.
    - **Dynamic Admin Contact Modal (`PlanContactModal.tsx`)**: No credit cards or checkout forms; dynamic modal with sanitized WhatsApp link (`replace(/\D/g, '')`, `encodeURIComponent` prefill message), phone link, and email link pulling from `trpc.viewer.public.getPlanContact`.
    - **Bilingual i18n & Zero Forbidden Words**: Full TR and EN translation coverage in `home-translations.ts` with 0 occurrences of "altyapı".
    - **Validation**: Biome code check clean (0 errors), dev server verified live at `http://localhost:3000/` with 0 console hydration errors and full browser subagent verification, 0 commits pushed per user instruction.

36. Dark integration/footer contrast pass:
    - Added scoped dark styling for integration tiles, Zapier contrast, divider plus markers, footer status, and hero preview border layers in `cal-framer.css`.
    - Added hydration-safe footer status/logo normalization and Mayıs 2026 hero year update in `home-view.tsx`.
    - Local server verified with HTTP 200 on `/` and `/pricing`; `yarn type-check:ci --force` reached package checks but failed in existing workspace setup because several packages could not spawn `tsc` (`ENOENT`). No push or commit performed.

37. Pricing status-overlay fix:
    - Diagnosed the white pricing overlay as the external OpenStatus badge image stretching to the full pricing canvas because its Framer container was not positioned.
    - Replaced that image with a bounded localized status badge and added pre-hydration CSS constraints. Playwright visual and hit-test checks confirm the white overlay is gone and the former overlay area no longer opens `status.rondevu.org`.

38. Homepage contrast and FAQ spacing fix:
    - Set the homepage canvas/empty structural surface to `#262626` and structural borders to `#b1b1b2` in dark mode.
    - Capped FAQ answer expansion to measured text content (max 240px), eliminating the long blank expansion artifact. Playwright confirmed a closed FAQ opens to a bounded 48px content panel rather than the exported 1896px wrapper height.

39. Homepage color consistency follow-up:
    - Normalized the nested `#main` and wrapper surfaces to `#262626`, removing the last `#141414` outer bands.
    - Updated horizontal Framer `Line` elements to `#b1b1b2` so separator treatment matches the requested vertical line contrast.

40. Dark theme visual balance:
    - Replaced the overly bright `#262626` outer canvas with a unified `#1c1c20` dark surface across the homepage wrapper, `#main`, and Framer sections.
    - Removed long structural section borders and layout-guide corner handles; retained subtle separator lines and card-level framing.

41. Pricing visual cleanup:
    - Added matching subtle vertical section edges to the homepage.
    - Reduced comparison matrix heading whitespace, normalized feature heading colors, constrained yearly billing text wrapping, and softened footer copyright/status framing.

42. Navigation and plan consistency:
    - Simplified the navbar to logo, locale/theme controls, and login; removed the three center links and refined sizing/radii.
    - Added hydration-time normalization for missing comparison checkmarks so all feature rows show inclusion in both monthly and yearly columns.
    - Refined the contact modal, matrix separators, annual text wrapping, footer frame, and dark badge icon contrast.

43. Badge icon contrast:
    - Added a scoped dark-mode filter for image-based SVG icons inside Framer `White Icon` badges so the icons render white instead of disappearing as black marks.

44. Cross-page visual QA:
    - Checked homepage and pricing in dark mode at 1280px and 390px; both remain viewport-contained without document-level horizontal overflow.
    - Applied final annual-copy wrapping and homepage preview normalization refinements after the visual pass.

45. Homepage canvas and pricing contrast pass:
    - Changed the dark homepage canvas and structural shells to `#141414` to match pricing while keeping content cards on their layered dark surfaces.
    - Corrected the desktop feature matrix's right bias with a scoped centering offset; narrow layouts keep their contained horizontal scroll behavior.
    - Raised the first two pricing feature heading colors to the same readable light tone as the rest of the matrix.
    - Replaced green plan-selection accents and check/icon SVG colors with neutral grayscale styling across the pricing route and contact modal.
    - Local browser checks confirmed homepage roots use `rgb(20, 20, 20)`, pricing contains no computed green styles, and no document-level horizontal overflow was introduced.

46. Final wrapper and interaction pass (2026-10-05):
    - Static TR/EN Framer fragments now place FAQ action buttons after the question list and render a bounded localized system-status badge.
    - Pricing matrix static verification passed; all 38 feature rows have both monthly and yearly checkmarks, with no document overflow in the local browser.
    - FAQ was tested open then closed with bounded height/opacity transitions; plan selection opened the contact modal without leaving the pricing route.
    - Biome reports existing explicit-return/ternary diagnostics in the touched view/navbar files; no automatic rewrite was applied. `corepack yarn type-check:ci --force` reached package checks but failed because workspace packages could not spawn `tsc` (`ENOENT`).

47. Pricing comparison card alignment (2026-10-05):
    - Removed only the redundant billing/gift labels from the monthly/yearly comparison header; the main annual plan card content remains unchanged.
    - Added scoped flex alignment rules so both comparison cards have equal height and their Planı Seç buttons share the same baseline.
    - Static verification passed; narrow browser measurements confirmed equal card and CTA geometry with no document-level horizontal overflow.

48. Pricing heading, price alignment, and outline cleanup (2026-10-05):
    - Updated TR/EN pricing headings to “rOndevu planınızı seçin” / “Choose your rOndevu plan”.
    - Centered both main plan prices and removed redundant annual billing and gift labels from the annual card.
    - Removed the comparison section’s exported pseudo-outline so the empty gutter blends into the dark canvas; canceled the desktop shell offset to center the matrix, with row separators intact.
    - Re-ran static verification and confirmed the live pricing route has no document-level horizontal overflow.

49. Pricing feature link cleanup (2026-10-05):
    - Converted the monthly plan’s two `/app` feature links, plus their EN counterparts, to plain text labels.
    - Removed inherited underline/decoration styles so both labels match neighboring features.
    - Static verification passed; live browser check found zero `/app` links in the pricing cards.

50. Pricing card, matrix, and footer refinement (2026-10-05):
    - Removed the annual plan card's redundant yearly control and restored the original main-card price/unit composition.
    - Enlarged/centered the comparison feature header, put both comparison prices in one shared grid row, and turned the advanced-feature label into a borderless section divider.
    - Removed the pricing footer status control, removed the distinct footer card surface, centered its copyright, and enlarged the rOndevu text logo.
    - Static marketing verification passed. A fresh browser check measured equal comparison-price Y positions, transparent footer canvas, no hidden yearly control/status control, and zero document-level horizontal overflow.

51. FAQ answer and icon repair (2026-10-05):
    - Made the click handler reveal answer text as it expands and set the answer height from measured content rather than the exported full-section size.
    - Normalized persistent item separators and replaced the dark exported plus SVG with a simple high-contrast glyph for both locales.
    - Regenerated Framer fragments; static marketing verification passed.

52. FAQ glyph and answer-width correction (2026-10-05):
    - Removed the duplicate pseudo-plus and made answer wrapper/text blocks full-width rather than inheriting Framer's one-pixel flex width.
    - Static marketing verification passed.
## 2026-10-05 — Recurring appointment feature card

- Added localized Turkish and English recurring-appointment copy to the home feature grid, with a hover/focus explanation for regular clients.
## 2026-10-05 — System-preference navigation

- Marketing navigation now follows browser language and color-scheme preferences and no longer exposes TR/EN or theme controls.
