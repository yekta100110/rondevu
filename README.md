# rOndevu

**rOndevu** (`rondevu.org`), Türkiye ve yerel pazarlardaki dikey sektörler (klinikler, güzellik merkezleri, danışmanlık ofisleri, kuaför/berber salonları ve yerel işletmeler) için tasarlanmış, **WhatsApp ve SMS odaklı** randevu ve takvim yönetim SaaS platformudur.

---

## Mimari ve Temel Bileşenler

`rOndevu`, Yarn ve Turborepo tabanlı bir TypeScript monorepo mimarisi üzerinde çalışır:

- **Web & Uygulama Katmanı (`apps/web`):** Next.js (App Router), Tailwind CSS (koyu tema varsayılanlı `#141414` / `#121214`), `tr` (varsayılan) ve `en` çift dil desteği (`packages/i18n`).
- **API & İş Mantığı (`packages/trpc`, `packages/features`):** Uçtan uca tip güvenli tRPC router'ları, framework-bağımsız servis (`*Service.ts`) ve veri erişim (`*Repository.ts`) katmanları, `@evyweb/ioctopus` Dependency Injection yapısı.
- **Veritabanı (`packages/prisma`):** PostgreSQL ve Prisma ORM (`schema.prisma`).
- **WhatsApp Bildirim & Rıza Omurgası (`Evolution API + n8n`):**
  - Randevu onay, hatırlatma, iptal ve erteleme bildirimleri sistem çapında **Platform Webhook -> n8n -> Evolution API** hattı üzerinden iletilir.
  - Gönderim öncesi alıcı açık rıza (opt-in) kontrolü (`/api/internal/whatsapp/eligibility`), `STOP`/`DUR`/`İPTAL` mesajlarıyla otomatik çıkış (`/api/internal/whatsapp/opt-out`) ve yönetici teslimat izleme/yeniden deneme ekranı (`/settings/admin/webhook-deliveries`) içerir.
- **SMS & Telefon Doğrulama (OTP) Omurgası (`packages/sms`, `packages/lib`):**
  - **Twilio Verify** tabanlı OTP doğrulaması ve 15 dakikalık `verifiedPhoneCache` (`packages/features/auth/lib/phoneVerification.ts`).
  - **Twilio Programmable SMS / Netgsm / Webhook** çoklu sağlayıcı soyutlaması (`packages/lib/smsTransport.ts`).
  - E.164 telefon normalizasyonu (`packages/lib/normalizePhoneNumber.ts`) ve GSM 7-bit (`<= 160` karakter) Türkçe ASCII transliterasyonu (`packages/lib/sanitizeSmsText.ts`).
- **Outreach & Doğrudan DB Demo Enjeksiyonu (15 Günlük TTL):**
  - Aday işletme profillerinin doğrudan PostgreSQL veritabanına (`isOutreachDemo: true`, `demoCreatedAt`, `demoExpiresAt: +15 gün`) tekillik (idempotency) korunarak işlenmesi, **"Şifremi Unuttum"** + abonelik adımıyla kalıcı hesaba devralınması ve sahiplenilmeyen demoların 15 gün sonunda otomatik temizlenmesi.
- **Dinamik Plan İletişim Yönetimi:** Aylık/Yıllık abonelik aktivasyonu için yönetici iletişim kanallarının (`packages/lib/planContactConfig.ts`, `/settings/admin/plan-contact`) veritabanı üzerinden dinamik yönetimi.

---

## Paket Yapısı ve Bağımlılık Hiyerarşisi

Paketler arası bağımlılık yönü katı şekilde soldan sağadır:

```text
packages/lib -> packages/app-store -> packages/features -> packages/trpc -> apps/web
```

| Dizin | Açıklama |
| :--- | :--- |
| `apps/web/` | Next.js ana web uygulaması (`app/` App Router ve `modules/` görünüm katmanı) |
| `packages/prisma/` | Prisma şeması (`schema.prisma`), migration'lar ve seed betikleri |
| `packages/trpc/` | tRPC sunucu router'ları ve istemci kancaları |
| `packages/features/` | Alan (domain) servisleri, repository'ler ve iş kuralları |
| `packages/sms/` | Randevu yaşam döngüsü SMS yöneticisi (`SMSManager`) ve şablonları |
| `packages/ui/` | Paylaşımlı UI bileşenleri (`package.json` `exports` haritasına tabidir) |
| `packages/lib/` | Temel yardımcı kütüphaneler (SMS transport, E.164, GSM 7-bit, hata sınıfları) |
| `packages/i18n/` | Türkçe (`tr`) ve İngilizce (`en`) dil dosyaları |

---

## Geliştirme ve Doğrulama Komutları

```bash
# Bağımlılıkları yükle
yarn install

# Geliştirme sunucusunu başlat
yarn dev

# Prisma istemcisini ve enum tiplerini üret (şema değişikliği sonrası zorunlu)
yarn prisma generate

# Şema veya tRPC router değişikliği sonrası tRPC paketini derle
yarn workspace @rondevu/trpc run build

# Tam tip kontrolü (commit/push öncesi zorunlu)
yarn type-check:ci --force

# Kod biçimlendirme ve lint kontrolü (Biome)
yarn biome check --write .

# Birim testleri çalıştır (UTC saat dilimi ile)
TZ=UTC yarn test
```

---

## Mühendislik ve Operasyon Rehberleri

- **[`AGENTS.md`](AGENTS.md)** (`CLAUDE.md` symlink): AI ajanları ve geliştiriciler için mimari sınırlar, kodlama standartları, Prisma/tRPC/UI kuralları ve `rOndevu` çekirdek modül kuralları.
- **[`docs/n8n-whatsapp-platform.md`](docs/n8n-whatsapp-platform.md)**: Platform Webhook -> n8n -> Evolution API WhatsApp entegrasyonu, güvenlik başlıkları (`X-Rondevu-*`), ortam değişkenleri ve operasyonel çalışma rehberi.
- **[`agents/README.md`](agents/README.md)**: Modüler mühendislik kuralları (`agents/rules/`), komut referansı (`agents/commands.md`) ve alan bilgi tabanı (`agents/knowledge-base.md`).
