"use client";

import { APP_NAME } from "@calcom/lib/constants";
import { Button } from "@calcom/ui/components/button";
import { Logo } from "@calcom/ui/components/logo";
import { ArrowLeft, CheckCircle2, Database, Mail, Phone, ShieldCheck, UserCheck } from "lucide-react";
import Link from "next/link";

function LegalBackgroundGrid() {
  const rows = 8;
  const cols = 18;
  const size = 60;
  const gap = 8;
  const radius = 8;
  const width = cols * size + (cols - 1) * gap;
  const height = rows * size + (rows - 1) * gap;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        className="[--grid-fill:#f7f7f7] [--grid-stroke:rgba(34,42,53,0.06)] dark:[--grid-fill:#171717] dark:[--grid-stroke:rgba(255,255,255,0.04)]">
        <defs>
          <radialGradient id="legalGridFade" cx="50%" cy="30%" rx="60%" ry="50%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="legalGridMask">
            <rect width={width} height={height} fill="url(#legalGridFade)" />
          </mask>
        </defs>
        <g mask="url(#legalGridMask)">
          {Array.from({ length: rows * cols }).map((_, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = col * (size + gap);
            const y = row * (size + gap);
            return (
              <rect
                key={i}
                x={x}
                y={y}
                width={size}
                height={size}
                rx={radius}
                fill="var(--grid-fill)"
                stroke="var(--grid-stroke)"
                strokeWidth="1"
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}

import process from "node:process";
import type { PlanContactConfig } from "@calcom/lib/planContactConfig";
import { trpc } from "@calcom/trpc/react";

interface PrivacyViewProps {
  initialContact?: PlanContactConfig;
}

export function PrivacyView({ initialContact }: PrivacyViewProps = {}) {
  const { data: contactConfig } = trpc.viewer.public.getPlanContact.useQuery(undefined, {
    initialData: initialContact,
    staleTime: 30000,
  });

  const email =
    contactConfig?.email ||
    initialContact?.email ||
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL ||
    "destek@rondevu.org";
  const phone = contactConfig?.phone || initialContact?.phone;
  const cleanPhone = phone ? phone.replace(/[^\d+]/g, "") : "";

  return (
    <div className="relative min-h-screen bg-default text-emphasis selection:bg-brand-default selection:text-brand">
      <LegalBackgroundGrid />

      {/* Top Navbar */}
      <header className="relative sticky top-0 z-20 border-subtle/80 border-b bg-default/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-subtle text-sm transition-colors hover:text-emphasis">
            <ArrowLeft className="h-4 w-4" />
            <span>Ana Sayfaya Dön</span>
          </Link>
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>
          <Link href="/auth/login">
            <Button color="secondary" size="sm">
              Giriş Yap
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header Hero */}
        <div className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-subtle bg-muted/30 px-3 py-1 font-medium text-subtle text-xs">
            <ShieldCheck className="h-3.5 w-3.5 text-emphasis" />
            <span>KVKK & GDPR Uyumlu Gizlilik Standardı</span>
          </div>
          <h1 className="font-semibold text-3xl text-emphasis tracking-tight sm:text-4xl">
            Gizlilik Politikası ve Aydınlatma Metni
          </h1>
          <p className="mt-2 text-sm text-subtle">Son Güncelleme: 26 Eylül 2026 • Yürürlük Sürümü: 1.2</p>
        </div>

        {/* Content Box */}
        <div className="space-y-8 rounded-2xl border border-subtle bg-default/90 p-6 shadow-sm backdrop-blur-sm sm:p-10">
          {/* Section: Giriş */}
          <section className="space-y-3 border-subtle border-b pb-6">
            <p className="text-sm leading-relaxed text-subtle">
              {APP_NAME} ("Rondevu", "Platform", "rondevu.org") olarak, platformumuzu kullanan
              profesyonellerin ("Hesap Sahibi" / "Host") ve bu profesyonellerden randevu alan tüm katılımcı ve
              danışanların ("Katılımcı" / "Attendee") kişisel verilerinin korunmasına en üst düzeyde
              hassasiyet gösteriyoruz. Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") ve
              Genel Veri Koruma Tüzüğü ("GDPR") prensipleri uyarınca veri işleme süreçlerimizi şeffaf bir
              şekilde açıklamak üzere hazırlanmıştır.
            </p>
          </section>

          {/* Section 1: Rol Ayrımı */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-emphasis" />
              <h2 className="font-semibold text-lg text-emphasis sm:text-xl">
                1. Rol Ayrımı: Veri Sorumlusu ve Veri İşleyen
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-subtle">
              Kişisel veri mevzuatı kapsamında Rondevu’nun sorumluluk sınırları aşağıdaki şekilde kesin
              hatlarla ayrılmıştır:
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-subtle bg-muted/20 p-4">
                <h3 className="font-medium text-emphasis text-sm">
                  A. Veri Sorumlusu (Data Controller) Olarak Rondevu
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-subtle">
                  Rondevu; sistemde kayıt oluşturan, hesap açan ve randevu hizmeti sunan Hesap Sahiplerinin
                  (Host) hesap bilgileri (ad, soyad, e-posta, şifrelenmiş parola ve fatura kayıtları)
                  bakımından <strong>Veri Sorumlusu</strong> konumundadır.
                </p>
              </div>
              <div className="rounded-xl border border-subtle bg-muted/20 p-4">
                <h3 className="font-medium text-emphasis text-sm">
                  B. Veri İşleyen (Data Processor) Olarak Rondevu
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-subtle">
                  Hesap Sahiplerinin randevu sayfaları üzerinden randevu oluşturan Katılımcıların ilettiği
                  randevu bilgileri (ad, telefon numarası, randevu notları, randevu saati) bakımından Rondevu
                  yalnızca teknik yazılım altyapısı sağlayan <strong>Veri İşleyen</strong> konumundadır. Bu
                  verilerin asıl sahibi ve Veri Sorumlusu ilgili randevu sahibi (Host) uzmandır.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Toplanan Veriler */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-emphasis" />
              <h2 className="font-semibold text-lg text-emphasis sm:text-xl">
                2. Toplanan Kişisel Veriler ve İşlenme Amaçları
              </h2>
            </div>
            <ul className="space-y-3 text-sm text-subtle">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emphasis" />
                <span>
                  <strong>Telefon Numarası:</strong> Randevu onay sürecinde sahte kayıtları engellemek için
                  SMS OTP (Tek Kullanımlık Şifre) doğrulama kodu gönderilmesi, anlık randevu onay iletisi ve
                  randevu öncesi otomatik SMS hatırlatmalarının iletilmesi amacıyla işlenir.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emphasis" />
                <span>
                  <strong>Ad ve Soyad:</strong> Randevu takviminde randevu sahibine katılımcıyı tanıtmak ve
                  SMS/e-posta bildirimlerinde kişiselleştirme sağlamak amacıyla kullanılır.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emphasis" />
                <span>
                  <strong>Randevu Zamanı ve Tercihler:</strong> Takvim çakışmalarını önlemek, müsaitlik
                  aralıklarını rezerve etmek ve takvim sağlayıcılarına dışa aktarmak amacıyla işlenir.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emphasis" />
                <span>
                  <strong>Teknik ve Güvenlik Kayıtları:</strong> IP adresi, tarayıcı türü ve erişim zaman
                  damgaları; spam koruması, kötüye kullanımın önlenmesi ve sistem güvenliğinin sağlanması
                  amacıyla loglarda geçici olarak tutulur.
                </span>
              </li>
            </ul>
          </section>

          {/* Section 3: Alt İşleyenler */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emphasis" />
              <h2 className="font-semibold text-lg text-emphasis sm:text-xl">
                3. Alt İşleyenler ve Üçüncü Taraf Altyapı Sağlayıcılar (Subprocessors)
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-subtle">
              Rondevu, hizmetin yüksek güvenilirlikle ve kesintisiz sunulabilmesi için yalnızca uluslararası
              güvenlik sertifikalarına sahip ve veri koruma standartlarına uygun seçilmiş alt işleyenlerle
              çalışır:
            </p>
            <div className="space-y-3">
              <div className="rounded-xl border border-subtle p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-emphasis text-sm">Twilio Inc.</span>
                  <span className="rounded bg-muted/40 px-2 py-0.5 text-xs text-subtle">
                    SMS & OTP Altyapısı
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-subtle">
                  Telefonla kimlik doğrulama sürecinde 6 haneli güvenlik kodunun SMS ile iletilmesi (Twilio
                  Verify API) ve randevu onay/hatırlatma bildirimlerinin katılımcı telefonuna ulaştırılması
                  (Twilio Programmable Messaging API) amacıyla kullanılır. Katılımcı telefon numaraları
                  yalnızca mesajın GSM operatörüne iletilmesi gayesiyle aktarılır; ticari veya reklam amaçlı
                  kullanılmaz.
                </p>
              </div>

              <div className="rounded-xl border border-subtle p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-emphasis text-sm">Cloudflare, Inc.</span>
                  <span className="rounded bg-muted/40 px-2 py-0.5 text-xs text-subtle">
                    Ağ Güvenliği & WAF
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-subtle">
                  SSL/TLS veri şifrelemesi, DNS yönlendirmesi, bot/spam filtreleme (Cloudflare Turnstile) ve
                  DDoS saldırı koruması sağlamak amacıyla teknik altyapı sağlayıcısı olarak görev yapar.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Veri Saklama ve Haklar */}
          <section className="space-y-4">
            <h2 className="font-semibold text-lg text-emphasis sm:text-xl">
              4. Veri Saklama, Güvenlik ve İlgili Kişi Hakları
            </h2>
            <p className="text-sm leading-relaxed text-subtle">
              Kişisel verileriniz aktarım esnasında TLS 1.3 standardında şifrelenir ve güvenli sunucularda
              muhafaza edilir. KVKK'nın 11. maddesi ve GDPR hükümleri kapsamında:
            </p>
            <ul className="list-inside list-disc space-y-1.5 text-xs text-subtle">
              <li>Verilerinizin işlenip işlenmediğini öğrenme,</li>
              <li>İşlenmişse buna ilişkin bilgi talep etme ve kopyasını alma,</li>
              <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme,</li>
              <li>
                Mevzuat şartları çerçevesinde verilerinizin silinmesini veya yok edilmesini talep etme
                hakkınız bulunmaktadır.
              </li>
            </ul>
            <div className="mt-4 rounded-xl border border-subtle bg-muted/20 p-4">
              <p className="text-xs text-subtle">
                <strong>Veri Silme ve İletişim:</strong> Katılımcılar veya Hesap Sahipleri, kendilerine ait
                randevu veya hesap kayıtlarının tamamen silinmesi talebini aşağıdaki iletişim kanallarından
                doğrudan bize iletebilirler. Talepler en geç 30 gün içinde yasal mevzuata uygun şekilde
                sonuçlandırılır.
              </p>
              <div className="mt-3 flex flex-wrap gap-4 text-xs">
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-1.5 text-emphasis hover:underline">
                    <Mail className="h-3.5 w-3.5" />
                    <span>{email}</span>
                  </a>
                )}
                {phone && (
                  <a
                    href={`tel:${cleanPhone}`}
                    className="flex items-center gap-1.5 text-emphasis hover:underline">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{phone}</span>
                  </a>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="mt-8 flex items-center justify-between text-xs text-subtle">
          <span>
            © {new Date().getFullYear()} {APP_NAME}. Tüm hakları saklıdır.
          </span>
          <div className="flex gap-4">
            <Link href="/tos" className="hover:text-emphasis hover:underline">
              Kullanım Koşulları
            </Link>
            <Link href="/plan-bilgi" className="hover:text-emphasis hover:underline">
              İletişim & Destek
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
