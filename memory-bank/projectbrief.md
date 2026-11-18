# Project Brief — rOndevu

## Overview
**rOndevu** (`rondevu.org`), ileriye dönük kurulacak **Çatı Marka (Umbrella Brand / Venture Studio)** ekosistemi altındaki ilk dikey SaaS ürünüdür. Temel olarak `rondevu` (rOndevu fork) üzerine inşa edilmiş olsa da; bireysel açık kaynak kopyası olmaktan çıkarılarak Türkiye ve yerel pazardaki dikey sektörlerin (klinikler, güzellik merkezleri, danışmanlık ofisleri, kuaför/berber salonları ve yerel işletmeler) hızlı randevu ve takvim yönetim ihtiyaçlarına odaklanan ticari bir SaaS platformuna dönüştürülmüştür.

## Core Pillars & Capabilities
- **Dikey SaaS Odaklı Randevu Motoru:** Türkiye/yerel pazar alışkanlıklarına uygun, Türkçe varsayılan dil (`tr`) ve İngilizce (`en`) çift dil destekli, sadeleştirilmiş randevu alma ve takvim yönetim deneyimi.
- **WhatsApp Bildirim Omurgası (Evolution API + n8n):** Randevu onay, hatırlatma, iptal ve erteleme bildirimlerinin sistem çapında Platform Webhook -> n8n -> Evolution API hattı üzerinden, alıcı onayı (opt-in/opt-out) denetimiyle iletilmesi.
- **SMS & Telefon Doğrulama Omurgası (Twilio / Netgsm):** Sahte randevuları ve gelmeme (no-show) oranlarını engelleyen SMS OTP doğrulaması (Twilio Verify) ve işlem bazlı 160 karakterlik (GSM 7-bit) SMS bildirim/hatırlatma motoru.
- **Takvim Senkronizasyonu ve Çakışma Kalkanı:** Google Calendar ve Apple Calendar eşitlemesi, izin/tatil günleri (`Ofis Dışında` & Türkiye resmi/dini tatilleri) ve geçmiş katılmama (`historicalNoShowCount`) takibi.
- **Tek Fiyata Tam Erişim (Aylık / Yıllık Plan):** Karmaşık enterprise/team paketleri yerine yalın Aylık ve Yıllık abonelik modeli; doğrudan yönetici iletişim kanallarıyla (`PlanContactConfig`) hızlı aktivasyon.
- **Doğrudan Veritabanı Outreach Demo Enjeksiyonu (15-Day TTL):** Potansiyel işletmeler için ayrı bir demo ortamı kurmak yerine, aday profillerinin doğrudan PostgreSQL veritabanına (`isOutreachDemo: true`, `demoCreatedAt`, `demoExpiresAt: +15 gün`) işlenmesi, **"Şifremi Unuttum"** akışı ve ödeme adımıyla sürtünmesiz devralınması (claim) ve sahiplenilmeyen demo hesaplarının 15 gün sonunda otomatik temizlenmesi.

## Architectural & Strategic Goals
1. **Bütünsel Tasarım ve UX Ayrışması:** rOndevu / rOndevu tasarım dilinden kopularak Çatı Marka (`brand.md`) değerleriyle uyumlu, yerel dikey sektörlerin WhatsApp/SMS odaklı randevu alışkanlıklarına hitap eden özgün arayüz.
2. **Kod Tabanı Arındırma (De-Cal'ification):** rOndevu kapsamında kullanılmayan rOndevu `app-store` entegrasyonlarının, karmaşık organizasyon/enterprise bileşenlerinin ve ölü kodların ayıklanarak yalnızca çekirdek randevu motoru, WhatsApp, SMS ve yerel ödeme/bildirim katmanlarından oluşan hafif ve modüler bir mimariye ulaşılması.
3. **Yeniden Kullanılabilir Çatı Marka Bileşenleri:** Kimlik doğrulama, mesajlaşma omurgası (Evolution API / WhatsApp, SMS), webhook yönetimi ve outreach demo motorunun gelecekteki diğer Venture Studio dikey ürünlerine aktarılabilecek temiz sınırlarla (decoupled) kurgulanması.

## Project Status
- Sistem genelinde `rOndevu` white-labeling, TR/EN çift dil mimarisi ve özel karanlık mod (dark-first) açılış/fiyatlandırma sayfaları tamamlandı.
- SMS doğrulama (Twilio Verify + `verifiedPhoneCache`), GSM 7-bit SMS bildirim hattı ve Platform Webhook -> n8n -> Evolution API WhatsApp entegrasyonu devreye alındı.
- Sıradaki odak: **De-Cal'ification** (gereksiz eklenti/enterprise yüklerinin temizliği), bağımsız UX dönüşümü ve **15 Günlük TTL Outreach Demo Enjeksiyonu** mimarisinin uygulanması.
