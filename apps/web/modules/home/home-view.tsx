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
      <header className="relative z-20 border-b border-subtle/80 bg-default/80 backdrop-blur-md sticky top-0">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-85">
            <Logo />
          </Link>

          <div className="flex items-center gap-3">
            <Button
              href="#pricing"
              color="minimal"
              className="hidden sm:inline-flex rounded-[8px] px-3.5 py-2 text-sm font-medium text-subtle hover:text-emphasis">
              Fiyatlandırma
            </Button>
            {isLoggedIn ? (
              <Button
                href="/event-types"
                color="primary"
                className="rounded-[8px] px-4 py-2 text-sm font-medium shadow-sm">
                Panele Git
                <ArrowRight className="ml-1.5 size-4" />
              </Button>
            ) : (
              <Button
                href="/auth/login"
                color="primary"
                className="rounded-[8px] px-4 py-2 text-sm font-medium shadow-sm">
                Giriş Yap
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="pt-20 pb-16 sm:pt-28 sm:pb-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-subtle bg-cal-muted px-3.5 py-1 text-xs font-medium text-subtle mb-6 shadow-sm">
            <Sparkles className="size-3.5 text-emphasis" />
            <span>Modern & Sade Randevu Deneyimi</span>
          </div>

          <h1 className="font-cal text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-emphasis max-w-3xl mx-auto leading-[1.15]">
            Randevularınızı sade ve zahmetsizce yönetin
          </h1>

          <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg text-subtle leading-relaxed font-normal">
            {APP_NAME}, randevu oluşturma ve takvim yönetimini karmaşadan arındırır. Müsaitlik saatlerinizi
            belirleyin, bağlantınızı paylaşın ve müşterilerinizin saniyeler içinde randevu almasını sağlayın.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              href={isLoggedIn ? "/event-types" : "/auth/login"}
              color="primary"
              className="rounded-[10px] px-6 py-2.5 text-sm font-medium shadow-sm">
              {isLoggedIn ? "Panele Git" : "Hemen Başlayın"}
              <ArrowRight className="ml-2 size-4" />
            </Button>
            <Button
              href="#pricing"
              color="secondary"
              className="rounded-[10px] px-5 py-2.5 text-sm font-medium">
              Fiyatlandırmayı İncele
            </Button>
          </div>
        </section>

        {/* Minimal Feature Highlights */}
        <section className="py-12 border-t border-subtle/80">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-subtle bg-default/60 p-6 shadow-sm">
              <div className="flex size-10 items-center justify-center rounded-lg bg-cal-muted text-emphasis mb-4">
                <Clock className="size-5" />
              </div>
              <h3 className="font-semibold text-emphasis text-base mb-1.5">Hızlı ve Sade Kurulum</h3>
              <p className="text-subtle text-sm leading-relaxed">
                Dakikalar içinde müsaitlik aralıklarınızı belirleyin ve profesyonel rezervasyon linkinizi
                oluşturun.
              </p>
            </div>

            <div className="rounded-xl border border-subtle bg-default/60 p-6 shadow-sm">
              <div className="flex size-10 items-center justify-center rounded-lg bg-cal-muted text-emphasis mb-4">
                <Calendar className="size-5" />
              </div>
              <h3 className="font-semibold text-emphasis text-base mb-1.5">Otomatik Senkronizasyon</h3>
              <p className="text-subtle text-sm leading-relaxed">
                Takviminizle tam uyumlu çalışır, çakışan randevuları engeller ve tüm planınızı senkron tutar.
              </p>
            </div>

            <div className="rounded-xl border border-subtle bg-default/60 p-6 shadow-sm">
              <div className="flex size-10 items-center justify-center rounded-lg bg-cal-muted text-emphasis mb-4">
                <ShieldCheck className="size-5" />
              </div>
              <h3 className="font-semibold text-emphasis text-base mb-1.5">Gizlilik ve Bağımsızlık</h3>
              <p className="text-subtle text-sm leading-relaxed">
                Verileriniz tamamen kontrolünüz altındadır. Üçüncü taraf takipçiler veya karmaşık kısıtlamalar
                yoktur.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16 sm:py-24 border-t border-subtle/80">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-subtle bg-cal-muted px-3 py-0.5 text-xs font-medium text-subtle mb-3">
              <Zap className="size-3 text-emphasis" />
              <span>Şeffaf & Sade</span>
            </div>
            <h2 className="font-cal text-3xl sm:text-4xl font-bold tracking-tight text-emphasis">
              Fiyatlandırma
            </h2>
            <p className="mt-3 text-sm sm:text-base text-subtle">
              Gizli ücret veya sürpriz masraf yok. İhtiyacınıza en uygun ödeme periyodunu seçin.
            </p>

            {/* Billing Cycle Toggle */}
            <div className="mt-6 inline-flex items-center rounded-full border border-subtle bg-cal-muted p-1">
              <button
                type="button"
                onClick={() => setSelectedBilling("monthly")}
                className={classNames(
                  "rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium transition",
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
                  "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium transition",
                  selectedBilling === "yearly"
                    ? "bg-default text-emphasis shadow-sm"
                    : "text-subtle hover:text-emphasis"
                )}>
                <span>Yıllık Faturalandırma</span>
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  2 Ay Hediye
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            {/* Monthly Card */}
            <div
              className={classNames(
                "relative flex flex-col justify-between rounded-2xl border bg-default p-7 sm:p-9 transition shadow-sm",
                selectedBilling === "monthly"
                  ? "border-emphasis ring-1 ring-emphasis"
                  : "border-subtle hover:border-subtle/80"
              )}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-cal text-xl font-bold text-emphasis">Aylık Plan</h3>
                  <Badge variant="gray" size="md">
                    Esnek
                  </Badge>
                </div>
                <p className="text-subtle text-sm mb-6">
                  Aylık düzenli kullanım için esnek ve taahhütsüz seçenek.
                </p>

                {/* Price Display */}
                <div className="flex items-baseline gap-1.5 mb-6 pb-6 border-b border-subtle">
                  <span className="font-cal text-4xl sm:text-5xl font-bold text-emphasis">1.000 ₺</span>
                  <span className="text-subtle text-sm font-medium">/ ay</span>
                </div>

                {/* Features */}
                <div className="space-y-3.5 mb-8">
                  <p className="text-xs font-semibold uppercase tracking-wider text-subtle">
                    Dahil Olan Özellikler:
                  </p>
                  <ul className="space-y-3">
                    {monthlyFeatures.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-emphasis">
                        <Check className="size-4 text-emphasis mt-0.5 shrink-0" />
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
                  className="w-full justify-center rounded-[10px] py-2.5 text-sm font-medium">
                  {isLoggedIn ? "Panele Git" : "Aylık Planla Başla"}
                </Button>
                <p className="text-center text-xs text-subtle mt-2.5">
                  İstediğiniz zaman tek tıkla iptal edebilirsiniz.
                </p>
              </div>
            </div>

            {/* Yearly Card (Featured) */}
            <div
              className={classNames(
                "relative flex flex-col justify-between rounded-2xl border bg-default p-7 sm:p-9 transition shadow-sm",
                selectedBilling === "yearly"
                  ? "border-emphasis ring-2 ring-emphasis"
                  : "border-subtle hover:border-subtle/80"
              )}>
              {/* Highlight Badge */}
              <div className="absolute -top-3.5 right-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emphasis px-3.5 py-1 text-xs font-semibold text-default shadow">
                  <Sparkles className="size-3" />
                  En Avantajlı • 2 Ay Ücretsiz
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-cal text-xl font-bold text-emphasis">Yıllık Plan</h3>
                  <Badge variant="green" size="md">
                    %17 İndirim
                  </Badge>
                </div>
                <p className="text-subtle text-sm mb-4">
                  12 ay kesintisiz erişim ve yıllık peşin ödemede 2 ay hediye.
                </p>

                {/* Price Display: 12.000 değil 10.000 TL */}
                <div className="mb-6 pb-6 border-b border-subtle">
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-xl sm:text-2xl font-normal text-subtle line-through decoration-subtle/70">
                      12.000 ₺
                    </span>
                    <span className="font-cal text-4xl sm:text-5xl font-bold text-emphasis">10.000 ₺</span>
                    <span className="text-subtle text-sm font-medium">/ yıl</span>
                  </div>

                  <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <span>12.000 TL yerine 10.000 TL (Yılda 2.000 ₺ tasarruf)</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3.5 mb-8">
                  <p className="text-xs font-semibold uppercase tracking-wider text-subtle">
                    Dahil Olan Özellikler:
                  </p>
                  <ul className="space-y-3">
                    {yearlyFeatures.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-emphasis">
                        <Check className="size-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
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
                  className="w-full justify-center rounded-[10px] py-2.5 text-sm font-medium shadow-sm">
                  {isLoggedIn ? "Panele Git" : "Yıllık Avantajla Başla"}
                  <ArrowRight className="ml-2 size-4" />
                </Button>
                <p className="text-center text-xs text-subtle mt-2.5">Aylık yaklaşık 833 ₺'ye denk gelir.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-subtle/80 bg-default/60 py-10 mt-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-subtle">
          <div className="flex items-center gap-2">
            <Logo small />
            <span className="text-xs">
              © {new Date().getFullYear()} {APP_NAME}. Tüm hakları saklıdır.
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <Link href="#pricing" className="hover:text-emphasis transition">
              Fiyatlandırma
            </Link>
            <Link href="/auth/login" className="hover:text-emphasis transition">
              Giriş Yap
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
