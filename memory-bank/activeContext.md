# Active Context — rOndevu

- **Ana Sayfa Adım ve Özellik Kartı Hareketleri (2026-10-05):**
  - Özgün Framer exportundaki 2. adımın müsaitlik toggle/saat vurgusu ve 3. adımın görüşme ekranı hareketi yeniden etkinleştirildi.
  - Özellik kartlarında takvim görevleri sırayla vurgulanır; SMS/e-posta kartındaki üç bildirim kademeli görünür. Diğer sabit önizlemeler hafif, farklı gecikmeli yüzer hareket kullanır.
  - Hareket azaltma tercihi tüm bu döngüleri devre dışı bırakır.

- **Hero Hizalama ve Takvim Önizleme Döngüsü (2026-10-05):**
  - Hero’nun desktop üst spacer’ı 96 px’ten 48 px’e çekilerek büyük kartın üstündeki boşluk azaltıldı.
  - Takvim önizlemesi artık yalnızca tarih/süre seçimini değil; dört ayrı randevu profilinin adını, başlığını ve açıklamasını da senkron değiştirir. Türkçe ve İngilizce varyantlar ayrı tanımlanır; azaltılmış hareket tercihinde döngü çalışmaz.

- **Deploy Hazırlığı: Aktif Marketing Kaynakları, CSP ve Güvenli Temizlik (2026-10-05):**
  - `/pricing` route’u, pricing görünümü, ortak marketing bileşenleri, çeviri dosyası ve çalışır Framer fragmentleri Git index’ine alındı; temiz checkout artık aktif marketing render zincirini içerir. Commit veya uzak depoya gönderim yapılmadı.
  - CSP, üretimde varsayılan `non-strict` moduyla açıldı: `/`, `/pricing` ve giriş sayfalarında zorlayıcı başlık; diğer sayfalarda geriye dönük uyum için rapor başlığı kullanılır. Framer görsel/font kaynakları izin listesine eklendi.
  - Aktif import zincirinde bulunmayan eski React marketing deney bileşenleri temizlendi. Yerel referans/export kalıntıları Docker build context’inden hariç tutuldu; etkin Framer dosyaları korunuyor.
  - Production `next build` denemesi, çıktı üretmeden yaklaşık 3.4 GB bellek kullanımında sonlandı; oluşturduğu `.next/lock` kaldırıldı. Bu nedenle production build ve staging smoke doğrulaması henüz başarılı kabul edilmez.

- **SSS Akordiyon ve Yerleşim Düzeltmesi (2026-10-04):**
  - Statik Framer SSS varyantları delegated click akışıyla gerçek bir açık/kapalı state gibi senkronize edildi; cevaplar `max-height` ve `opacity` geçişiyle açılıyor, artı ikonu dönüyor.
  - Türkçe SSS rozeti hydration sonrasında `SSS` olarak ayarlanıyor; “Bilgi Alın” ve “Hemen Başla” eylemleri soru listesinin sonuna taşınıyor.
  - SSS altındaki Framer divider/şekil kalıntısı scoped CSS ile gizlendi. Yerel sunucu başlatılmadı ve uzak depoya gönderim yapılmadı.

- **Pricing Koyu Zemin Patlaması İçin Cerrahi CSS Düzeltmesi (2026-10-04):**
  - `cal-pricing-framer.css` yeniden üretilmeden, yalnızca scoped kurallarla pricing canvası, plan kartları, karşılaştırma tablosu ve footer aynı antrasit yüzey ailesine bağlandı.
  - Framer satır içi beyaz/çok açık yüzeyleri (`.framer-6fxrby`, satır ve hücre `data-framer-name` seçicileri, durum rozeti) koyu yüzey ve yumuşak sınırlarla ezildi.
  - Yerel sunucu başlatılmadı; CSS ayrıştırması ve statik marketing doğrulaması geçti. Commit veya `git push` yapılmadı.

- **Bento Takvim Rozeti ve Fiyatlandırma Kartları Düzeltmeleri Tamamlandı (2026-10-04):**
  - **Bento "CONNECT YOUR CALENDAR" Merkez Rozeti:** Koyu modda beyaz hap zemin üzerinde beyaz yazıldığı için kaybolan "rOndevu" metni, `cal-framer.css` içerisinde `.framer-894vxg` kuralı koyu temaya (`background: #18181b !important; border: 1px solid rgba(255,255,255,0.15) !important; color: #ffffff !important;`) uyarlanarak yüksek kontrastlı hale getirildi. Ayrıca `cal-dom-tr.html` ve `cal-dom-en.html` dosyalarında `<h2>` içerisine marka logosu (`/logos/rondevu-icon.png`) entegre edildi.
  - **Fiyatlandırma Kartları ve CTA Butonları:** Cal.com kalıntısı "Try for free >" ve "Get Started" / "Get Started Yearly" metinleri `pricing-dom-en.html` ve `pricing-dom-tr.html` dosyalarından tamamen kaldırıldı. Tüm butonlar `[data-plan-btn="true"]` özniteliğiyle şık ve tutarlı bir CTA ("Planı Seç" / "Choose Plan") olarak düzenlendi. `pricing-view.tsx` içerisine eklenen reaktif `useEffect` ile dil değişimlerinde dinamik senkronizasyon sağlandı; tıklamalar doğrudan `PlanContactModal` modalını tetikleyecek şekilde korundu.
  - **Yıllık Plan Kartı Sağ Kenar Dikey Çizgisi:** "Yearly Plan" kartının sağ kenarında beliren dikey beyaz taşma çizgisi, `cal-pricing-framer.css` içerisindeki `.framer-6fxrby`, `.framer-o086nb` ve çevre taşıyıcılarına `overflow: hidden !important;`, `--border-color: rgba(255, 255, 255, 0.08) !important;` ve `border-right: none !important;` uygulanarak tamamen ortadan kaldırıldı.
  - **Yerel Sunucu Doğrulaması:** `http://localhost:3000` ve `http://localhost:3000/pricing` HTTP 200 OK ile doğrulanarak çalışır durumda teslim edildi. Sıfır yasaklı kelime kuralı korundu, kesinlikle `git push` yapılmadı.

- **Fiyatlandırma Tablosu Metin Çöküşü (Overlap) ve Footer Hizalama Onarımı Tamamlandı (2026-10-04):**
  - **Sağ Kenara Sıkışan Footer Düzeltildi:** "© 2026 rOndevu. All rights reserved." / "Tüm hakları saklıdır." bloğu `#feature-breakdown` bölümünün ve tablo satır sarmalayıcısının (`framer-5bj5pn`) yatay `flex-flow: row` akışından tamamen çıkarıldı. Sayfa ana akışında (`#main-1`) bağımsız, tam genişlikli (`framer-pricing-footer-container`, `w-full max-w-[1200px] mx-auto text-center`) bir kapsayıcıya taşındı. Logo, telif metni ve sistem durumu rozeti dikey akışta (`flex-direction: column; gap: 16px`) merkezlendi.
  - **Tablo Satırlarındaki Metin Çakışması (Overlap) Giderildi:** Alt satırlardaki ("Buffer time before & after events", "Minimum notice", "Time-slot intervals", "Limit booking frequency", "Limit total booking duration" vb.) başlık ve açıklama metinlerinin üst üste binmesi kökten çözüldü. `cal-pricing-framer.css` içinde uyuşmayan `.framer-3g2Zr` seçicileri `.framer-41gqb` ile eşitlendi; tüm satırların ilk sütununa (`Feature Text Wrapper`) açıkça `display: flex !important; flex-direction: column !important; gap: 6px !important;` tanımlandı.
  - **Koyu Mod Taban Boşluğu ve Şeffaflık:** `#feature-breakdown .framer-5bj5pn` koyu modda `background-color: transparent !important;` yapılarak tablonun altındaki beyaz kavisli alan temizlendi.
  - **Kritik Kurallar:** Sıfır "altyapı" kelimesi korundu, yerel sunucu çalıştırılmadı (`pnpm dev` yapılmadı), `git push` yapılmadı. HTML etiket dengesi (0 açık etiket) ve CSS kuralları doğrulandı.

- **Dış Zemin Renk Bütünlüğü (#141414) ve CTA Banner Cerrahi Onarımı Tamamlandı (2026-10-04):**
  - **Dış Zemin ve Renk Bütünlüğü (#141414):** Sayfanın tüm dış boşluklarında, `globals.css`, `layout.tsx`, `home-view.tsx`, `pricing-view.tsx`, `cal-framer.css`, `cal-pricing-framer.css` ile TR/EN HTML dosyalarındaki (`cal-dom-tr.html`, `cal-dom-en.html`, `pricing-dom-tr.html`, `pricing-dom-en.html`) zifiri siyah (`#000000`) zeminler temizlendi. Tüm taşıyıcı ve dış zeminler tasarımsal bütünlük için koyu antrasit (`#141414`) tonuna kavuşturuldu.
  - **CTA Banner Izgara (Grid) İzolasyonu:** `.framer-12jqh3g` kartı `overflow: hidden !important;`, `border-radius: 24px !important;` ve `isolation: isolate !important;` ile sınırlandırıldı. Dışarıya ve siyah boşluğa kontrolsüzce taşan 2160px genişliğindeki `.framer-1x0adn6` ızgara çizgileri kart içine hapsedildi ve radial gradient maskesi ile sınırlandırıldı. Dış taşıyıcıdaki dikey sınır çizgileri (`--border-left-width: 0px`, `--border-right-width: 0px`) temizlendi.
  - **Pürüzsüz Degrade / Parlama Geçişi:** Kartın arkasındaki radyal parlama (`.framer-3gy7g1-container::before`), köşeli veya sert kesilmeyecek biçimde yumuşak bir degrade (`radial-gradient` + `blur(32px)`) ile `#141414` zeminine erir hale getirildi.
  - **Banner Buton Entegrasyonu:**
    - "Hemen Başla" butonu `target="_blank"` kaldırılarak doğrudan `/pricing` rotasına bağlandı.
    - "Bilgi Alın" butonu `home-view.tsx` içine entegre edilen `PlanContactModal` iletişim modalını açacak şekilde bağlandı.
  - **Kritik Kurallar:** Sıfır "altyapı" kelimesi korundu, yerel sunucu başlatılmadı (`pnpm dev` yapılmadı), `git push` yapılmadı. Biome denetimi 0 hata ile doğrulandı.

- **Ana Sayfa ve Fiyatlandırma Son Rötuşları Tamamlandı (2026-10-04):**
  - Hero alanı tek bir `/pricing` bağlantılı “Hemen Başla” / “Get Started” eylemine indirildi; duyuru rozeti, kart gereksinimi notu ve Google/e-posta seçenekleri kaldırıldı.
  - Kullanıcı görüşü başlığı ile tweet/yorum ızgarası TR ve EN HTML kaynaklarından tamamen çıkarıldı.
  - Ana sayfa takvim, form, bento, entegrasyon ve alt çağrı panellerinin koyu tema yüzeyleri referans tonlarıyla eşleştirildi; bento ve entegrasyon hareketleri hydration durumundan bağımsız CSS animasyonlarına taşındı ve azaltılmış hareket tercihi desteklendi.
  - Fiyat karşılaştırması bireysel randevu kapsamına indirildi. Aylık/Yıllık sütunları okunabilir ölçülere getirildi; mobilde tablo kendi kapsayıcısında yatay kaydırılabilir hale getirildi.
  - Dört plan çağrısı yalnızca `data-plan="monthly|yearly"` sözleşmesini kullanıyor. `PricingView` metin tahmini yapmadan `PlanContactModal` açıyor; iletişim verisi `trpc.viewer.public.getPlanContact` üzerinden alınmaya devam ediyor.
  - Statik içerik denetimi ve değişen kod dosyalarında Biome hata denetimi geçti. Yerel tarayıcı denetimlerinde belge taşması, koyu temada parlayan hedef panel ve React hydration hatası görülmedi; Aylık/Yıllık modalları doğru plan adıyla açıldı.
  - Zorunlu Turbo tip kontrolü Windows'ta `spawn tsc ENOENT` nedeniyle tamamlanamadı. Doğrudan TypeScript denetimi mevcut, değişiklik dışı 42 hatayı raporladı; bu çalışmada değişen sayfa/modül dosyalarında hata üretmedi.
  - Commit veya `git push` yapılmadı; sonuçlar çalışan yerel sunucuda `/` ve `/pricing` adreslerinde hazır.

- **Eksiksiz Çift Dil (TR / EN) Mimarisi ve Çeviri Temizliği Tamamlandı:**
  - **Sözlük ve Zemin Senkronizasyonu:** `home-translations.ts` merkezi sözlüğü üzerinden yönetilen çift dil mimarisi ana sayfa (`/`) ve fiyatlandırma sayfasında (`/pricing`) eksiksiz hale getirildi.
  - **Türkçe Modunda Sıfır İngilizce:** `cal-dom-tr.html` ve `pricing-dom-tr.html` dosyalarındaki tüm yarım kalmış İngilizce açıklamalar (karşılaştırma tablosunun 40+ satır açıklaması, hero randevu seans metinleri, bento kart açıklamaları, mola süreleri, takvim rozetleri, danışan geri bildirimleri ve entegrasyon açıklamaları) akıcı, profesyonel ve doğal Türkçeye çevrildi.
  - **İngilizce Modunda Sıfır Türkçe:** `cal-dom-en.html` ve `pricing-dom-en.html` dosyalarında kalan Türkçe ibareler (`Danışmanlık Seansı` -> `Consultation Session`, `Dr. Ayşe Yılmaz` -> `Dr. Ayse Yilmaz` vb.) profesyonel İngilizceye uyarlandı.
  - **Dinamik Sekme Başlığı (Document Title):** Dil değiştirildiğinde `document.title` anında güncellenir hale getirildi (TR: `rOndevu - Herkes İçin Randevu Sistemi`, EN: `rOndevu - Clear & Simple Appointment Scheduling`; Pricing TR: `Fiyatlandırma - rOndevu`, EN: `Pricing - rOndevu`).
  - **Yasaklı Kelime Kuralı:** Tüm Türkçe metinlerde ve çevirilerde "altyapı" kelimesi sıfır (0) adet olarak teyit edildi. "Randevu sistemi", "platform" ve fonksiyonel ifadeler kullanıldı.
  - **Yerel Sunucu Doğrulaması:** `http://localhost:3000` ve `http://localhost:3000/pricing` HTTP 200 OK ile sorunsuz yanıt veriyor; Biome kod kontrolleri 0 hata ile geçti; kesinlikle `git push` yapılmadı.

- **Kök Seviye Karanlık Mod ve Tipografi Kontrast İyileştirmeleri Tamamlandı:**
  - **Kök Zemin Bütünlüğü:** `cal-framer.css`, `cal-pricing-framer.css` ve `globals.css` seviyesinde `html.dark`, `body`, `#main`, `[data-framer-root]`, `#cal-1to1-root` ve `#cal-pricing-1to1-root` için saf obsidian siyah (`#000000 !important`) zemin kuruldu. Koyu modda sayfa zemininin beyaz veya açık gri kalması sorunu kökten çözüldü.
  - **Metin Kontrastı ve Okunabilirlik:** Framer SSR'ın satır içine enjekte ettiği `--extracted-r6o4lv: rgb(16, 16, 16)` ve `--extracted-a0htzi: rgb(36, 36, 36)` değişkenleri `html.dark` altında `#e4e4e7` (gövde) ve `#ffffff` (başlıklar) olarak ezildi. Başlıklar (`h1`-`h4`), gövde metinleri, takvim günleri ve tablo metinleri yüksek okunabilirlik kontrastına kavuşturuldu.
  - **Fiyatlandırma Kartları ve Karşılaştırma Tablosu:**
    - Fiyatlandırma plan kartları (`.framer-mnipkf`, `.framer-6fxrby`): `#121214 !important` lüks koyu kart yüzeyi ve `rgba(255, 255, 255, 0.08)` zarif 1px kenarlıklar.
    - Fiyat başlıkları (`990 ₺`, `9.900 ₺`): `#ffffff !important` parlak beyaz. İndirim rozeti: `#172554` zemin ve `#38bdf8` açık mavi yazı.
    - Karşılaştırma tablosunun yapışkan başlıkları (`#121214`) ve 40'tan fazla tablo satırı/hücresi (`#0c0c0e !important`) zeminle kontrastlı, göz dostu koyu yüzeylere sabitlendi.
  - **Hero Booking Mockup & Kontroller:** Booking kartı (`#121214`), süre butonları (`#1a1a1d` zemin, seçili buton `#27272a`, beyaz metin), takvim gün ve tarihleri (`#e4e4e7`) kusursuz hale getirildi.
  - **İkincil Butonlar ve Rozetler:** `Secondary - White` ve `Secondary - Gray` butonları koyu modda parlamayan şık koyu degradeye (`#27272a` -> `#18181b`) çekildi; onay tikleri zümrüt yeşili (`#10b981`) ile belirginleştirildi.
  - **FOUC Önleme:** `pricing-dom-tr.html` ve `pricing-dom-en.html` dosyalarına ilk render stil etiketi eklenerek sayfa yüklenirken beyaz parlamalar tamamen önlendi.
  - **Kritik Kurallara Uyum:** Sıfır "altyapı" kelimesi, kesinlikle `git push` yapılmadı, yerel geliştirme sunucusu kontrolü için token harcanmadan kullanıcı doğrulamasına devredildi.

- **Cerrahi Arayüz ve Pricing Yerleşim Düzeltmeleri Tamamlandı:**
  - **Sol Üst Logo Düzenlemesi:** `Navbar.tsx` içindeki ikon görseli (`<img>`) temizlenerek yalnızca net, şık ve orantılı `rOndevu` metin logosu (`font-cal text-2xl font-bold tracking-tight text-emphasis`) bırakıldı.
  - **Ana Sayfa FAQ (SSS) Boşluğu Onarıldı:** `cal-dom-tr.html` ve `cal-dom-en.html` içindeki kapanmamış sözdizim hatası (`<div class="framer-1o2z9n8" data-border="true" <div id="rondevu-pricing-slot">...`) cerrahi olarak düzeltildi; akordiyon bileşeni eksiksiz render edilir hale getirildi.
  - **Ana Sayfa Eski Pricing Bloğu Silindi:** Slogan (`"Daha akıllı, daha sade randevu."`) ve telif (`"© 2026 rOndevu. Tüm hakları saklıdır."`) korunarak, footer altında kalan eski `<CalPricingSection>` bloğu `home-view.tsx` dosyasından tamamen kaldırıldı. `#pricing` tıklamaları `/pricing` sayfasına pürüzsüz yönlendirildi.
  - **Pricing Çift Başlık Hatası Giderildi:** `.framer-xw7bcr` içindeki mükerrer SSR breakpoint başlık varyantları temizlendi; tekil ve net `<h1>` + `<p>` yapısına dönüştürüldü.
  - **Pricing Sayfa Sonu Sonsuz Boşluk Bug'ı (19.589px Yükseklik) Çözüldü:** `cal-pricing-framer.css` dosyasına eksik Framer breakpoint kuralları (`hidden-lanly2`, `hidden-zpr96j`, `hidden-1hydjgn`, `hidden-wcozae` vb.) eklendi. Cihaz varyantlarının üst üste binmesi engellendi, `</body></html>` kalıntıları temizlendi, `#cal-pricing-1to1-root` ve `.framer-41gqb` taban boşlukları normalize edildi.
  - **Karşılaştırma Tablosu & Onay Tikleri:** `svg-templates.html` içine eksik `#svg8830033853` checkmark tanımı eklendi ve `cal-pricing-framer.css` ile zümrüt yeşili (`#10b981`, karanlık modda `#34d399`) renklendirildi.
  - **Ekip Yönetimi Kategorisi Kaldırıldı:** Karşılaştırma tablosundaki "Ekip Yönetimi" / "Teams" başlığı (`.framer-gxw577`) ve altındaki tüm 8 satır tablodan tamamen silindi.
  - **Kritik Kurallara Uyum:** Sıfır "altyapı" kelimesi, kesinlikle `git push` yapılmadı, yerel sunucu görsel doğrulaması için kullanıcıya devredildi.

- **Ortak Navbar Bileşeni, Fiyatlandırma Yönlendirmeleri ve 1:1 Cal.com Pricing Sayfası Entegrasyonu:**
  - **Tek ve Ortak Navbar (`Navbar.tsx`):** Hem ana sayfanın (`/`) hem de `/pricing` sayfasının çağırdığı tekil, ortak React Navbar bileşeni `apps/web/modules/home/components/Navbar.tsx` entegre edildi. Farklı barlar ve portal slot yamaları tamamen ortadan kaldırıldı.
  - **Sade Menü (3 Link):** Sadece "Özellikler", "Fiyatlandırma", "SSS" bağlantıları bırakıldı; "Enterprise", "Developer", "Solutions" gibi menüler tamamen silindi. `/pricing` sayfasındayken "Fiyatlandırma" bağlantısı aktif (active state) olarak vurgulandı.
  - **Dahili Kontroller:**
    - Anında dil geçişi sağlayan `TR / EN` segmented butonları doğrudan barda yer alıyor.
    - Sistem / Karanlık / Aydınlık mod geçiş ikonu (`Laptop / Moon / Sun`) barda yer alıyor ve tercihi anında `localStorage`'a kaydedip uyguluyor.
    - Oturuma duyarlı "Giriş Yap" (`/auth/login`) / "Panele Git" (`/event-types`) butonu barda yer alıyor.
  - **Fiyatlandırma Buton ve Yönlendirme Onarımı:**
    - Ana sayfadaki tüm "Fiyatlandırma", "Paketleri İncele" veya fiyat butonları `/pricing` route'una (veya `#pricing` bölümüne) pürüzsüzce yönlendirildi. İçi boş `onClick` veya ölü buton bırakılmadı.
  - **1:1 Cal.com Pricing Sayfası Zemin Kurulumu:**
    - Eski uydurma/özel fiyatlandırma tasarımı tamamen silindi.
    - `/example/Pricing _ Cal.com.htm` dosyasından Cal.com'un orijinal minified Framer CSS'i `apps/web/public/cal_files/cal-pricing-framer.css` olarak çıkarıldı, karanlık mod tokenları (`#09090b` zemin, `#121214` kart yüzeyi, `#27272a` border) ve 2 kartlı grid düzeni eklendi.
    - `pricing-dom-tr.html` ve `pricing-dom-en.html` dosyaları cerrahi ayıklamalarla 1:1 oluşturuldu:
      1. Paketi sadece 2 plana indirme: "Aylık" (990 ₺/ay) ve "Yıllık" (9.900 ₺/yıl, "2 Ay Hediye" rozeti). "Organizations" ve "Enterprise" paketleri tamamen silindi.
      2. Karşılaştırma tablosu (Feature Matrix): "Organizations" ve "Enterprise" sütunları silindi; tablodan "Accept Payments" (Ödeme Alma) ve "Built-in Video" (Dahili Video) satırları tamamen çıkarıldı. Gerçek rOndevu yetenekleri korundu.
      3. Kart ve tablo butonlarına `data-plan="monthly"` ve `data-plan="yearly"` nitelikleri eklendi; tıklandığında kredi kartı/Stripe yerine admin panelinden dinamik bilgi çeken (`trpc.viewer.public.getPlanContact`) `PlanContactModal` açılması sağlandı.
  - **Yasaklı Kelime Kuralı:** Türkçe çevirilerde ve tüm dosyalarda "altyapı" kelimesi 0 adet olarak doğrulandı.
  - **Kritik Kurallara Uyum:** Yerel dev sunucusu başlatılmadı (`pnpm dev`, `next dev` çalıştırılmadı), `git push` yapılmadı. Biome format ve kontrolü hatasız tamamlandı.

- **Ana Sayfa Cerrahi DOM Temizliği & rOndevu Markalama (DOM Purge):**
  - Cerrahi DOM temizliği: Mevcut sayfa layout'u, CSS gridleri ve Framer Motion taşıyıcı sınıfları 100% korunarak `cal-dom-tr.html` ve `cal-dom-en.html` dosyalarından 650+ KB gereksiz DOM ve sahte içerik silindi.
  - Sahte Sertifikalar (ISO 27001, SOC 2, CCPA, GDPR, HIPAA) tamamen elendi (0 kaldı).
  - Sahte İndirme Butonları (Android, iOS, Chrome, Safari, macOS, Windows, Linux) tamamen silindi (0 kaldı).
  - Sahte İnceleme Rozetleri (Hero Trustpilot, footer G2 ve alt CTA Product Hunt / G2 / Google Reviews şeritleri) tamamen kaldırıldı (0 kaldı).
  - Alakasız footer link sütunları (Telehealth, Law, Hiring, Cal Fonts, Affiliate, vb.) tamamen silindi.
  - Cal misyon metni ("Our mission is to connect a billion people...") kaldırıldı.
  - Footer'da SADECE: rOndevu logosu, sade telif hakkı yazısı ("© 2026 rOndevu. Tüm hakları saklıdır." / "© 2026 rOndevu. All rights reserved.") ve sistem durum rozeti (Status Wrapper) kaldı.
  - Gövdeden sunulmayan özellikler: Accept payments ve Built-in video conferencing kartları silindi; harici Google Meet entegrasyonu korundu.
  - Sponsor ve yatırımcı logo şeritleri (Ticker Dark Logos & "Trusted by fast-growing companies") 3 kırılımda silindi.
  - Navbar Düzenlemesi: Enterprise, Developer, Kaynaklar açılır menüleri kaldırıldı; menüde sadece 3 bağlantı bırakıldı: "Özellikler", "Fiyatlandırma", "SSS".
  - Sağ tarafa "Giriş Yap" butonu ile yanına `#rondevu-theme-lang-slot` yer tutucusu eklendi; harici yüzen `.rondevu-top-controls` kutusu kaldırılarak Dil (TR/EN) ve Tema (Oto/Koyu/Açık) seçicileri React Portal ile navbar içine entegre edildi.
  - Logo ve Markalama: Header ve Footer'da rOndevu SVG logosu ve `rondevu-icon.png` entegre edildi; kod ve metinlerde kalan tüm "Cal" / "Cal.com" ibareleri "rOndevu" yapıldı.
  - Doğrulama: `scripts/verify_dom_purge.js` ile tüm maddeler 100% PASS doğrulandı. Biome kontrolleri hatasız geçti. Yerel sunucu başlatılmadı, git push yapılmadı.

-9. **Authentic Booker Interface, Real Phone Interface Showcase & Razor-Sharp Typography** —
   - **Real Phone Showcase (`RealInterfaceShowcase.tsx`):**
     - Copied all 26 mobile screenshots (`IMG_5899.PNG` to `IMG_5924.PNG`) to `apps/web/public/interfaces/phone/`.
     - Created a showcase presenting real features discovered in the app's settings screens: *Mola ve tampon süreler* (`IMG_5909`), *Minimum 2 saat öncesinden bildirim süresi*, *Google & Apple Takvim çakışma kalkanı* (`IMG_5911`), *SMS onay zorunluluğu* (`IMG_5915`), *Kişiye özel tek kullanımlık gizli linkler* (`IMG_5916`), and *İptal nedeni zorunluluğu* (`IMG_5914`).
     - Described every feature in natural, plain, everyday Turkish without complex jargon or AI slop.
   - **Authentic Booking Flow Restored (`HeroPrecisionConsole.tsx`):**
     - Completely eliminated custom/generic templates in favor of a 100% faithful interactive implementation of Cal/rOndevu Booker screens (`IMG_5903`, `IMG_5904`, `IMG_5920`, `IMG_5921`, `IMG_5923`).
     - Step 1: Calendar view (Ekim 2026, month arrows, day columns, available days as dark rounded tiles, selected day as white tile, Pzt 05 indicator, 12 sa / 24 sa toggle, and time slot pills with green dots: `• 09:00`, `• 09:15`, `• 09:30`...).
     - Step 2: "Bilgilerinizi onaylayın" form (Date badge `📅 5 Ekim 2026 Pazartesi, 10:00`, duration `🕒 15dakika`, Name, Email, Notes, "+ Misafir ekle", "Geri" and "E-postayı doğrula" button).
     - Step 3: Verification modal (`IMG_5921`) with 6-digit code `[ 4 ][ 8 ][ 2 ][ 9 ][ 1 ][ 0 ]` and toast `✓ E-posta başarıyla gönderildi`.
     - Step 4: Authentic confirmation card (`IMG_5923`) with green check circle, "Randevu planlandı", details table, "Yeniden planla veya İptal et", and 4 calendar buttons (Google, Outlook, Office 365, Apple .ics).
   - **Elimination of Blurry/Pixelated Typography:**
     - Added `subsets: ["latin", "latin-ext"]` to `Inter` font in `apps/web/app/layout.tsx` to ensure all Turkish glyphs (`ş, ğ, ı, İ, ö, ü, ç`) render sharply without system font fallback.
     - Added `interFont.variable` and `calFont.variable` to `html` className attribute, and added `--font-sans` fallback to `--font-cal`.
     - Added `text-rendering: optimizeLegibility`, `-webkit-font-smoothing: antialiased`, and `-moz-osx-font-smoothing: grayscale` to `html, body, input, textarea, select, button` in `apps/web/styles/globals.css`.
     - Removed heavy `backdrop-filter` and subpixel `transform: translateY(...)` on text containers that caused Chromium layer compositing blur.
   - **Anti-AI Slop & Plain Turkish:**
     - Cleaned Hero headlines and descriptions into simple, direct, everyday Turkish: *"Randevularınızı zahmetsizce yönetin."*
   - **Local Verification:**
     - Verified HTTP 200 on `http://localhost:3000`.
     - Biome formatting and linting executed cleanly.
     - Zero token-wasting browser recording loops executed, per user instruction.
-8. **Radical & Minimalist Principal Design Engineer Homepage Architecture** —
   - **Zero Text Clutter & Pure Typography:** Replaced generic marketing paragraphs and boilerplate copy with sculptural Cal Sans display typography (*"Zamanınıza hükmedin."*) and single-sentence precision subtexts.
   - **Living Precision Console (`HeroPrecisionConsole.tsx`):**
     - Replaced static/mockup concepts with a real-time, interactive dual-perspective console.
     - Booker perspective features live slot pills (`09:30`, `11:00`, `14:30`, `16:00`, `17:15`), instant simulated SMS OTP verification, and direct calendar reservation feedback (`0.4s` velocity).
     - Organizer perspective gives a real-time agenda timeline with conflict shield status and ready-to-join Google Meet room.
   - **Kinetic Bento Instruments (`BentoInstruments.tsx`):**
     - Replaced text-heavy 4 feature cards with 4 interactive living instruments:
       1. Dual Calendar Collision Shield (0ms conflict prevention simulation between Google and Apple Calendar).
       2. Autonomous SMS Lifecycle (GSM 160-char formatted instant, 24h, and 2h timeline).
       3. Personal Brand & Custom Domain Omnibar (`rondevu.org/ayse` transitioning into `doktorayse.com/randevu` with verified SSL lock).
       4. Instant Time-Off / Vacation Mode switch (real-time schedule pause with amber status feedback).
   - **Horological Monetary Cards:** Refined `990 ₺` / `9.900 ₺` luxury monetary typography, independent accordion drawer, and dynamic admin contact integration.
   - **Monolithic Minimal Footer:** Minimal typography, system operational status badge, and legal routes.
   - **Validation & Push Policy:** Tested on localhost with HTTP 200 OK, Vitest unit tests passed (19/19), Biome checks passed (0 errors), browser subagent verified, 0 commits pushed per user instruction.
-7. **Independent Pricing Card Layout, Feature List Simplification & Natural Turkish FAQ Rewrite** —
   - **Independent Pricing Card Expansion (`items-start`):**
     - Decoupled card heights in `apps/web/modules/home/home-view.tsx` by setting `items-start` on the CSS grid container.
     - Expanding "Dahil Olan Özellikler" on the Monthly card preserves the Yearly card at its own compact height without empty stretching.
   - **Feature List Reduction & Dummy Item Elimination:**
     - Reduced `monthlyFeatures` to 6 concrete items: Sınırsız randevu, Google & Apple Takvim eşitleme, SMS & e-posta hatırlatma, SMS müşteri doğrulama, Kendi web adresinizi bağlama, İzin günleri yönetimi.
     - Reduced `yearlyFeatures` to 4 distinct advantages: Aylık plandaki tüm özellikler, 2 ay ücretsiz kullanım, 12 ay sabit fiyat garantisi, Öncelikli destek ve kurulum.
   - **Natural Turkish FAQ Rewrite:**
     - Overhauled all 8 FAQ Q&As in `apps/web/modules/home/components/FaqSection.tsx` into plain, friendly conversational Turkish.
     - Fully removed "anahtar teslim", "güvenli SSL sertifikası", "Out of Office (OOO)", and "entegrasyonu nasıl çalışıyor".
     - Removed redundant top pill `"Merak Edilenler"`.
   - **Verification:**
     - Visual confirmation via browser subagent screenshots (`pricing_cards_final_state_1790980917514.png`, `faq_section_natural_turkish_answers_1790980980542.png`).
     - Biome formatting and linting clean, Vitest passing (19/19).
-6. **Redundant Text & Badge Cleanup, Collapsible Features, and OTP/No-Show Elimination** —
   - **Badge & Pill Removals:**
     - Removed Hero section top pill (`"Modern, Doğrulanmış ve Güvenli Randevu Deneyimi"`).
     - Removed ProcessSteps top pill (`"3 Adımda Kolay Başlangıç"`).
     - Removed Step 02 `"WhatsApp Bio"` & `"Instagram Bio"` badges (retained clean Google & Apple calendar bar).
     - Removed Step 03 subtext (`"SMS & Takvim davetiyesi otomatik iletildi"`), leaving clean confirmation check card.
     - Removed Features section top pill (`"Temel Özellikler"`).
     - Removed Pricing section top pill (`"Şeffaf Fiyatlandırma"`).
     - Removed Monthly card badge (`"Kısıtlama Yok · Taahhütsüz"`) and Yearly badge (`"Kısıtlama Yok · 2 Ay Hediye"`).
   - **Hero Booking Mockup Cleanliness:**
     - Removed all 3 highlight boxes below the mockup card (*Google & Apple Takvim Senkronu*, *İletişim Doğrulama (OTP)*, *Esnek İptal Kuralları*).
   - **Pricing Section & Collapsible Features Accordion:**
     - Removed billing toggle switch buttons (`Aylık Faturalandırma / Yıllık Faturalandırma`) to keep side-by-side cards direct and uncluttered.
     - Replaced huge static feature lists with on-demand collapsible button: `"Dahil Olan Özellikler (11) ˅"` / `"Dahil Olan Özellikler (6) ˅"`, expanding/collapsing smoothly.
   - **Elimination of "OTP" and "No-Show" Terms:**
     - In Card 3: Replaced `"SMS ve OTP tek kullanımlık kod..."` with `"SMS doğrulama koduyla sahte rezervasyonlar engellenir, takviminiz güvenle korunur."`
     - In plan features: Replaced `"Telefon ve e-posta doğrulama (OTP koruması)"` with `"SMS ve e-posta doğrulama koruması"`.
     - In plan features: Replaced `"No-show ('Katılmadı') danışan takibi & koruması"` with `"Randevusuna katılmayan danışan takibi ve koruması"`.
     - In FAQ Q3 & Q4: Removed `(No-Show)` and `(OTP)`.
     - In `page.tsx` metadata: Replaced `"no-show koruması"` with `"randevu güvenliği"`.
-5. **Homepage Simplification, 3-Step Process Flow, 4 Feature Cards & Jargon Cleanup** —
   - **Default Dark Mode (`defaultTheme="dark"`, `enableSystem={false}`):**
     - Updated `apps/web/lib/getThemeProviderProps.ts` and `apps/web/lib/app-providers.tsx` to set `defaultTheme: "dark"` and `enableSystem: false`.
     - Updated fast synchronous theme initialization script in `<head>` (`apps/web/app/layout.tsx`) so new visits default directly to `dark` mode without flash/flicker.
     - Updated `apps/web/lib/__tests__/getThemeProviderProps.test.ts` to match new default dark mode configuration (19/19 tests passing).
   - **Single UI Focal Point & Removal of Admin Mockups:**
     - Completely removed all complex dashboard/admin mockups, management tables, and internal screenshots.
     - Kept the end-user **"Randevu Alma Akışı"** (`HeroBookingMockup.tsx`) as the single visual UI focal point on the entire landing page.
     - Updated Step 3 header to `"Randevu planlandı"`.
   - **New Section: 3-Step Process Flow (`ProcessSteps.tsx`):**
     - Added horizontal 3-step process flow right below the Hero section (`#how-it-works`):
       - **Adım 01:** "Randevu Sayfanı Oluştur" (`rondevu.org/adiniz` interactive copy pill).
       - **Adım 02:** "Takvimini Bağla & Linkini Paylaş" (Google & Apple Takvim indicator + WhatsApp & Instagram Bio badges).
       - **Adım 03:** "Takvimin Dolsun" (Booking confirmation & notification alert badge).
     - Linked "Nasıl Çalışır?" in both header navbar and footer menu.
   - **"Tüm Gelişmiş Özellikler Standart" (Reduced to Exactly 4 Cards):**
     - 1. **Google & Apple Takvim Eşitleme:** Çift yönlü anlık senkronizasyon, sıfır saat çakışması.
     - 2. **SMS, E-posta & WhatsApp Hatırlatma:** Müşteriye otomatik hatırlatma, unutulan randevulara son.
     - 3. **Müşteri Doğrulama & Sahte Randevu Koruması:** SMS/OTP doğrulamasıyla sahte rezervasyonları engelleme.
     - 4. **Kendi Özel Alan Adınız:** Kendi markanız ve alan adınız altında kesintisiz randevu alma.
     - All card descriptions restricted to 1-2 concise sentences.
   - **"Altyapı" and Jargon Elimination:**
     - Replaced all occurrences of "Altyapı" with "Sistem", "Platform" or functional terms across `page.tsx`, `tos/page.tsx`, `tos-view.tsx`, `privacy-view.tsx`, `sms-view.tsx`, and `common.json`.
     - Cleaned translation/technical jargon like "yapay plan kısıtlamaları" and "gelişmiş rezervasyon altyapı motoru" into clear everyday Turkish.
     - Condensed all 8 FAQ answers in `FaqSection.tsx` to 1-2 short sentences.
   - **Dynamic Admin Contact & Local Verification:**
     - Preserved dynamic admin contact configuration (`trpc.viewer.public.getPlanContact` + fallback).
     - Verified dev server running at `http://localhost:3000` with 200 OK.
     - Browser subagent verified dark mode, booking mockup transitions, copy interaction, feature cards, and accordion toggling.
     - Strict rule respected: 0 commits pushed to remote repository.
-3. **Fix: October Availability Outage & External Calendar Failure Handling** —
   - **Root Cause Identified:** User 1 had an active Google Calendar integration (`SelectedCalendar` id 1, `Credential` id 2 for `rondevu.org@gmail.com`) whose OAuth refresh token was revoked (`invalid_grant`).
   - In `packages/app-store/_utils/oauth/OAuthManager.ts`, failed refresh generates `{ myFetchError: "invalid_grant" }`.
   - In `packages/app-store/googlecalendar/lib/CalendarAuth.ts`, `isTokenObjectUnusable` checked only `responseBody.error === "invalid_grant"`, failing to inspect `responseBody.myFetchError`. Consequently, the dead credential was never invalidated in the DB.
   - When fetching slots, `getBusyCalendarTimes` returned an error placeholder spanning the whole month.
   - In `packages/features/availability/lib/getUserAvailability.ts`, the `getBusyTimes` catch block threw away all user availability date ranges (`dateRanges: []`), completely shutting down booking across all future months.
   - **Fix 1 (`CalendarAuth.ts`):** Added inspection of `myFetchError` alongside `error` for `"invalid_grant"` so unusable tokens trigger credential invalidation.
   - **Fix 2 (`getUserAvailability.ts`):** In the `getBusyTimes` catch block, set `busyTimes = []` instead of returning `dateRanges: []`, preserving the organizer's working hours if an external calendar fails. Explicitly typed `busyTimes`.
   - **Fix 3 (`slots/util.ts`):** Set default `_silentCalendarFailures: true` in public slot retrieval so transient external calendar outages do not block visitors from booking.
   - **Validation:** All 29 unit tests in `packages/app-store/googlecalendar` passed, 15 tests in `packages/features/busyTimes` passed, `apps/web/modules/bookings/components/Booker.test.tsx` passed, tRPC server type check passed with exit 0, and Biome check passed.
-2. **Historical No-Show Counter Badge in Bookings View** —
   - **Backend Batch Calculation:** Created `packages/features/bookings/lib/enrichHistoricalNoShow.ts` to batch query past no-shows (`Attendee.noShow === true`) under the organizer (`userId`) matching contact credentials (email, phone, synthetic SMS email `<digits>@sms.rondevu.org`, and canonical 10-digit Turkish phone formats). Prevents N+1 queries.
   - **tRPC Integration:** Updated `packages/trpc/server/routers/viewer/bookings/get.handler.ts` to enrich booking attendees with `historicalNoShowCount: number`.
   - **Frontend Badges:** Updated `apps/web/components/booking/BookingListItem.tsx` and `apps/web/modules/bookings/components/BookingDetailsSheet.tsx` to render the red `<Badge variant="red" size="sm" startIcon="eye-off">` next to attendee names displaying `"Katılmadı"` (if 1 prior no-show) or `"Katılmadı (${count})"` (if >1 prior no-shows).
   - **Translations:** Added `no_show_badge` and `no_show_badge_with_count` to both `tr/common.json` and `en/common.json`.
-1. **Runtime Fix in CancelBooking.tsx** — Restored `cancellationNoShowFeeNotAcknowledged` declaration in `apps/web/components/booking/CancelBooking.tsx`. Resolved runtime crash when rendering cancellation views (`/booking/[uid]?cancel=true`).
0. **UI Polishing, Tatil Günleri View, Landing Page Copy & Terminology Standardization** —
   - **Out of Office Top Navigation:** Increased tab spacing and gap (`gap-4 sm:gap-6`, `whitespace-nowrap`), removed awkward overflow dot indicator from "Ofis Dışında (İzin & Acil Durum)" button, and prevented label wrapping.
   - **Segmented Control Spacing & Padding:** Fixed container padding to `p-1 rounded-xl` and active pill padding to `px-3 py-1.5 rounded-lg` in both `ToggleGroup.tsx` and `AdminFeatureCards.tsx` to completely eliminate background clipping and wrapper overflow.
   - **"Tatil Günleri" Tab View:** Implemented interactive Turkish public & religious holiday calendar matching `Screenshot 2026-09-27 at 02-24-03 Ofis Dışında Tatil Rondevu.png` with Turkey selector (`🇹🇷 Turkey ˅`), 16 holidays with 📅 and 🌙 icons, dates, and interactive switch toggles. Automatically disables "+ Ekle" button when on the holidays tab.
   - **Landing Page Feature (Smart Calendar Protection):** Added "Akıllı Takvim Koruması (Çakışma Önleme)" highlight card to Block 1 and added "Akıllı Takvim Koruması (Hizmetler arası otomatik çakışma engelleme)" to `monthlyFeatures` in `apps/web/modules/home/home-view.tsx`.
   - **Terminology Standardization:** Updated 64 attendee-facing translation keys in `packages/i18n/locales/tr/common.json` replacing corporate "Toplantı" with "Randevu" and "Rezervasyon" (e.g. `your_meeting_has_been_booked`, `booking_fail`, `reschedule_fail`, `meeting_is_scheduled`, etc.).
1. **Logo Dark Mode Inversion Fix** — Assigned `LOGO = "/rondevu-logo-dark.svg"` (`#292929`) so Tailwind's `dark:invert` properly produces white text in dark mode on mobile and desktop.
2. **Logo Size & Clarity Enhancement** — Vectorized the "rOndevu" wordmark into exact SVG paths with tight bounding viewBox (`0.5 7.3 91.7 18.6`), eliminating 50%+ wasted vertical space. Increased default `Logo.tsx` sizing from `h-4/h-5` to `h-5/h-6 sm:h-7` so rendered text is ~3x larger and razor sharp.
3. **Login View Title Fix** — Replaced hardcoded `Cal.diy` in `apps/web/modules/auth/login-view.tsx` with `{APP_NAME}` (`rOndevu`).
4. **Additional Branding Cleanup** — Updated `refer/page.tsx`, `service-worker.js`, `verify-email-view.tsx`, `Embed.tsx`, and `oauth-provider.e2e.ts`.
5. **Favicon & Icon Exact Geometric Centering** — Recalculated bounding boxes for the "rOn" glyphs across all favicons, app icons (`android-chrome`, `apple-touch-icon`, `mstile`, `favicon-16/32/ico`, and SVG icons). Fixed the ~63.6px vertical baseline gap offset by translating the text path so that top margin equals bottom margin and left margin equals right margin with dead-center alignment.
6. **Default Language Set to Turkish (`tr`) & Translation Enhancement** —
   - Configured `i18n.json` (`source: "tr"`) and `packages/i18n/next-i18next.config.js` (`defaultLocale: "tr"`, fallback: `["tr", "en"]`).
   - Updated `getLocale.ts`, `getLocaleFromRequest.ts`, and `apps/web/app/layout.tsx` so all visitors and new users automatically start in Turkish by default, while preserving explicit cookie or token preferences.
   - Updated `UserRepository.ts` so newly created users have `locale: "tr"` in Postgres and their default schedule is created in Turkish ("Çalışma saatleri").
   - Updated `schema.prisma` default attendee locale to `"tr"`.
   - Added all 41 missing keys to `packages/i18n/locales/tr/common.json` (0 missing keys remaining out of 4,731).
   - Cleaned up 50+ legacy `Cal.diy` / `Cal.com` references in Turkish translations to `rOndevu`.
   - Refined home page, event-types dashboard, login, and navigation translations.
7. **Git Pushed** — Pushed clean commits to `origin/main`.
8. **Onboarding Plan Update** —
   - Replaced `$15/kullanıcı/ay` ($15/user/mo) with "Geliştirme aşamasında" ("Under development") in `tr/common.json` and `en/common.json`.
   - Disabled the "Ekibimle birlikte" (Team) plan in `apps/web/modules/onboarding/getting-started/onboarding-view.tsx` with `disabled: true`, styled as unselectable, reset store fallback, and prevented submission.
9. **Homepage & Pricing Section Added** —
   - Replaced `/` automatic redirect to `/auth/login` in `apps/web/app/page.tsx` with a dedicated minimal, modern `HomeView` (`apps/web/modules/home/home-view.tsx`).
   - Integrated top navigation with rOndevu logo and "Giriş Yap" button linked to `/auth/login` (or "Panele Git" if session exists).
   - Designed a minimal pricing section adhering to rOndevu design aesthetics:
     - Monthly: 1.000 ₺ / ay
     - Yearly: 10.000 ₺ / yıl (with 12.000 ₺ struck through, highlighting 2 months free and 2.000 ₺ savings).
   - Added `BackgroundGrid` consistent with the login view, feature highlights, and minimal footer.
   - Fixed login flow default redirect from `/` to `/event-types` so logged-in users go straight to their dashboard.
10. **Build Error Fix (`module-not-found`)** —
    - Resolved Next.js production build failure in Docker (`yarn --cwd apps/web workspace @calcom/web run build`).
    - Cause: `apps/web/modules/home/home-view.tsx` had an invalid deep import `@calcom/ui/components/logo/Logo`.
    - Fix: Changed import to `@calcom/ui/components/logo` to conform to `packages/ui/package.json` exports map.
11. **System Theme Persistence & Initial Dark Mode Support** —
    - Added synchronous blocking script in `apps/web/app/layout.tsx` to detect system prefers-color-scheme immediately before paint and apply `.dark`.
    - Configured `defaultTheme: "system"` in `getThemeProviderProps.ts`.
    - Moved homepage to `apps/web/app/(use-page-wrapper)/page.tsx` so `CalcomThemeProvider` wraps it.
12. **Homepage Simplification & Pricing Update** —
    - Updated pricing cards to 990 ₺/month and 9.900 ₺/year (11.880 ₺ struck through, 1.980 ₺ savings).
    - Reduced verbose lists to 3-4 clean, impactful bullets per plan.
    - Linked plan buttons to `/plan-bilgi?plan=monthly` and `/plan-bilgi?plan=yearly`.
13. **Framer-Motion Login Card Animation** —
    - Implemented smooth stagger entrance animation for card container and inputs in `apps/web/modules/auth/login-view.tsx`.
14. **Minimalist Plan Information & Contact Page (`/plan-bilgi`)** —
    - Created `apps/web/app/(use-page-wrapper)/plan-bilgi/page.tsx` and `plan-bilgi-view.tsx` with contact phone `0552 119 19 87` and email `y_ekta@icloud.com`.
15. **"Randevu" Terminology Update** —
    - Replaced 22 "toplantı/etkinlik planlandı" translation strings in `packages/i18n/locales/tr/common.json` with "Randevu".
16. **Email Turkish Default & Dark Mode Overhaul** —
    - Changed fallback locales in `buildCalEventFromBooking.ts`, `BookingEmailSmsHandler.ts`, `CalendarEventBuilder.ts`, `passwordResetRequest.ts`, `confirm.handler.ts` to `"tr"`.
    - Redesigned `BaseEmailHtml.tsx`, `V2BaseEmailHtml.tsx`, `EmailHead.tsx`, `Info.tsx`, `WhenInfo.tsx`, `WhoInfo.tsx`, `LocationInfo.tsx`, `ManageLink.tsx`, `CallToAction.tsx`, and `EmailBodyLogo.tsx` with dark theme (`#121214` outer background, `#1c1c1f` cards, `#2e2e34` borders, `#ffffff`/`#f4f4f5` text, `#a1a1aa` subtitles, white SVG logo).
17. **SMS Altyapısı & Admin Kontrol Menüsü (`/settings/admin/sms`)** —
    - Created `packages/sms/sms-transport.ts` supporting Twilio, Netgsm, Webhooks, and Simulation fallback.
    - Integrated dispatch into `packages/sms/sms-manager.ts`.
    - Added `getSMSConfig` and `sendTestSMS` tRPC endpoints in `viewer/admin`.
    - Built comprehensive SMS Control Menu in `apps/web/modules/settings/admin/sms-view.tsx` and route `/settings/admin/sms`.
    - Added "SMS Yönetimi" link to admin settings sidebar.
18. **Homepage Revamp & 12 Core Features Architecture** —
    - Replaced generic landing content with explicit title: *"Herkes için randevu altyapısı"*.
    - Built interactive `HeroBookingMockup` component directly simulating the booking flow (Tarih & Saat Seçimi ➔ Telefon/E-posta Doğrulama [OTP] ➔ Başarı Kartı & Google Meet) using 100% dummy data (`Dr. Zeynep Kaya`, `ahmet.yilmaz@ornek.com`), completely hiding real screenshot info.
    - Built `AdminFeatureCards` structuring the 12 core features into 4 operational blocks (Zaman & Müsaitlik Hakimiyeti, Güvenlik & No-Show Koruması, İletişim & Otomasyon, Özel Alan Adı & Birebir Destek) with dark-mode admin UI mockups.
    - Built `FaqSection` accordion directly answering 8 critical practical questions.
19. **Cal.diy Rebranding & Domain Normalization (`rondevu.org`)** —
    - System-wide replacement of all `rondevu.com.tr` references with official domain `rondevu.org`.
    - Cal.diy publisher replaced with rOndevu across all 98 app-store apps and license headers.
20. **Calendar Sync Clarification & Ofis Dışında Real UI Reproduction** —
    - Fixed SSS & Homepage calendar sync explanations: Appointments booked on rOndevu are automatically exported to Google/Apple calendar; external personal calendar events do NOT block rOndevu availability slots.
    - Revamped "Ofis Dışında" module in `AdminFeatureCards` to authentically reproduce user screenshots (`interface/`): includes list view, search & filters, dummy values (`Kongre Katılımı & Yıllık İzin`) replacing test text, interactive Danışan Rezervasyon Görünümü (date 25 with 🤕), and "Ofis Dışında Ol" modal overlay.
    - Eliminated raw "OOO" acronym throughout Turkish (`İzinlerim`, `Ofis Dışı`, `Ekip İzinleri`) and English locales.
    - Fixed "Tatil günleri" tab crash: `GoogleCalendarClient` no longer throws when `GOOGLE_CALENDAR_API_KEY` is missing and provides built-in offline Turkish public holidays fallback.
21. **Configurable Plan Contact Info & Admin Security Control** —
    - Created `packages/lib/planContactConfig.ts` with database storage (`Deployment.theme.planContact`) and file backup.
    - Created `publicViewer.getPlanContact` query and `viewer.admin.updatePlanContact` mutation guarded by `authedAdminProcedure` with strict Zod validation.
    - Built Admin Management page `/settings/admin/plan-contact` (`plan-contact-view.tsx`) with sanitized link generation (`tel:`, `wa.me`, `mailto:`) preventing XSS/injection.
    - Made `/plan-bilgi` contact details dynamic with real-time backend synchronization.
22. **Production Deployment Readiness & Security Audit Verification** —
    - Audited all modified and added files for secrets, tokens, API keys, and credential leakage: 0 leaked secrets found.
    - Verified strict role-based access control (`authedAdminProcedure`) for admin operations and read-only schema for public contact query.
    - Sanitized all dynamic links (`tel:`, `https://wa.me/`, `mailto:`) with `encodeURIComponent` and digit-only sanitizers to prevent XSS / malicious URL protocol injections.
    - Added `interface/` screenshot files and runtime backup `plan-contact-config.json` to `.gitignore`.
    - Biome lint and formatting checks passed with 0 errors.
    - tRPC server and client type checks verified (`build:server` and `build:react` compile with 0 errors).
23. **User Feedback Implementation (Homepage Polish, Exact Mockup Fidelity, SMS Infrastructure Fixes)** —
    - **Admin Plan İletişim Bilgileri Homepage Sync**: Dynamically synchronized homepage (`/`) with `/settings/admin/plan-contact` via `trpc.publicViewer.getPlanContact`. Added live phone, WhatsApp, and email buttons in Block 4 of `AdminFeatureCards` and in a dedicated consultation bar right below the pricing cards on `home-view.tsx`, plus dynamic contact email in the footer.
    - **Hero Step 3 Exact Screenshot Fidelity**: Restored Step 3 confirmation card in `HeroBookingMockup.tsx` to match `Screenshot 2026-09-25 at 16-57-09` with top navigation `< Rezervasyonlara dön`, `Host` badge, and 4 authentic square calendar buttons (Google `G`, Microsoft Outlook, Microsoft 365, Apple Calendar `.ics`).
    - **Monochrome Design Aesthetic Restored**: Toned down loud accent colors across homepage components (`HeroBookingMockup`, `AdminFeatureCards` Blocks 1-4, `home-view`, and `FaqSection`), adopting Cal/rOndevu's minimalist monochromatic tokens (`bg-default`, `border-subtle`, `bg-muted/20`, `text-emphasis`, `text-subtle`).
    - **Block 2 Layout & Spacing Overhaul**: Expanded container padding to `p-6 sm:p-8 space-y-6`, created a wide, comfortable segmented switcher control for "Randevular & No-Show" vs "Ofis Dışında", and cleanly decoupled the client preview ("Danışan randevu ekranı önizlemesi") into its own spacious, distinct card with clear border divider.
    - **Phone OTP Verification & Cancellation SMS Fix**:
      - Implemented SMS OTP dispatch in `sendEmailVerificationByCode` when `isSmsCalEmail(email)` is detected.
      - Updated `useBookingForm.ts` to construct phone-email fallback so phone-only bookings trigger the Booker verification dialog.
      - Updated `VerifyCodeDialog.tsx` to show "Telefon Numaranızı Doğrulayın".
      - Fixed `handleCancelBooking.ts` and `event-cancelled-sms.ts` so organizers cancelling bookings triggers Turkish cancellation SMS to attendee phone numbers.
    - **FAQ Calendar Answer Simplified**: Updated Question 5 in `FaqSection.tsx` to concisely state that bookings are automatically exported to Google Takvim and Apple Calendar.
24. **Docker Deploy Build Fix (`TS2307: Cannot find module '@calcom/sms/sms-manager'`)** —
    - Resolved Docker build step `RUN yarn workspace @calcom/trpc run build` failure.
    - Cause: `packages/features/auth/lib/verifyEmail.ts` was importing `@calcom/sms/sms-manager`, which was not a mapped workspace package in the yarn monorepo.
    - Fix: Updated line 117 to `await import("@calcom/lib/smsTransport")` where `sendSMS` is exported from the official `@calcom/lib` package.
    - Verified: `yarn workspace @calcom/trpc run build` completed successfully (exit code 0).
25. **SMS Verification & Notification Infrastructure Overhaul** —
    - Fixed phone-constructed email normalization in `packages/lib/contructEmailFromPhoneNumber.ts` to strictly strip non-digits (`\D/g`), eliminating space-induced format exceptions (`90 552 ...` -> `905521191987@sms.rondevu.org`).
    - Fixed phone number normalization in `packages/lib/smsTransport.ts` for Twilio and Netgsm, eliminating spaces in `normalizePhoneNumber`.
    - Fixed `sendEmailVerificationByCode` in `packages/features/auth/lib/verifyEmail.ts`: checks `isSmsCalEmail(email)` first to bypass email watchlist checks, generates TOTP, sends SMS OTP, and triggers verify modal without crashing.
    - Fixed `RegularBookingService.ts`: validates verification code against `effectiveBookerEmail` (`bookerEmail || contructEmailFromPhoneNumber(bookerPhoneNumber)`), prevents crash on empty booker email, and saves attendee email/phone properly in database.
    - Fixed `getBookingData.ts` to support both `responses.attendeePhoneNumber` and `responses.phone`.
    - Fixed `email-manager.ts`: filters out `@sms.rondevu.org` pseudo-emails from SMTP queues, decouples SMS dispatch via `Promise.allSettled` and isolated try/catch so SMTP errors never block SMS notifications.
    - Fixed `event-scheduled-sms.ts` and `event-rescheduled-sms.ts` with crash-proof Turkish default messages and multi-locale fallback.
    - Created `packages/sms/package.json` declaring `@calcom/sms` as a monorepo workspace package.
    - Updated `BookEventForm.tsx` to display "Telefonu Doğrula" when verifying phone number.
    - Updated `EventAdvancedTab.tsx` so `requiresBookerEmailVerification` toggle title/description dynamically changes to "Telefon (SMS) Doğrulaması" when "Phone" confirmation is active.
    - All 8 SMSManager unit tests passed and lifecycle notifications verified.
26. **Plan Contact Information Sync & Admin Management Overhaul** —
    - Fixed tRPC path mismatch: updated client queries from non-existent `trpc.publicViewer` to `trpc.viewer.public.getPlanContact`.
    - Added global React Query cache invalidation in `plan-contact-view.tsx` on mutation success: invalidates both `utils.viewer.admin.getPlanContact` and `utils.viewer.public.getPlanContact` so any active view or route transition immediately accesses the fresh contact info.
    - Updated TanStack Query mutation loading property in `plan-contact-view.tsx` to `updateMutation.isPending`.
    - Added "Varsayılana Sıfırla" (Reset to Defaults) one-click button in admin view with confirmation dialog.
    - Integrated Server-Side Rendering (SSR) in `apps/web/app/(use-page-wrapper)/page.tsx` and `plan-bilgi/page.tsx`: pre-fetches `getPlanContactConfig()` and passes `initialContact` to `HomeView` and `PlanBilgiView` to eliminate initial default flash and seed React Query's `initialData`.
    - Synchronized `AdminFeatureCards.tsx` with `HomeView`: passes `contactConfig` prop down so all contact touchpoints on `/` (Consultation Bar, Feature Card 4, and Footer) are 100% unified.
    - Added Next.js route revalidation in `updatePlanContact.handler.ts` (`revalidatePath("/")`, `revalidatePath("/plan-bilgi")`).
    - Overhauled `packages/lib/planContactConfig.ts` with named Prisma client import (`import { prisma } from "@calcom/prisma"`), multi-path directory resolution for JSON backups (`apps/web`, root, cwd), resilient `Deployment.theme` parsing, and non-blocking database fallback.
    - Verified all 5 test scenarios in `test_plan_contact_sync.ts` and confirmed zero TypeScript errors on changed files.
27. **Homepage Terminology, "Tek Fiyata Premium Erişim" & Mobile Booking Flow Overhaul** —
    - **Hero Title Alignment**: Updated the main headline on `/` (`home-view.tsx`) from *"Herkes için randevu altyapısı"* to *"Herkes için randevu sistemi"*, and aligned `site.webmanifest`.
    - **"Tek Fiyata Premium Erişim" Vurgusu**:
      - Added a prominent badge and header above the 12 features in `home-view.tsx` clarifying that all advanced features are available without tiered plan locks or artificial barriers.
      - Overhauled the pricing section header, badges, and card copies on `home-view.tsx` and `plan-bilgi-view.tsx`: emphasizes that there are no different tiered packages or access restrictions, both monthly (990 ₺) and yearly (9.900 ₺) options include 100% of all features without limits.
      - Updated FAQ Question 8 in `FaqSection.tsx` to explicitly explain that single-price premium access is standard and zero commissions or hidden fees exist.
    - **Mobile Booking Flow Responsive Overhaul (`HeroBookingMockup.tsx`)**:
      - Resolved `doktorzeynep.com` URL slipping down: restructured browser top bar into a 2-tier responsive layout with a dedicated truncated URL pill and mac traffic dots that never break or wrap onto multiple lines.
      - Transformed step switcher on mobile into a clean 3-column equal grid with concise responsive labels (`1. Tarih`, `2. Form`, `3. Onay`) that fit all screen widths (down to 320px) without overflow.
      - Resolved cramped layout in Step 1: added dividers on mobile between service details and calendar, converted calendar days into uniform `h-8 sm:h-9` square touch targets, and placed available time slots side-by-side in a 3-column row on mobile (`grid grid-cols-3 gap-2 lg:grid-cols-1`) so users do not have to endlessly scroll.
      - Refined Step 2 and Step 3 on mobile with comfortable input padding, responsive summary table layout, and wrapping calendar icons.
28. **Phone Verification Gate & Provider-Agnostic SMS Lifecycle Overhaul** —
    - **Twilio Architecture & Dokploy Compatibility**:
      - Separated OTP phone verification (Twilio Verify v2 API with `TWILIO_VERIFY_SID`) from transactional notifications (Twilio Programmable Messaging API with `TWILIO_MESSAGING_SID` / `TWILIO_PHONE_NUMBER`).
      - Supported both `TWILIO_SID || TWILIO_ACCOUNT_SID` and `TWILIO_TOKEN || TWILIO_AUTH_TOKEN` in `smsTransport.ts` and `phoneVerification.ts` for direct compatibility with Dokploy env vars.
    - **Provider-Agnostic SMS Layer**:
      - Built `packages/lib/sms/types.ts` defining `ISmsProvider`, `SMSPayload`, and `SMSResponse`.
      - Refactored `packages/lib/smsTransport.ts` into a decoupled adapter pattern (`TwilioSmsProvider`, `NetgsmSmsProvider`, `WebhookSmsProvider`, `SimulationSmsProvider`) with factory instantiation.
    - **Mandatory Phone Verification Gate**:
      - Fixed `FormBuilder.tsx` to automatically set `requiresBookerEmailVerification: true` when switching confirmation to `"phone"`.
      - Locked the verification toggle to checked in `EventAdvancedTab.tsx` when `isPhoneConfirmation` is active.
      - Fixed `useVerifyEmail.ts` so `renderConfirmNotVerifyEmailButtonCond` does not bypass OTP for phone bookings until validated.
      - Fixed `RegularBookingService.ts`: backend strictly enforces that `verificationCode` is provided and validated when `eventType.requiresBookerEmailVerification || isPhoneOnlyEvent || isPhoneBooking`.
      - Integrated Twilio Verify API in `phoneVerification.ts` (`/Verifications` and `/VerificationCheck`) with TOTP fallback.
    - **Complete End-to-End SMS Lifecycle**:
      - Removed artificial constraint in `sms-manager.ts` (`isSmsCalEmail(attendee.email)`): transactional SMS (confirmation, rescheduling, cancellation) is now delivered to any attendee with a valid phone number.
      - Implemented `EventReminderSMS` (`packages/sms/attendee/event-reminder-sms.ts`).
      - Implemented Tasker `sendSms` handler in `packages/features/tasker/tasks/sendSms.ts` and registered it in `tasks/index.ts`.
      - Created `scheduleReminderSmsTrigger.ts` in booking creation pipeline to enqueue reminders 24h or 2h prior to booking start time.
      - Added cancellation cleanup in `handleCancelBooking.ts` via `tasker.cancelWithReference(booking.uid, "sendSms")`.
      - Updated SMS unit tests in `packages/sms/test/sms-manager.test.ts` (all 8 tests passing).
29. **Docker Deploy Build Fix (`@calcom/trpc` TS2353 & TS2339)** —
    - Added `smsReminderNumber?: string | null;` to the `CalendarEvent` interface in `packages/types/Calendar.d.ts`.
    - Added `"@calcom/sms": "workspace:*"` to `dependencies` in `packages/features/package.json` and updated `yarn.lock`.
    - Verified locally with `yarn workspace @calcom/trpc run build` (both `build:server` and `build:react` compile cleanly with exit code 0).
    - Verified with `yarn vitest run packages/sms/test/sms-manager.test.ts` (all 8 tests pass) and Biome check (0 errors).
30. **Frontend Phone OTP Gate Fix, Legal Pages (/privacy & /tos) and Dynamic SEO Sitemap** —
    - **Phone OTP Verification Gate Interception**:
      - Created `packages/lib/isPhoneConfirmationEvent.ts` to identify when an event has phone confirmation active (`attendeePhoneNumber` required and `email` hidden/optional). Added unit tests in `packages/lib/isPhoneConfirmationEvent.test.ts` (all 5 passed).
      - In `useInitialFormValues.ts`: Prevented session email from prefilling `responses.email` when `isPhoneConfirmationEvent` is true.
      - In `useBookingForm.ts`: Prioritized `contructEmailFromPhoneNumber(effectivePhone)` when phone confirmation is active and returned `isPhoneConfirmation`.
      - In `useVerifyEmail.ts`: Strictly set `renderConfirmNotVerifyEmailButtonCond` to `isVerified` (`Boolean(email && verifiedEmail && verifiedEmail === email)`) for phone events, ensuring the button remains in verification mode ("Telefonu Doğrula") and clicking dispatches Twilio Verify OTP without bypassing.
      - In `useVerifyCode.ts`: Passed the submitted `code` into `onSuccess(data, code)`.
      - In `BookerWebWrapper.tsx`: Recorded `verificationCode` into `BookerStore` on verification success, enabling `handleBookEvent()` to include it in the booking payload.
      - In `booking-to-mutation-input-mapper.tsx`: Ensured `responses.email` is mapped to the synthesized phone email for phone-only events.
    - **Legal Pages (/privacy and /tos)**:
      - Created `apps/web/modules/legal/privacy-view.tsx` and `apps/web/app/(use-page-wrapper)/privacy/page.tsx` with Dark/Light mode support, clear Data Processor (attendees) vs Data Controller (host accounts) role distinction, Twilio & Cloudflare disclosures, and KVKK/GDPR rights.
      - Created `apps/web/modules/legal/tos-view.tsx` and `apps/web/app/(use-page-wrapper)/tos/page.tsx` with SaaS tool disclaimers, liability limits (no-shows, telecom carrier SMS delays), and strict acceptable use / anti-spam policy with immediate suspension rights.
      - Created alias routes for `/gizlilik-politikasi`, `/gizlilik`, and `/kullanim-kosullari`.
      - Updated `packages/lib/constants.ts` to point `WEBSITE_PRIVACY_POLICY_URL` to `https://rondevu.org/privacy` and `WEBSITE_TERMS_URL` to `https://rondevu.org/tos`.
      - Updated homepage footer navigation with links to `/privacy` and `/tos`.
    - **Dynamic Sitemap and Robots.txt**:
      - Created `apps/web/app/sitemap.ts` generating `/sitemap.xml` for `/`, `/plan-bilgi`, `/privacy`, `/tos`, `/gizlilik-politikasi`, `/kullanim-kosullari`.
      - Created `apps/web/app/robots.ts` generating `/robots.txt` allowing public routes, disallowing private paths (`/api/`, `/booking/`, `/settings/`, `/event-types/`), and linking the sitemap.
    - **Verification**: Biome formatting & lint check clean (0 errors), `@calcom/trpc` build passing (0 errors), Vitest tests passing (5/5).
31. **Resolution of 6 Critical Gaps in SMS OTP Booking Flow, Legal Pages, and SEO Sitemap** —
    - **Defect 1: State Race Condition on Booking Dispatch Resolved**:
      - Updated `packages/platform/atoms/hooks/bookings/useHandleBookEvent.ts` to support `overrideVerificationCode?: string` and read synchronously from `bookerStoreApi?.getState().verificationCode`.
      - Updated `apps/web/modules/bookings/components/BookerWebWrapper.tsx` inside `useVerifyCode.onSuccess` to pass `bookings.handleBookEvent(undefined, code)` directly, eliminating asynchronous state lag and closure entrapment.
    - **Defect 2: E.164 Phone Normalization Pipeline**:
      - Created client-safe `packages/lib/normalizePhoneNumber.ts` handling leading plus, `00`, Turkish mobile formats (`05...`, `5...`, `90...`), and formatting artifacts (spaces, dashes, parentheses).
      - Re-exported from `packages/lib/smsTransport.ts` and updated `packages/lib/contructEmailFromPhoneNumber.ts`.
      - Enforced strict E.164 regex check (`/^\+[1-9]\d{6,14}$/`) in `packages/features/auth/lib/phoneVerification.ts` for both `sendPhoneVerification` and `checkPhoneVerification`.
      - Sanitized `responses.attendeePhoneNumber` and `responses.phone` in `packages/features/bookings/lib/client/booking-event-form/booking-to-mutation-input-mapper.tsx`.
      - Created `packages/lib/normalizePhoneNumber.test.ts` (all 5 tests passed).
    - **Defect 3: Enhanced Phone Confirmation Detection Logic**:
      - Upgraded `packages/lib/isPhoneConfirmationEvent.ts` to inspect both `bookingFields` and event `metadata`.
      - Evaluates to `true` when `metadata.confirmationOption === "phone"`, `metadata.verificationOption === "phone"`, `metadata.requiresPhoneVerification === true`, or `phoneField.verify === true`, even when the organizer collects both email and phone as visible/required fields.
      - Updated callers: `useBookingForm.ts`, `useInitialFormValues.ts`, `booking-to-mutation-input-mapper.tsx`, `EventAdvancedTab.tsx`, and `FormBuilder.tsx` (persisting toggle state in `metadata.confirmationOption`).
      - Updated `RegularBookingService.ts`: when phone confirmation is active, enforces phone OTP gate (`phone_verification_required`) and checks OTP against phone number via `checkPhoneVerification` even if an email is provided.
      - Expanded unit tests in `packages/lib/isPhoneConfirmationEvent.test.ts` (all 10 tests passed).
    - **Defect 4: Dynamic Legal Contact Information**:
      - Removed all hardcoded personal contact info (`y_ekta@icloud.com` and `0552 119 19 87`) from `apps/web/modules/legal/privacy-view.tsx` and `tos-view.tsx`.
      - Added SSR data fetching via `getPlanContactConfig()` in `apps/web/app/(use-page-wrapper)/privacy/page.tsx` and `tos/page.tsx`.
      - Integrated `trpc.viewer.public.getPlanContact` query in both views to dynamically render admin-configured contact details with environment variable fallbacks (`process.env.NEXT_PUBLIC_SUPPORT_EMAIL` / `NEXT_PUBLIC_SUPPORT_PHONE`).
      - Cleaned default fallbacks in `packages/lib/planContactConfig.ts`.
    - **Defect 5: Canonical Clean SEO Sitemap**:
      - Removed duplicate non-canonical aliases (`/gizlilik-politikasi`, `/kullanim-kosullari`) from `apps/web/app/sitemap.ts`, exposing only primary canonical paths (`/`, `/plan-bilgi`, `/privacy`, `/tos`).
    - **Defect 6: OTP Resend Mechanism and Modal Dismissal Handling**:
      - Upgraded `apps/web/modules/bookings/components/VerifyCodeDialog.tsx` with a 60-second cooldown timer (`resendCooldown`), an active "Tekrar Kod Gönder" resend action, and Turkish UI copy.
      - Implemented thorough dismissal cleanup (`onOpenChange` and `DialogClose`) resetting input `value`, `hasVerified`, `isPending`, `resetErrors()`, and firing `onDismiss?.()`.
      - Connected `onResendCode={handleVerifyEmail}` and `onDismiss` in `apps/web/modules/bookings/components/Booker.tsx`, ensuring the booking form button remains responsive without requiring a page refresh.
    - **Verification**: All 15 Vitest tests passed, `@calcom/trpc` built cleanly with code 0, Biome checks clean.
32. **System-Wide Architectural, Logical, and Security Audit Remediation (CRIT-01 through LOW-02)** —
    - **CRIT-01 (NextAuth Session Privilege Escalation)**: Stripped client-controlled email updates from NextAuth `trigger === "update"`. Anchored session user lookup to immutable user ID (`token.sub`/`token.id`) in `packages/features/auth/lib/next-auth-options.ts`.
    - **CRIT-02 & LOW-01 (Cron Auth Bypass & Timing Attacks)**: Implemented centralized, constant-time `validateCronAuth.ts` rejecting requests if secrets are unconfigured and eliminating the `"Bearer undefined"` vulnerability across tasker and web cron routes (`cron.ts`, `cleanup.ts`, `calendar-subscriptions`, `selected-calendars`, `calendar-subscriptions-cleanup`, `bookingReminder`, `webhookTriggers`).
    - **CRIT-03 (Unpaid Booking Confirmation Inversion)**: Inverted logic bug fixed in `confirm.handler.ts` by throwing `TRPCError(BAD_REQUEST)` when attempting to confirm an unpaid booking.
    - **HIGH-01 (In-Memory Fallback Rate Limiter)**: Implemented in-memory sliding-window token bucket fallback in `rateLimit.ts` when `UNKEY_ROOT_KEY` is not present, safeguarding SMS OTP and booking routes against toll fraud and brute force in self-hosted environments.
    - **HIGH-02 (Pending Booking Idempotency & Double-Booking Fix)**: Extended `bookingIdempotencyKeyExtension` to generate `idempotencyKey` for both `ACCEPTED` and `PENDING` bookings upon creation, closing the race condition where concurrent users could double-book the same slot.
    - **HIGH-03 (Capability-URL Cancellation & Refund Protection)**: Enforced authorization on unauthenticated cancellation requests in `handleCancelBooking.ts`: caller must supply matching attendee or host email (`cancelledBy`), preventing unauthorized cancellations and automated refunds via intercepted UIDs.
    - **HIGH-04 (Calendar Reservation DoS Defense)**: Added IP rate limiting and enforced a maximum of 3 concurrent active temporary slot reservations per client session UID in `reserveSlot.handler.ts`.
    - **MED-01 (Seated Event Concurrency Protection)**: Verified transaction row-level locking (`SELECT ... FOR UPDATE`) is active on the parent booking row in `createNewSeat.ts`.
    - **MED-02 (Plan Contact Configuration Single Source of Truth)**: Made PostgreSQL database persistence authoritative in `planContactConfig.ts`: throws explicit errors on DB failures rather than silently masking them with ephemeral container file backups.
    - **MED-03 (Outgoing Webhook HTTP Timeout Guard)**: Attached `AbortSignal.timeout(10000)` (10 seconds) to outgoing webhook HTTP POST dispatches in `sendPayload.ts` to prevent worker socket starvation.
    - **Verification**: 25 Vitest tests passed across all 4 suites (100%), `@calcom/trpc` compiles cleanly (0 errors), and Biome code check verified (0 errors).
33. **Resolution of SMS OTP Twilio Single-Use Rejection and Stale State Loop** —
    - **Twilio Verify Single-Use Invalidation**: Twilio Verify deletes/consumes the pending verification upon the initial check in `VerifyCodeDialog`, causing `RegularBookingService` during booking creation to receive 404/not approved and throw `invalid_verification_code` ("Geçersiz doğrulama kodu girildi"). Implemented `verifiedPhoneCache` with a 15-minute sliding TTL in `packages/features/auth/lib/phoneVerification.ts` so `RegularBookingService` can verify previously approved phone codes without double-calling Twilio.
    - **Stale State Loop & Lock**: When booking creation failed, `BookerStore.verificationCode` and `verifiedEmail` remained stored, leaving `isVerified: true` and the form button in "Onayla" mode. Clicking it resent the stale code directly to `/api/book/event`. Added state cleanup in `createBookingMutation.onError` and `createRecurringBookingMutation.onError` in `useBookings.ts` to reset `setVerificationCode(null)` and `setVerifiedEmail(null)`, switching the button back to verification mode.
    - **Premature State Set**: Removed premature `setVerificationCode(value)` from `VerifyCodeDialog.tsx` line 121, ensuring only verified codes from `useVerifyCode.onSuccess` enter `BookerStore`.
    - **Resend Invalidation**: Added `clearPhoneVerificationCache(phoneNumber)` when dispatching a new SMS verification in `sendPhoneVerification` and resetting code state on modal dismissal.
34. **Critical Build Fix: Broken Import in CancelBooking.tsx & Web Build Verification** —
    - **Broken Module Import Fixed**: In `apps/web/components/booking/CancelBooking.tsx`, fixed line 13 import from non-exported path `@calcom/ui/components/form/inputs/TextField` to valid export `@calcom/ui/components/form` (`import { CheckboxField, Input, Label, Select, TextArea } from "@calcom/ui/components/form"`).
    - **Build Icons Unmatched Files Fix**: In `packages/ui/scripts/build-icons.mjs`, added `--no-errors-on-unmatched` to the Biome format command (`node ${biomeBin} format --write --no-errors-on-unmatched ${filepath}`) so files in `public/` (ignored by `biome.json`) do not throw exit code 1 during build.
    - **Full Next.js Web Production Build Verified**: Ran `corepack.cmd yarn workspace @calcom/web run build`, successfully compiling and generating all 98 static pages and dynamic routes with Turbopack (`✓ Compiled successfully in 5.2min`, `✓ Generating static pages using 7 workers (98/98) in 6.1s`, exit code 0).
    - **Validation**: Biome lint check passed (0 errors), all route pages compiled cleanly.
35. **SMS Template Compression & GSM 7-bit Sanitization (Twilio Error 30044 Fix)** —
    - **GSM 7-bit Transliteration Helper**: Created `packages/lib/sanitizeSmsText.ts` and re-exported it in `packages/lib/smsTransport.ts` and `packages/sms/sms-transport.ts`. Automatically maps Turkish characters (`ç, Ç, ğ, Ğ, ı, İ, ö, Ö, ş, Ş, ü, Ü`), circumflex vowels (`â, Â, î, Î, û, Û`), smart quotes (`“”, ‘’`), dashes (`–, —`), ellipsis, and diacritics into standard GSM 7-bit ASCII before dispatch in `sendSMS`, preventing UCS-2 Unicode fallback and preserving 160-character per segment capacity.
    - **Radical Template Shortening (<= 160 Chars / 1 Segment)**: Overhauled all 10 attendee SMS templates in `packages/sms/attendee/` (confirmation, reminder, cancellation, reschedule, booking requested, declined, location changed, awaiting payment, seat cancelled, reschedule requested) into concise, 1-segment structures. Stripped conversational greetings, attendee notes, and protocols (`https://`). Format: `"rOndevu: [Baslik] randevunuz onaylandi. Tarih: [DD.MM HH:mm]. Detay/Iptal: rondevu.org/b/[uid]"`. Added title length capping and compact date formatting (`DD.MM HH:mm`) on `SMSManager`.
    - **Short URL Redirection**: Added `/b/:uid` redirect to `/booking/:uid` in `apps/web/next.config.ts`.
    - **Validation & Tests**: Added unit tests in `packages/sms/test/sanitize-sms.test.ts` (10/10 passed, 18/18 total passed across `packages/sms/test/`). Verified server TypeScript compilation (`tsc --project packages/trpc/tsconfig.server.json --noEmit` exit 0).
36. **Cal.com-Referenced Pricing Section & Modular Feature Comparison Matrix** —
    - **2 Plans Only & Toggle Switcher**: Configured exactly 2 plans ("Aylık Plan" 990 ₺/mo and "Yıllık Plan" 9.900 ₺/yr with 2 months free badge) with an interactive pill toggle switch in `apps/web/modules/home/components/CalPricingSection.tsx`.
    - **Feature Comparison Matrix (`PricingMatrix.tsx`)**: Created modular, Cal.com-styled comparison matrix in `apps/web/modules/home/components/PricingMatrix.tsx` listing 18 real rOndevu scheduling capabilities across 5 structured categories (*Çekirdek Randevu Yetenekleri*, *Mola ve Limit Yönetimi*, *Danışan Deneyimi ve Güvenlik*, *Marka ve Kişiselleştirme*, *Avantaj, Garanti ve Destek*). Tablodan "Ödeme Alma" (Payments) ve "Dahili Video" satırları tamamen çıkarıldı.
    - **Dynamic Admin Contact Modal (`PlanContactModal.tsx`)**: Zero payment gateways or registration forms; clicking plan CTA opens modal with dynamic admin contact channels (WhatsApp with `replace(/\D/g, '')` cleaned phone & `encodeURIComponent` prefill message, Phone with `replace(/[^\d+]/g, '')`, and Email) fetched via `trpc.viewer.public.getPlanContact`.
    - **Bilingual & Clean Copy**: Matrix categories, feature rows, and modal copy fully localized in `apps/web/modules/home/i18n/home-translations.ts` (TR/EN) with 0 occurrences of the forbidden word "altyapı".
    - **Validation & Browser Verification**: Biome formatting checks passed, 0 console hydration errors, verified live in browser subagent on `http://localhost:3000/`. Zero git commits pushed per instruction.

37. **Dark Integration/Footer Contrast Pass** —
    - Integration logo tiles now use dark surfaces, subtle borders, and brighter image treatment; Zapier selectors are covered for readable contrast.
    - Divider intersection plus markers use translucent dark containers with light icon treatment.
    - Footer status is normalized after hydration to a localized “Tüm Sistemler Aktif” badge with a green active dot; duplicate footer icon imagery is removed so only the rOndevu wordmark remains.
    - Hero calendar preview year is normalized to 2026 and empty outer border layers are suppressed without rebuilding the Framer markup.

38. **Pricing White Overlay Root Cause Fix** —
    - The exported footer status badge image was absolutely positioned inside an unpositioned Framer container on `/pricing`; its 1112×4536px image stretched over the page and intercepted clicks to `status.rondevu.org`.
    - `PricingView` now replaces the remote badge image with the localized text/dot status markup after hydration, while pricing CSS constrains the wrapper and hides the unsafe image before hydration.
    - Verified by Playwright that the status link is now 131×30px at the footer and center points in the former white region no longer resolve to the status link.

39. **Homepage Surface and FAQ Spacing Polish** —
    - Homepage dark canvas/structural empty bands now use `#262626`; structural Framer borders are highlighted with `#b1b1b2` for clearer section depth.
    - FAQ expansion now measures the first answer text block and caps animated height at 240px, preventing the exported wrapper’s oversized scroll height from creating a long blank gap.

40. **Homepage Surface Unification Follow-up** —
    - The remaining `#141414` was found on the nested `#main` and page wrapper outside the Framer canvas; both now inherit the homepage `#262626` surface.
    - All Framer elements named `Line`, including horizontal separators, now use `#b1b1b2` with controlled opacity so horizontal and vertical depth cues match.

41. **Dark Theme Visual Balance Pass** —
    - Rebalanced homepage dark mode to a single `#1c1c20` canvas/section surface instead of the overly bright `#262626` outer bands.
    - Removed long structural shell borders and exported section-corner handles; content cards retain their own framing while separators remain softly visible.

42. **Pricing Typography and Framing Cleanup** —
    - Restored subtle vertical section edges alongside homepage horizontal separators.
    - Pricing comparison heading top padding reduced from 96px to 32px.
    - Annual billing copy now wraps within its card; feature headings share the same muted light text color.
    - Footer copyright/status container now uses a restrained 12px radius, dark surface, and consistent muted text color.

43. **Navigation and Pricing Interaction Polish** —
    - Removed Features/Pricing/FAQ navbar links; enlarged and left-aligned rOndevu wordmark, simplified TR/EN and theme controls, and changed login to a compact rectangular action.
    - Pricing comparison now normalizes missing plan checkmarks so every individual feature is included for both plans; annual billing copy wraps safely.
    - Added subtle matrix column separators, corrected badge icon contrast, and refreshed the plan contact modal with a compact rOndevu dark-surface treatment.

44. **Dark Badge Icon Contrast** —
    - Framer `White Icon` badges now explicitly invert their nested image-based SVG icons to white in dark mode, including the Benefits/How-it-works labels.

45. **Cross-page Visual QA Pass** —
    - Reviewed homepage and pricing at desktop and 390px mobile widths in dark mode; document/body widths remain constrained to the viewport with no horizontal overflow.
    - Tightened annual pricing copy wrapping, normalized homepage hero year replacement handling, and retained bounded dark surfaces, modal, matrix, and navbar refinements.

46. **Homepage Canvas and Pricing Neutral Contrast Pass** —
    - Set the dark homepage canvas, structural shells, `#main`, and root wrapper to the pricing canvas tone `#141414`; card-level surfaces remain distinct for depth.
    - Centered the desktop comparison matrix with a scoped 32px correction while preserving the mobile local horizontal scroller.
    - Unified the previously dim first two pricing feature headings to the same `#f4f4f5` contrast as the remaining headings.
    - Removed green from the plan contact modal, pricing feature checks, and Framer icon/check SVGs; all plan-selection accents now use neutral grayscale tokens.
    - Verified the local pricing route has no remaining green computed styles, the homepage roots resolve to `rgb(20, 20, 20)`, and both routes stay viewport-contained.

47. **Final Framer wrapper and interaction cleanup (2026-10-05)** —
    - Moved the FAQ action group below the questions in both static language fragments, preventing hydration from restoring the buttons above the accordion.
    - Added static status-badge normalization with bounded dark styling, localized labels, and no remote image overlay; status links remain limited to the badge.
    - Re-ran static checks: no forbidden Turkish term, old 2025 date, removed CTA, or small logo icon remains; comparison rows contain two checks each.
    - Browser checks confirmed FAQ open/close state and answer animation, centered pricing matrix, no document overflow, working plan contact modal, and bounded status link.

48. **Comparison plan header alignment (2026-10-05)** —
    - Removed the comparison header's redundant annual billing and gift badge nodes in both locales.
    - Shortened the annual comparison description and applied a shared flex column rhythm so monthly/yearly cards and CTAs finish on the same baseline.
    - Narrow browser verification measured equal card heights and CTA bottoms, with horizontal scrolling still confined to the matrix viewport.

49. **Pricing heading, card price rhythm, and stray outline cleanup (2026-10-05)** —
    - Changed the localized pricing heading to “rOndevu planınızı seçin” (EN: “Choose your rOndevu plan”).
    - Centered the monthly/yearly price text on a shared axis and removed the annual card’s redundant billing/gift labels.
    - Removed the exported comparison wrapper pseudo-outline, matched its empty gutter to the page canvas, and canceled the exported 32px desktop offset so the matrix is truly centered while retaining row and plan-column separators.
    - Static verification and a fresh local browser check passed with no document overflow.

50. **Monthly feature link cleanup (2026-10-05)** —
    - Removed the `/app` anchors from “Özel Rezervasyon Bağlantısı” / “Mola ve Tampon Süre Yönetimi” and their EN equivalents in the plan feature lists.
    - Cleared the inherited link decoration variables so these labels render with the same neutral color and no underline as adjacent features.
    - Confirmed in the local browser that the monthly feature labels have no anchors and computed `text-decoration: none`.

51. **Pricing card, matrix, and footer refinement (2026-10-05)** —
    - Removed the annual plan card's small “Yıllık” control while restoring the original top-card price/unit flow.
    - Enlarged and centered the matrix “Özellikler” label; monthly and yearly matrix prices now occupy the same grid row.
    - Marked the advanced-features label as a real section divider, removing its cell borders and centering its larger heading.
    - Removed the pricing-only system status control, flattened the footer onto the page canvas, centered the copyright, and enlarged the text wordmark.
    - Static verification and a fresh local browser check confirmed no annual control or status control, matched comparison-price vertical positions, a transparent footer, and no document overflow.

52. **FAQ answer and icon repair (2026-10-05)** —
    - Fixed the FAQ click path so the answer text opacity changes with its wrapper and its height is constrained to the measured content, eliminating the blank expanded panel.
    - Applied stable separators to FAQ items and replaced Framer's dark SVG plus asset with a clear text glyph, removing the residual square surface in dark mode.
    - Static TR/EN fragments were regenerated and marketing-page verification passed.

53. **FAQ glyph and answer-width correction (2026-10-05)** —
    - Removed the CSS pseudo-element that duplicated the static plus glyph.
    - Overrode Framer's `width: 1px` flex basis on answer text so responses occupy the full FAQ row width and wrap normally.

## What Was NOT Changed (by design)
- `@calcom/*` package namespace — internal implementation detail, changing would break 1000s of imports
- App store config.json files — 3rd party integration descriptions, non-critical
- Test mock data with cal.com URLs — non-functional
- README.md — needs full rewrite for rOndevu

## Next Steps
- Keep the current working-tree changes local for user review; no commit or remote push was requested.
- Re-run the local browser visual pass after any additional design feedback.

## Brand Asset Details
- Wordmark SVGs (`cal-logo-word*.svg`, `rondevu-logo-*.svg`): Scaled to fit original 84x26 box dimensions with 17px font, avoiding layout overflow.
- Favicon & App Icons (`apple-touch-icon.png`, `android-chrome-*.png`, `favicon-*.png`, `favicon.ico`): Rendered in Cal Sans font, exact original dark rounded-rectangle gradient, silver metallic bevel, and "rOn" lettering with no red accent.
- Windows Metro Tiles (`mstile-*.png`): Pure black background with centered white "rOn".
- Safari Pinned Tab (`safari-pinned-tab.svg`): Exact vector glyph paths of "rOn" centered in 700x700 viewBox.
- Email Header Logos (`logo.png`, `CalLogo@2x.png`): "rOndevu" wordmark in dark #292929 matching original transparent header dimensions.
## 2026-10-05 — Recurring appointment feature card

- Home page's “...ve çok daha fazlası” feature grid now receives a localized recurring-appointment card after the static Framer markup hydrates.
- Hover/focus reveals the recurring booking explanation; the visual treatment follows the existing light/dark card surfaces and does not require Framer runtime animation.
## 2026-10-05 — System-preference navigation

- Removed public language/theme controls from the shared marketing navbar.
- Both home and pricing now derive locale from browser language and color scheme from `prefers-color-scheme`; legacy local overrides are cleared.
- Refined the shared bar into a compact, translucent rOndevu header with only the wordmark and authentication action.
