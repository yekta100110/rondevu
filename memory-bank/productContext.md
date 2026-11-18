# Product Context — rOndevu

## Why This Project Exists
**rOndevu**, Çatı Marka (Umbrella Brand / Venture Studio) çatısı altında geliştirilen ilk dikey SaaS ürünüdür. Türkiye ve yerel pazardaki hizmet odaklı işletmelerin (klinikler, diş hekimleri, güzellik merkezleri, psikolog/danışmanlık ofisleri, kuaför/berber salonları ve yerel işletmeler) telefon trafiği veya manuel mesajlaşma yüzünden yaşadığı zaman kaybını ve randevuya gelmeme (no-show) sorununu çözmek için tasarlanmıştır.

Yabancı kurumsal takvim yazılımlarının (Calendly, rOndevu Enterprise vb.) e-posta merkezli, karmaşık ve yerel alışkanlıklara uzak yapısının aksine; rOndevu **telefon numarası, SMS doğrulaması ve WhatsApp bildirimlerini** merkeze alır.

## Problems It Solves
- **Telefon ve Mesaj Trafiği Yükü:** İşletmelerin gün içinde "Hangi saat boş?" sorusuna harcadığı mesaiyi, müşterinin saniyeler içinde kendi randevusunu oluşturabileceği canlı bir takvim ekranıyla ortadan kaldırır.
- **Sahte Randevu ve Gelmeme (No-Show) Sorunu:** Telefon numarasıyla randevu alımında zorunlu SMS doğrulama kodu (OTP), geçmiş "Katılmadı" (`historicalNoShowCount`) rozeti ve otomatik SMS/WhatsApp hatırlatmaları ile takvim güvenliğini sağlar.
- **E-posta Zorunluluğu Engeli:** Yerel pazarda e-posta kullanmayan müşteriler için `<digits>@sms.rondevu.org` sentetik e-posta mimarisiyle yalnızca telefon numarası üzerinden uçtan uca randevu alma, doğrulama ve iptal etme imkanı sunar.
- **Yüksek Sürtünmeli Satış Süreci:** Soğuk erişim (cold outreach) yapılan işletmelere boş bir tanıtım sayfası göndermek yerine, işletmenin kendi adı ve hizmetleriyle önceden hazırlanmış canlı bir **Outreach Demo** profili sunarak anında deneyimleme ve tek adımda devralma sağlar.

## Core Product Flows

### 1. İşletme ve Danışan Randevu Akışı
1. İşletme çalışma saatlerini, Türkiye resmi/dini tatil izinlerini (`Ofis Dışında`) ve hizmet türlerini tanımlar.
2. Kendi özel bağlantısını (`rondevu.org/isletme` veya özel alan adı) Instagram/WhatsApp profilinde paylaşır.
3. Müşteri/danışan uygun günü ve saati seçer; telefon numarası (veya e-posta) ile SMS doğrulama kodunu girerek randevusunu onaylar.
4. Hem işletmeye hem müşteriye **WhatsApp (Evolution API + n8n)** ve **SMS (Twilio / Netgsm)** üzerinden onay ve randevu öncesi otomatik hatırlatma mesajları iletilir (alıcı WhatsApp açık rızası ve `STOP`/`DUR`/`İPTAL` opt-out kontrolüyle).
5. Google Calendar ve Apple Calendar senkronizasyonu ile saat çakışmaları sıfırlanır.

### 2. Outreach Demo Enjeksiyonu ve Sürtünmesiz Devralma (15-Day TTL Claim Flow)
1. **Doğrudan Veritabanı Demo Enjeksiyonu:** Outreach motoru tarafından keşfedilen potansiyel işletmelerin profilleri, çalışma saatleri ve örnek hizmetleri doğrudan `rOndevu` PostgreSQL veritabanına (`users`, `event_types`, `schedules`) `isOutreachDemo: true`, `demoCreatedAt` ve `demoExpiresAt: +15 gün` bilgileriyle tekil (idempotent) olarak işlenir.
2. **Canlı Demo Sunumu:** İşletmeye kendi adına açılmış canlı randevu sayfası iletilir.
3. **Şifremi Unuttum ile Sürtünmesiz Devralma (Claim):** İşletme sahibi kendi e-posta adresiyle tanımlanmış hesabı beğendiğinde **"Şifremi Unuttum"** akışıyla şifresini belirleyerek hesabına erişir; ödeme/abonelik adımını tamamladığında demo bayrağı kaldırılarak hesap kalıcı hale gelir.
4. **15 Günlük Otomatik Temizlik (TTL Cleanup):** Oluşturulma tarihinden 15 gün sonra hâlâ devralınmamış (aktifleşmemiş) demo hesapları ve bağlı kayıtlar otomatik temizlik göreviyle veritabanından silinir.

## User Experience & De-Rondevu'ification Goals
- **Yalın ve Yerel Deneyim:** Kurumsal/yabancı jargonlardan ("Toplantı", "OOO", "Organizations", "Teams") arındırılmış; "Randevu", "İzinlerim", "Katılmadı" gibi doğal Türkçe terminolojiye sahip arayüz.
- **De-Rondevu'ification:** rOndevu'dan miras kalan gereksiz `app-store` eklentilerinin ve kurumsal karmaşanın temizlenerek yalnızca çekirdek randevu, takvim, SMS ve WhatsApp akışlarının öne çıkarılması.
- **Şeffaf İki Planlı Model:** Özellik kısıtlaması veya komisyon olmadan tüm yetenekleri sunan Aylık ve Yıllık plan yapısı (`PlanContactModal` üzerinden doğrudan iletişim ve aktivasyon).
