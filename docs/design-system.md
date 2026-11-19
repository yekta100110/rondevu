# rOndevu Tasarım Sistemi

Bu belge rOndevu arayüzünün tek kaynağıdır. 2026-11-19 tarihinde kullanıcıyla birlikte dört tur prototip üzerinden karara bağlandı. Yeni bir ekran, bileşen ya da açılış sayfası bölümü yazmadan önce okunur. Burada yazmayan bir görsel karar gerekirse önce bu belge güncellenir.

Referans uygulama: `/home/yekta/atolye/rondevu-design` (Next 16 + shadcn/ui `radix-nova` + motion). Görünüş ya da davranış konusunda şüphe varsa orada nasıl yapıldığına bakılır.

## 1. İlkeler

1. **Monokrom.** Renk vurgusu yok. Durum parlaklık, boyut, dolgu ve çizgiyle anlatılır. Tek istisna: hata ve geri alınamaz işlem bildiren `destructive` kırmızısı, yalnız hata metninde ve yıkıcı menü öğesinde.
2. **Sade ve kesin.** Vercel/Linear sadeliği: ince 1px çizgiler, nötr griler, sıkı başlık harf aralığı, mono rakamlar.
3. **Ürünün kendisi kahramandır.** Açılış sayfasında stok görsel, soyut süs ya da sahte arayüz yok. Gerçek panel ve gerçek randevu akışı gösterilir.
4. **Animasyon işlevseldir.** Her hareket bir durum değişimini, yerleşmeyi ya da veriyi anlatır. Süs için ışıltı, parlama, renkli hale yok.
5. **Kopya sade Türkçe.** Başlık üstü etiket ("Yönetim paneli", "Özellikler" gibi eyebrow) yok. Tema/metafor isimleri yok. "altyapı" kelimesi yasak (bkz. `CLAUDE.md`).

## 2. Yasaklar (kullanıcı tarafından açıkça reddedildi)

- Kızıl/renkli vurgu rengi, gradyan metin, glow, `box-shadow` ile renkli ışık.
- Başlıkların üstünde küçük mono açıklama etiketleri (eyebrow).
- "Mühür", "Kadran", "Işık" gibi tema adları ve bunlara bağlı süs animasyonları.
- Dev büyük harfli, daraltılmış afiş başlıkları.
- Telefon/iPhone çerçevesi içinde arayüz göstermek.
- Kare içinde "r" logosu. Logo yalnızca `rOndevu` yazısıdır.
- Soluk, zemin rengiyle kaynaşan gri sayfa kabukları.
- Cal.com'un üç sütunlu (bilgi | takvim | saatler) randevu düzenini kopyalamak.

## 3. Token'lar

Tek gerçek kaynak `packages/config/theme/tokens.css` (eski `--rondevu-*` adları geriye dönük uyum için korunur, değerleri bu tabloya eşlenir) ve `packages/coss-ui/src/styles/globals.css` (shadcn adları).

| Rol | Açık | Koyu |
|---|---|---|
| background | `oklch(1 0 0)` | `oklch(0.13 0 0)` |
| foreground | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` |
| card / popover | `oklch(1 0 0)` | `oklch(0.205 0 0)` |
| primary (mürekkep) | `oklch(0.205 0 0)` | `oklch(0.922 0 0)` |
| primary-foreground | `oklch(0.985 0 0)` | `oklch(0.205 0 0)` |
| secondary / muted / accent | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` |
| muted-foreground | `oklch(0.556 0 0)` | `oklch(0.708 0 0)` |
| border / input | `oklch(0.922 0 0)` | `oklch(1 0 0 / 10%)` / `15%` |
| ring | `oklch(0.708 0 0)` | `oklch(0.556 0 0)` |
| sidebar | `oklch(0.985 0 0)` | `oklch(0.205 0 0)` |
| destructive | `oklch(0.577 0.245 27.325)` | `oklch(0.704 0.191 22.216)` |
| chart-1…5 | `0.87 / 0.556 / 0.439 / 0.371 / 0.269` (nötr) | aynı |

- **Marka rengi = mürekkep.** `--rondevu-brand` ve `primary` aynıdır. Kullanıcı kendi marka rengini seçerse yalnız kendi randevu sayfasında uygulanır.
- **Köşe yarıçapı:** `--radius: 0.5rem` (8px). Kontroller 6–8px, kartlar 12px (`rounded-xl`), pencereler 12px.
- **Tema:** Açık ve koyu birlikte tasarlanır. `next-themes` ile sistem teması izlenir. `D` tuşu ve üst bardaki ikon temayı değiştirir.

## 4. Tipografi

- **Yazı tipleri:** `Geist` (metin ve başlık), `Geist Mono` (saat, tarih, fiyat, kısayol, kod). `latin` ve `latin-ext` alt kümeleri (Türkçe karakterler).
- **Başlıklar:** `font-semibold`, harf aralığı `-0.04em` ile `-0.055em` arası, `text-balance`. Hero: `text-5xl → sm:text-7xl → lg:text-[88px]`, `leading-[0.98]`. Bölüm başlığı: `text-4xl → sm:text-5xl`.
- **Metin:** 15px temel, açıklama `text-muted-foreground`, gövde en fazla ~46–52ch.
- **Rakamlar:** `font-variant-numeric: tabular-nums` (`.tnum`), saatler `font-mono`.
- **Logo (wordmark):** `rOndevu`, `font-semibold`, `tracking-[-0.04em]`. Üst barda ve panel kenar menüsünde 22px.

## 5. Hareket

- **Tek eğri:** `cubic-bezier(0.16, 1, 0.3, 1)` (`ease` motion.tsx).
- **Süreler:** 160 ms dokunuş/hover, 300 ms durum değişimi, 500–700 ms sahne girişi.
- **Desenler:**
  - `WordsIn`: hero başlığı kelime kelime, 60 ms aralıkla, `y: .35em → 0`, `blur 8px → 0`.
  - `Reveal`: bölüm girişi, `y: 12px`, `blur 6px → 0`, bir kez. İçerik DOM'da baştan vardır.
  - `CountUp`: istatistik sayıları görünür olunca 1,1 sn'de sayar.
  - `layoutId` hapı: seçili gün, seçili saat, seçili adım, yatay sekmelerde (`HorizontalTabs`) aktif sekme arka planı yay animasyonuyla kayar (`stiffness 500, damping 38`).
  - Açılır içerik: `height: 0 → auto`, 300 ms.
  - Onay: SVG halka `pathLength 0 → 1` (800 ms), ardından tik (400 ms, 600 ms gecikme).
  - Kaydet çubuğu: ayarlar değişince alttan yayla çıkar.
  - Bildirim: sağ altta kart, `y 16 → 0`, `blur 4 → 0`.
- **Azaltılmış hareket:** `MotionConfig reducedMotion="user"`. Sürekli dönen animasyonlar (gün halkası, otomatik demo) `prefers-reduced-motion` altında durur.
- Kütüphane: `framer-motion` (repoda mevcut). `animation-timeline` gibi tarayıcıya bağlı özellikler yalnızca süs için kullanılabilir.

## 6. İmza öğesi: Gün halkası

Günün 1440 dakikası, eğik bir halkada parçacık olarak çizilir (`DayRing`, canvas 2D, monokrom).
- Boş dakika soluk, dolu dakika daha parlak ve dışa kayık, seçilen aralık beyaz/mürekkep ve iri.
- "Şu an" ibresi halkanın dış kenarında kısa bir çizgi ve saat etiketi. Ardında 3 saatlik iz bırakır.
- Fare halkayı hafifçe eğer. Seçim değişince halka seçili aralığı öne döndürür. Onayda parçacıklar dışa dağılıp geri toplanır.
- Yalnız açılış sayfasının hero'sunda, başlığın arkasında, başlığı çerçeveleyen hare olarak kullanılır.

## 7. Bileşen kuralları

- **Butonlar:** `default` (mürekkep dolgu), `outline`, `ghost`, `link`. Ok ikonlu butonda ikon hover'da 2px sağa kayar. Basınca `scale(.97)`.
- **Durum rozeti (monokrom):** Onaylı = dolu mürekkep nokta. Geldi/tamamlandı = gri nokta, gri metin. Bekliyor = içi boş halka. İptal = üstü çizili metin, soluk nokta. Hepsi `outline` rozet, `font-mono text-[11px]`.
- **Kartlar:** 1px çizgi, gölge yok ya da çok hafif. Özellik ızgarası: `gap-px` + `bg-border` ile ortak çizgili hücreler.
- **Zaman çizelgesi:** Saat etiketleri solda mono 11px. Randevu bloğu tek satır: solda 3px dikey çizgi, `isim · hizmet`, sağda `09:00 – 09:30`. Seçili blok: mürekkep kenar + `bg-accent` (opak). Mola: kesik çizgili, taralı zemin. "Şu an" çizgisi mürekkep, yalnız mesai saatleri içindeyken görünür. Saat başına 72px.
- **Formlar:** shadcn `Field` yapısı (etiket, açıklama, hata). Hata metni örnek verir: "Geçerli bir e-posta yazın. Örnek: ad@alanadi.com".
- **Ayarlar:** Sekmeler URL'de (`?tab=`). Kaydet alanı (`SectionBottomActions`) sayfanın altında yapışkan, bulanık zeminli çubuktur; kaydedilecek değişiklik yokken (gönder düğmesi devre dışı) hafifçe geri çekilir ve soluklaşır, değişiklik olunca öne gelir.
- **Bildirimler:** `sonner`, alt orta. İptal gibi işlemlerde "Geri al" eylemi.

## 8. Sayfa düzenleri

- **Açılış (`/`):** Sabit üst bar (kaydırınca bulanık zemin + alt çizgi). Hero ortalı: başlık, alt metin, iki buton, gün halkasının durumunu yazan küçük mono satır. Halka başlığın arkasında. Altında geniş tarayıcı penceresinde gerçek panel, kaydırdıkça `rotateX 14° → 0`, `scale .94 → 1`. Panelin köşesine sırayla bildirim kartları düşer. Sonra: randevu deneyimi bölümü (solda yapışkan metin, sağda gerçek 3 adımlı akış), özellik ızgarası, "nasıl çalışır" 4 adımı (sırayla dolan çizgi), fiyatlar (aylık/yıllık geçişinde rakam yuvarlanır), kapanış (dev soluk `rOndevu` wordmark).
- **Randevu sayfası:** Tek sütun, en fazla 3xl. Üstte avatar, ad, unvan. Adımlar: Hizmet → Zaman → Bilgiler. Adım göstergesi `layoutId` hapı ve dolan çizgi. Zaman adımında solda takvim, sağda saat ızgarası (3 sütun). Geçişler yatay kayma + bulanıklık.
- **Panel:** shadcn `Sidebar` (`variant="inset"`, `collapsible="icon"`), üst bar: menü düğmesi, arama (`⌘K`), tema. İçerik en fazla 6xl. Bugün sayfası: 4 istatistik kartı, zaman çizelgesi + seçili randevu detayı, haftalık grafik + yaklaşan randevular tablosu.

## 9. Fiyat ve iletişim gerçekleri

Pazarlama yüzeylerinde fiyat, paket ve iletişim bilgisi `brain/projects/rondevu.md` §4'teki kesin kararlardan alınır: aylık ve yıllık paket özellikleri aynı, yıllıkta 2 ay ücretsiz; API/Webhook erişimi ve marka gizleme satılmaz; adres yazılmaz. Prototipteki örnek fiyatlar kullanılmaz.

## 10. E-postalar

E-posta istemcileri web fontu ve CSS değişkeni yüklemediği için şablonlar satır içi stil kullanır: yazı yığını `Geist, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`, bağlantılar `#171717` ve altı çizili, zeminler nötr gri. Renkli bağlantı ya da buton kullanılmaz.
