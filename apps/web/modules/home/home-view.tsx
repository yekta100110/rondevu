"use client";

import { APP_NAME } from "@calcom/lib/constants";
import classNames from "@calcom/ui/classNames";
import { Badge } from "@calcom/ui/components/badge";
import { Button } from "@calcom/ui/components/button";
import { Logo } from "@calcom/ui/components/logo/Logo";
import { ArrowRight, Calendar, Check, Clock, ShieldCheck, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

function BackgroundGrid() {
  const rows = 12;
  const cols = 20;
  const size = 60;
  const gap = 8;
  const radius = 8;
  const width = cols * size + (cols - 1) * gap;
  const height = rows * size + (rows - 1) * gap;

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        className="[--grid-fill:#f7f7f7] [--grid-stroke:rgba(34,42,53,0.06)] dark:[--grid-fill:#171717] dark:[--grid-stroke:rgba(255,255,255,0.05)]">
        <defs>
          <radialGradient id="homeGridFade" cx="50%" cy="40%" rx="65%" ry="60%">
            <stop offset="10%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="homeGridMask">
            <rect width={width} height={height} fill="url(#homeGridFade)" />
          </mask>
          <filter id="homeGridShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="rgba(34,42,53,0.04)" />
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="rgba(19,19,22,0.02)" />
          </filter>
        </defs>
        <g mask="url(#homeGridMask)">
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
                filter="url(#homeGridShadow)"
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}

interface HomeViewProps {
  isLoggedIn?: boolean;
}

export function HomeView({ isLoggedIn = false }: HomeViewProps) {
  const [selectedBilling, setSelectedBilling] = useState<"monthly" | "yearly">("yearly");

  const monthlyFeatures = [
    "Sınırsız Randevu ve Etkinlik Türü",
    "Google Takvim ile Çift Yönlü Senkronizasyon",
    "Video Konferans Desteği (Daily.co)",
    "Kişiselleştirilmiş Randevu Bağlantısı",
    "Web Sitesine Gömülebilir (Embed) Widget",
    "Otomatik E-posta Bildirimleri ve Hatırlatıcılar",
    "Zaman Dilimi (Timezone) Otomatik Tespiti",
  ];

  const yearlyFeatures = [
    "Aylık plandaki tüm özellikler dahil",
    "12 Ay boyunca kesintisiz randevu yönetimi",
    "12.000 ₺ yerine sadece 10.000 ₺ (2 ay hediye)",
    "Yılda 2.000 ₺ doğrudan tasarruf",
    "Öncelikli teknik destek ve rehberlik",
    "Gelişmiş analitik ve kullanım raporları",
    "Tüm yeni özelliklere anında erken erişim",
  ];

  return (
    <div className="relative min-h-screen bg-default text-emphasis selection:bg-brand-default selection:text-brand">
      <BackgroundGrid />

      {/* Header / Navbar */}
      <header className="relative sticky top-0 z-20 border-subtle/80 border-b bg-default/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-85">
            <Logo />
          </Link>

          <div className="flex items-center gap-3">
            <Button
              href="#pricing"
              color="minimal"
              className="hidden rounded-[8px] px-3.5 py-2 font-medium text-sm text-subtle hover:text-emphasis sm:inline-flex">
              Fiyatlandırma
            </Button>
            {isLoggedIn ? (
              <Button
                href="/event-types"
                color="primary"
                className="rounded-[8px] px-4 py-2 font-medium text-sm shadow-sm">
                Panele Git
                <ArrowRight className="ml-1.5 size-4" />
              </Button>
            ) : (
              <Button
                href="/auth/login"
                color="primary"
                className="rounded-[8px] px-4 py-2 font-medium text-sm shadow-sm">
                Giriş Yap
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="pt-20 pb-16 text-center sm:pt-28 sm:pb-20">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-subtle bg-cal-muted px-3.5 py-1 font-medium text-subtle text-xs shadow-sm">
            <Sparkles className="size-3.5 text-emphasis" />
            <span>Modern & Sade Randevu Deneyimi</span>
          </div>

          <h1 className="mx-auto max-w-3xl font-bold font-cal text-4xl text-emphasis leading-[1.15] tracking-tight sm:text-5xl md:text-6xl">
            Randevularınızı sade ve zahmetsizce yönetin
          </h1>

          <p className="mx-auto mt-5 max-w-2xl font-normal text-base text-subtle leading-relaxed sm:text-lg">
            {APP_NAME}, randevu oluşturma ve takvim yönetimini karmaşadan arındırır. Müsaitlik saatlerinizi
            belirleyin, bağlantınızı paylaşın ve müşterilerinizin saniyeler içinde randevu almasını sağlayın.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              href={isLoggedIn ? "/event-types" : "/auth/login"}
              color="primary"
              className="rounded-[10px] px-6 py-2.5 font-medium text-sm shadow-sm">
              {isLoggedIn ? "Panele Git" : "Hemen Başlayın"}
              <ArrowRight className="ml-2 size-4" />
            </Button>
            <Button
              href="#pricing"
              color="secondary"
              className="rounded-[10px] px-5 py-2.5 font-medium text-sm">
              Fiyatlandırmayı İncele
            </Button>
          </div>
        </section>

        {/* Minimal Feature Highlights */}
        <section className="border-subtle/80 border-t py-12">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-subtle bg-default/60 p-6 shadow-sm">
              <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-cal-muted text-emphasis">
                <Clock className="size-5" />
              </div>
              <h3 className="mb-1.5 font-semibold text-base text-emphasis">Hızlı ve Sade Kurulum</h3>
              <p className="text-sm text-subtle leading-relaxed">
                Dakikalar içinde müsaitlik aralıklarınızı belirleyin ve profesyonel rezervasyon linkinizi
                oluşturun.
              </p>
            </div>

            <div className="rounded-xl border border-subtle bg-default/60 p-6 shadow-sm">
              <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-cal-muted text-emphasis">
                <Calendar className="size-5" />
              </div>
              <h3 className="mb-1.5 font-semibold text-base text-emphasis">Otomatik Senkronizasyon</h3>
              <p className="text-sm text-subtle leading-relaxed">
                Takviminizle tam uyumlu çalışır, çakışan randevuları engeller ve tüm planınızı senkron tutar.
              </p>
            </div>

            <div className="rounded-xl border border-subtle bg-default/60 p-6 shadow-sm">
              <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-cal-muted text-emphasis">
                <ShieldCheck className="size-5" />
              </div>
              <h3 className="mb-1.5 font-semibold text-base text-emphasis">Gizlilik ve Bağımsızlık</h3>
              <p className="text-sm text-subtle leading-relaxed">
                Verileriniz tamamen kontrolünüz altındadır. Üçüncü taraf takipçiler veya karmaşık kısıtlamalar
                yoktur.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="border-subtle/80 border-t py-16 sm:py-24">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-subtle bg-cal-muted px-3 py-0.5 font-medium text-subtle text-xs">
              <Zap className="size-3 text-emphasis" />
              <span>Şeffaf & Sade</span>
            </div>
            <h2 className="font-bold font-cal text-3xl text-emphasis tracking-tight sm:text-4xl">
              Fiyatlandırma
            </h2>
            <p className="mt-3 text-sm text-subtle sm:text-base">
              Gizli ücret veya sürpriz masraf yok. İhtiyacınıza en uygun ödeme periyodunu seçin.
            </p>

            {/* Billing Cycle Toggle */}
            <div className="mt-6 inline-flex items-center rounded-full border border-subtle bg-cal-muted p-1">
              <button
                type="button"
                onClick={() => setSelectedBilling("monthly")}
                className={classNames(
                  "rounded-full px-4 py-1.5 font-medium text-xs transition sm:text-sm",
                  selectedBilling === "monthly"
                    ? "bg-default text-emphasis shadow-sm"
                    : "text-subtle hover:text-emphasis"
                )}>
                Aylık Faturalandırma
              </button>
              <button
                type="button"
                onClick={() => setSelectedBilling("yearly")}
                className={classNames(
                  "flex items-center gap-1.5 rounded-full px-4 py-1.5 font-medium text-xs transition sm:text-sm",
                  selectedBilling === "yearly"
                    ? "bg-default text-emphasis shadow-sm"
                    : "text-subtle hover:text-emphasis"
                )}>
                <span>Yıllık Faturalandırma</span>
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 font-semibold text-[11px] text-emerald-600 dark:text-emerald-400">
                  2 Ay Hediye
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="mx-auto grid max-w-4xl grid-cols-1 items-stretch gap-8 lg:grid-cols-2">
            {/* Monthly Card */}
            <div
              className={classNames(
                "relative flex flex-col justify-between rounded-2xl border bg-default p-7 shadow-sm transition sm:p-9",
                selectedBilling === "monthly"
                  ? "border-emphasis ring-1 ring-emphasis"
                  : "border-subtle hover:border-subtle/80"
              )}>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-bold font-cal text-emphasis text-xl">Aylık Plan</h3>
                  <Badge variant="gray" size="md">
                    Esnek
                  </Badge>
                </div>
                <p className="mb-6 text-sm text-subtle">
                  Aylık düzenli kullanım için esnek ve taahhütsüz seçenek.
                </p>

                {/* Price Display */}
                <div className="mb-6 flex items-baseline gap-1.5 border-subtle border-b pb-6">
                  <span className="font-bold font-cal text-4xl text-emphasis sm:text-5xl">1.000 ₺</span>
                  <span className="font-medium text-sm text-subtle">/ ay</span>
                </div>

                {/* Features */}
                <div className="mb-8 space-y-3.5">
                  <p className="font-semibold text-subtle text-xs uppercase tracking-wider">
                    Dahil Olan Özellikler:
                  </p>
                  <ul className="space-y-3">
                    {monthlyFeatures.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-emphasis text-sm">
                        <Check className="mt-0.5 size-4 shrink-0 text-emphasis" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <Button
                  href={isLoggedIn ? "/event-types" : "/auth/login"}
                  color="secondary"
                  className="w-full justify-center rounded-[10px] py-2.5 font-medium text-sm">
                  {isLoggedIn ? "Panele Git" : "Aylık Planla Başla"}
                </Button>
                <p className="mt-2.5 text-center text-subtle text-xs">
                  İstediğiniz zaman tek tıkla iptal edebilirsiniz.
                </p>
              </div>
            </div>

            {/* Yearly Card (Featured) */}
            <div
              className={classNames(
                "relative flex flex-col justify-between rounded-2xl border bg-default p-7 shadow-sm transition sm:p-9",
                selectedBilling === "yearly"
                  ? "border-emphasis ring-2 ring-emphasis"
                  : "border-subtle hover:border-subtle/80"
              )}>
              {/* Highlight Badge */}
              <div className="absolute -top-3.5 right-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emphasis px-3.5 py-1 font-semibold text-default text-xs shadow">
                  <Sparkles className="size-3" />
                  En Avantajlı • 2 Ay Ücretsiz
                </span>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-bold font-cal text-emphasis text-xl">Yıllık Plan</h3>
                  <Badge variant="green" size="md">
                    %17 İndirim
                  </Badge>
                </div>
                <p className="mb-4 text-sm text-subtle">
                  12 ay kesintisiz erişim ve yıllık peşin ödemede 2 ay hediye.
                </p>

                {/* Price Display: 12.000 değil 10.000 TL */}
                <div className="mb-6 border-subtle border-b pb-6">
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-normal text-subtle text-xl line-through decoration-subtle/70 sm:text-2xl">
                      12.000 ₺
                    </span>
                    <span className="font-bold font-cal text-4xl text-emphasis sm:text-5xl">10.000 ₺</span>
                    <span className="font-medium text-sm text-subtle">/ yıl</span>
                  </div>

                  <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2.5 py-1 font-semibold text-emerald-600 text-xs dark:text-emerald-400">
                    <span>12.000 TL yerine 10.000 TL (Yılda 2.000 ₺ tasarruf)</span>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-8 space-y-3.5">
                  <p className="font-semibold text-subtle text-xs uppercase tracking-wider">
                    Dahil Olan Özellikler:
                  </p>
                  <ul className="space-y-3">
                    {yearlyFeatures.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-emphasis text-sm">
                        <Check className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        <span className={idx === 2 ? "font-semibold" : ""}>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <Button
                  href={isLoggedIn ? "/event-types" : "/auth/login"}
                  color="primary"
                  className="w-full justify-center rounded-[10px] py-2.5 font-medium text-sm shadow-sm">
                  {isLoggedIn ? "Panele Git" : "Yıllık Avantajla Başla"}
                  <ArrowRight className="ml-2 size-4" />
                </Button>
                <p className="mt-2.5 text-center text-subtle text-xs">Aylık yaklaşık 833 ₺'ye denk gelir.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-12 border-subtle/80 border-t bg-default/60 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-subtle sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Logo small />
            <span className="text-xs">
              © {new Date().getFullYear()} {APP_NAME}. Tüm hakları saklıdır.
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <Link href="#pricing" className="transition hover:text-emphasis">
              Fiyatlandırma
            </Link>
            <Link href="/auth/login" className="transition hover:text-emphasis">
              Giriş Yap
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
