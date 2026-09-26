"use client";

import { APP_NAME } from "@calcom/lib/constants";
import { Button } from "@calcom/ui/components/button";
import { Logo } from "@calcom/ui/components/logo";
import {
  AlertTriangle,
  ArrowLeft,
  Ban,
  CheckCircle2,
  FileText,
  Layers,
  Mail,
  Phone,
  Scale,
} from "lucide-react";
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
          <radialGradient id="tosGridFade" cx="50%" cy="30%" rx="60%" ry="50%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="tosGridMask">
            <rect width={width} height={height} fill="url(#tosGridFade)" />
          </mask>
        </defs>
        <g mask="url(#tosGridMask)">
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

interface TosViewProps {
  initialContact?: PlanContactConfig;
}

export function TosView({ initialContact }: TosViewProps = {}) {
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
            <FileText className="h-3.5 w-3.5 text-emphasis" />
            <span>Hizmet Şartları ve Kullanıcı Sözleşmesi</span>
          </div>
          <h1 className="font-semibold text-3xl text-emphasis tracking-tight sm:text-4xl">
            Kullanım Koşulları (Terms of Service)
          </h1>
          <p className="mt-2 text-sm text-subtle">Son Güncelleme: 26 Eylül 2026 • Yürürlük Sürümü: 1.2</p>
        </div>

        {/* Content Box */}
        <div className="space-y-8 rounded-2xl border border-subtle bg-default/90 p-6 shadow-sm backdrop-blur-sm sm:p-10">
          {/* Giriş */}
          <section className="space-y-3 border-subtle border-b pb-6">
            <p className="text-sm leading-relaxed text-subtle">
              Bu Kullanım Koşulları, {APP_NAME} ("Rondevu", "Platform", "rondevu.org") web sitesinin, alt alan
              adlarının ve sunulan randevu otomasyon yazılımı hizmetlerinin kullanımını bağlayan yasal
              kuralları belirler. Platforma kaydolarak veya randevu oluşturarak bu koşulları kabul etmiş
              sayılırsınız.
            </p>
          </section>

          {/* 1. Hizmetin Niteliği */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-emphasis" />
              <h2 className="font-semibold text-lg text-emphasis sm:text-xl">
                1. Hizmetin Niteliği (Yalnızca Teknik SaaS Yazılım Aracı)
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-subtle">
              Rondevu, bireysel profesyonellerin ve kuruluşların müsaitlik takvimlerini yönetmelerini, randevu
              kabul etmelerini ve SMS/e-posta aracılığıyla bildirim ve doğrulama süreçlerini otomatize
              etmelerini sağlayan bağımsız bir <strong>yazılım altyapısıdır (SaaS)</strong>.
            </p>
            <div className="rounded-xl border border-subtle bg-muted/20 p-4 text-xs leading-relaxed text-subtle">
              <strong>Önemli Uyarı:</strong> Rondevu; randevu veren uzmanlar ile randevu alan
              danışanlar/müşteriler arasındaki randevunun içeriğine, taraflar arasında sunulan
              danışmanlık/sağlık/hizmet kalitesine, seans ücretlerine veya para transferlerine{" "}
              <strong>taraf değildir</strong>. Taraflar arasındaki hukuki ve ticari ilişki münhasıran ilgili
              uzman ile danışan arasındadır.
            </div>
          </section>

          {/* 2. Sorumluluk Sınırlandırması */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-emphasis" />
              <h2 className="font-semibold text-lg text-emphasis sm:text-xl">
                2. Sorumluluğun Sınırlandırılması (Limitation of Liability)
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-subtle">
              Kanunun izin verdiği azami ölçüde, Rondevu aşağıdaki hallerden kaynaklanan doğrudan veya dolaylı
              zararlardan sorumlu tutulamaz:
            </p>
            <ul className="space-y-3 text-sm text-subtle">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emphasis" />
                <span>
                  <strong>Katılımcıların Randevuya Gelmemesi (No-Show):</strong> Danışan veya randevu
                  sahibinin belirlenen tarih ve saatte randevuya katılmaması, randevuyu unutması veya iptal
                  etmesi sebebiyle meydana gelen herhangi bir zaman veya kazanç kaybından Rondevu sorumlu
                  değildir.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emphasis" />
                <span>
                  <strong>GSM Şebekesi ve SMS Gecikmeleri:</strong> SMS OTP doğrulama kodlarının ve randevu
                  hatırlatmalarının iletimi yerel telekomünikasyon operatörleri, baz istasyonları ve şebeke
                  trafiğine bağlıdır. Operatör kaynaklı gecikmeler, şebeke kapsama alanı dışı kalma veya
                  telefonun kapalı olması durumlarından dolayı Rondevu mesul tutulamaz.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emphasis" />
                <span>
                  <strong>Ödeme ve Hizmet Uyuşmazlıkları:</strong> Hizmet alan ile hizmet veren arasında
                  randevu bedelleri, iadeler, gecikmeler veya uygulanan hizmetin içeriğine ilişkin çıkabilecek
                  her türlü anlaşmazlık doğrudan tarafların kendi sorumluluğundadır.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emphasis" />
                <span>
                  <strong>Üçüncü Taraf Entegrasyon Kesintileri:</strong> Harici takvim sağlayıcıları (Google
                  Calendar, Apple, Microsoft vb.) veya alt servis sağlayıcılarının planlı bakım ve
                  kesintilerinden kaynaklanan senkronizasyon gecikmelerinde sorumluluk ilgili sağlayıcılara
                  aittir.
                </span>
              </li>
            </ul>
          </section>

          {/* 3. Kabul Edilebilir Kullanım ve Anti-Spam */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Ban className="h-5 w-5 text-emphasis" />
              <h2 className="font-semibold text-lg text-emphasis sm:text-xl">
                3. Kabul Edilebilir Kullanım ve Anti-Spam Politikası
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-subtle">
              Rondevu altyapısı ve SMS/OTP doğrulama sistemleri yalnızca iyi niyetli ve meşru randevu
              organizasyonu amaçlarıyla kullanılabilir.
            </p>
            <div className="space-y-3">
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs leading-relaxed text-subtle dark:border-red-500/30">
                <div className="flex items-center gap-1.5 font-medium text-emphasis text-sm">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span>Kesinlikle Yasaklanmış Faaliyetler:</span>
                </div>
                <ul className="mt-2 list-inside list-disc space-y-1">
                  <li>
                    SMS veya e-posta servislerini izinsiz ticari reklam, promosyon veya toplu pazarlama (spam)
                    amacıyla kullanmak,
                  </li>
                  <li>
                    Kişilerin rızası olmaksızın telefon numaralarına mükerrer OTP kodu veya rahatsız edici
                    mesaj gönderimi tetiklemek,
                  </li>
                  <li>
                    Sistemi taciz, dolandırıcılık, sahte kimlik oluşturma veya üçüncü şahısların itibarını
                    zedeleme amacıyla kullanmak,
                  </li>
                  <li>
                    Sistemin API veya arayüzlerine tersine mühendislik, brute-force veya DDoS tipi aşırı
                    yükleme saldırıları gerçekleştirmek.
                  </li>
                </ul>
              </div>
              <p className="text-xs text-subtle">
                <strong>Askıya Alma ve Fesih Hakkı:</strong> Yukarıda belirtilen kurallara aykırı hareket eden
                veya SMS altyapısını kötüye kullanan kullanıcıların hesapları ve randevu sayfaları, Rondevu
                tarafından herhangi bir ön bildirime veya tazminata gerek olmaksızın{" "}
                <strong>derhal dondurulabilir veya kalıcı olarak kapatılabilir</strong>.
              </p>
            </div>
          </section>

          {/* 4. Fikri Mülkiyet ve Değişiklikler */}
          <section className="space-y-4 border-subtle border-t pt-6">
            <h2 className="font-semibold text-lg text-emphasis sm:text-xl">
              4. Fikri Mülkiyet ve Şartların Güncellenmesi
            </h2>
            <p className="text-sm leading-relaxed text-subtle">
              Rondevu platformunun arayüz tasarımları, yazılım kodları ve markası yasal olarak korunmaktadır.
              Rondevu, bu kullanım koşullarını yasal düzenlemeler veya hizmet geliştirme gereği dilediği zaman
              güncelleme hakkını saklı tutar. Güncellenen metin bu sayfada yayımlandığı andan itibaren
              yürürlüğe girer.
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-xs">
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
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="mt-8 flex items-center justify-between text-xs text-subtle">
          <span>
            © {new Date().getFullYear()} {APP_NAME}. Tüm hakları saklıdır.
          </span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-emphasis hover:underline">
              Gizlilik Politikası
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
