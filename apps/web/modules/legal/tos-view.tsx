"use client";

import { APP_NAME } from "@calcom/lib/constants";
import { Button } from "@calcom/ui/components/button";
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
import { BrandLogo } from "../home/components/BrandLogo";

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
        <div className="mx-auto grid h-16 max-w-6xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center justify-self-start gap-2 text-subtle text-sm transition-colors hover:text-emphasis">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Ana Sayfaya Dön</span>
          </Link>
          <Link href="/" className="flex items-center justify-self-center">
            <BrandLogo />
          </Link>
          <Link href="/auth/login" className="justify-self-end">
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
            <span>Hizmet kullanımı hakkında</span>
          </div>
          <h1 className="font-semibold text-3xl text-emphasis tracking-tight sm:text-4xl">
            Kullanım Koşulları
          </h1>
          <p className="mt-2 text-sm text-subtle">Son güncelleme: 26 Ekim 2026</p>
        </div>

        {/* Content Box */}
        <div className="space-y-8 rounded-2xl border border-subtle bg-default/90 p-6 shadow-sm backdrop-blur-sm sm:p-10">
          {/* Giriş */}
          <section className="space-y-3 border-subtle border-b pb-6">
            <p className="text-sm leading-relaxed text-subtle">
              Bu koşullar, {APP_NAME} üzerinden hesap açılması, randevu sayfası oluşturulması ve randevu
              alınmasıyla ilgili temel kullanım kurallarını açıklar. Hesap sahipleri, kendi randevu
              sayfalarındaki içerikten ve sundukları hizmetlerden sorumludur.
            </p>
          </section>

          {/* 1. Hizmetin Niteliği */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-emphasis" />
              <h2 className="font-semibold text-lg text-emphasis sm:text-xl">
                1. Hizmetin Kapsamı
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-subtle">
              Rondevu, hesap sahiplerinin müsaitliklerini yönetmesine ve katılımcıların randevu oluşturmasına
              yardımcı olan bir yazılım hizmetidir. Bildirim, SMS doğrulaması ve takvim bağlantıları gibi
              işlevler hesap ayarlarına ve bağlı hizmetlere göre kullanılabilir.
            </p>
            <div className="rounded-xl border border-subtle bg-muted/20 p-4 text-xs leading-relaxed text-subtle">
              Randevuya konu olan hizmetin açıklaması, ücreti, iptal koşulları ve yerine getirilmesi
              randevu sahibi tarafından katılımcıya bildirilmelidir. Platformdaki randevu kaydı, bu
              hizmetin sunulduğunu veya sonucunu garanti etmez.
            </div>
          </section>

          {/* 2. Hizmetin Kullanımı */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-emphasis" />
              <h2 className="font-semibold text-lg text-emphasis sm:text-xl">
                2. Randevular ve Bağlı Hizmetler
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-subtle">
              Randevu akışını kullanırken aşağıdaki durumları dikkate alın:
            </p>
            <ul className="space-y-3 text-sm text-subtle">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emphasis" />
                <span>
                  <strong>Katılım ve iptal:</strong> Randevu sahibi ve katılımcı, randevuya katılma,
                  yeniden planlama ve iptal konusunda kendi aralarında iletişim kurmalıdır.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emphasis" />
                <span>
                  <strong>Bildirimler:</strong> SMS ve e-posta iletileri harici sağlayıcılara bağlıdır.
                  Bildirim gecikirse randevu bilgilerini hesabınızdan veya onay bağlantınızdan kontrol edin.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emphasis" />
                <span>
                  <strong>Hizmet koşulları:</strong> Randevu sahibinin sunduğu hizmete ilişkin fiyat,
                  ödeme ve iade bilgileri ilgili hizmet sahibi tarafından açıklanır.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emphasis" />
                <span>
                  <strong>Entegrasyonlar:</strong> Takvim ve görüşme sağlayıcılarında yaşanan kesintiler
                  eşitlemeyi veya toplantı bağlantılarının oluşturulmasını etkileyebilir.
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
              Randevu sayfaları ve bildirim özellikleri meşru randevu organizasyonu için kullanılmalıdır.
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
                    Başkalarının hesaplarına yetkisiz erişmeye çalışmak veya hizmeti aşırı isteklerle
                    kullanılamaz hale getirmek.
                  </li>
                </ul>
              </div>
              <p className="text-xs text-subtle">
                Kuralları ihlal eden veya bildirim sistemini kötüye kullanan hesapların erişimi, durum
                incelenirken sınırlandırılabilir. Sorularınız için aşağıdaki iletişim kanallarını kullanın.
              </p>
            </div>
          </section>

          {/* 4. Fikri Mülkiyet ve Değişiklikler */}
          <section className="space-y-4 border-subtle border-t pt-6">
            <h2 className="font-semibold text-lg text-emphasis sm:text-xl">
              4. Fikri Mülkiyet ve Şartların Güncellenmesi
            </h2>
            <p className="text-sm leading-relaxed text-subtle">
              Rondevu kaynak kodu, depoda belirtilen açık kaynak lisansı kapsamında kullanılabilir;
              marka ve görsel unsurlar için aynı lisansın geçerli olduğu varsayılmamalıdır. Bu koşullar
              değiştiğinde güncel metin ve değişiklik tarihi bu sayfada yayımlanır.
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
