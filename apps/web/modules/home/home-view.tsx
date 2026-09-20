"use client";

import { APP_NAME } from "@calcom/lib/constants";
import classNames from "@calcom/ui/classNames";
import { Button } from "@calcom/ui/components/button";
import { Logo } from "@calcom/ui/components/logo";
import { ArrowRight, Calendar, Check, Link2, ShieldCheck } from "lucide-react";
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
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
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

  const highlights = [
    {
      icon: Link2,
      title: "Biyografi Linkiyle Paylaşım",
      description:
        "Randevu linkinizi Instagram veya WhatsApp profilinize koyun. Danışanınız gün ve saat seçerek randevusunu saniyeler içinde alsın.",
    },
    {
      icon: Calendar,
      title: "Google Takvim ve Meet",
      description:
        "Takviminizle eşzamanlı çalışır. Dolu saatleri otomatik kapatır, randevu oluştuğunda toplantı linkini (Google Meet) iki tarafa da anında iletir.",
    },
    {
      icon: ShieldCheck,
      title: "No-Show ve Kötüye Kullanım Koruması",
      description:
        "Randevusuna mazeretsiz gelmeyen veya suistimal eden kişileri tek tıkla engelleyin, takviminizin boşa kilitlenmesini önleyin.",
    },
  ];

  const monthlyFeatures = [
    "Sınırsız randevu ve etkinlik türü",
    "Google Takvim ve Google Meet entegrasyonu",
    "Özel randevu linki (rondevu.org/adiniz)",
    "Otomatik e-posta bildirimleri",
    "Katılımcı engelleme (No-Show koruması)",
  ];

  const yearlyFeatures = [
    "Aylık plandaki tüm özellikler dahil",
    "12 ay boyunca fiyat artışından etkilenmeme",
    "2 ay ücretsiz kullanım (1.980 ₺ avantaj)",
    "Öncelikli doğrudan WhatsApp desteği",
  ];

  return (
    <div className="relative min-h-screen bg-default text-emphasis selection:bg-brand-default selection:text-brand">
      <BackgroundGrid />

      {/* Header / Navbar */}
      <header className="relative sticky top-0 z-20 border-subtle/80 border-b bg-default/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            aria-label="rOndevu Anasayfa"
            className="flex items-center gap-2 transition-opacity hover:opacity-85">
            <Logo />
          </Link>

          <nav aria-label="Ana Menü" className="flex items-center gap-3">
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
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* 1. Ekran: Hero Section */}
        <section aria-labelledby="hero-title" className="pt-20 pb-16 text-center sm:pt-28 sm:pb-24">
          <div className="mb-6 inline-flex items-center rounded-full border border-subtle bg-muted/40 px-3.5 py-1 text-xs font-medium text-subtle">
            <span>Bireysel Uzmanlar İçin Randevu Altyapısı</span>
          </div>

          <h1
            id="hero-title"
            className="mx-auto max-w-3xl font-bold font-cal text-4xl text-emphasis leading-[1.14] tracking-tight sm:text-5xl md:text-6xl">
            Müsait saatlerinizi paylaşın, randevuyu danışanınız alsın.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl font-normal text-base text-subtle leading-relaxed sm:text-lg">
            Takviminizi bağlayın, linkinizi biyografinize ekleyin. Takviminiz danışanınızla otomatik eşleşsin;
            mesajla saat ayarlama derdi bitsin.
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

        {/* 1. Ekran: 3 Kart */}
        <section aria-labelledby="features-title" className="border-subtle/80 border-t py-16 sm:py-20">
          <h2 id="features-title" className="sr-only">
            Öne Çıkan Özellikler
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {highlights.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <article
                  key={idx}
                  className="rounded-xl border border-subtle bg-default/70 p-6 sm:p-7 shadow-sm transition hover:border-subtle/90">
                  <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-muted/60 text-emphasis">
                    <IconComponent className="size-5" />
                  </div>
                  <h3 className="mb-2 font-semibold text-base text-emphasis">{item.title}</h3>
                  <p className="text-sm text-subtle leading-relaxed">{item.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        {/* 2. Ekran: Fiyatlandırma Bölümü */}
        <section
          id="pricing"
          aria-labelledby="pricing-title"
          className="border-subtle/80 border-t py-16 sm:py-24">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="mb-3 inline-flex items-center rounded-full border border-subtle bg-muted/40 px-3 py-0.5 text-xs font-medium text-subtle">
              <span>Sabit Fiyat, Komisyonsuz</span>
            </div>
            <h2
              id="pricing-title"
              className="font-bold font-cal text-3xl text-emphasis tracking-tight sm:text-4xl">
              Planlar ve Fiyatlandırma
            </h2>
            <p className="mt-3 text-sm text-subtle sm:text-base">
              Randevu başı komisyon veya gizli ücret yok. Tüm özellikler iki planda da eksiksiz açık.
            </p>

            {/* Billing Cycle Toggle */}
            <div className="mt-6 inline-flex items-center rounded-full border border-subtle bg-muted/30 p-1">
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
                  "flex items-center gap-2 rounded-full px-4 py-1.5 font-medium text-xs transition sm:text-sm",
                  selectedBilling === "yearly"
                    ? "bg-default text-emphasis shadow-sm"
                    : "text-subtle hover:text-emphasis"
                )}>
                <span>Yıllık Faturalandırma</span>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 font-medium text-[11px] text-emerald-600 dark:text-emerald-400">
                  2 Ay Hediye
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="mx-auto grid max-w-4xl grid-cols-1 items-stretch gap-8 lg:grid-cols-2">
            {/* Aylık Plan Kartı (990 TL) */}
            <article
              className={classNames(
                "relative flex flex-col justify-between rounded-2xl border bg-default p-7 sm:p-9 shadow-sm transition",
                selectedBilling === "monthly" ? "border-emphasis ring-1 ring-emphasis" : "border-subtle"
              )}>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-bold font-cal text-emphasis text-xl">Aylık Plan</h3>
                  <span className="rounded border border-subtle px-2 py-0.5 font-medium text-xs text-subtle">
                    Taahhütsüz
                  </span>
                </div>
                <p className="mb-6 text-sm text-subtle">
                  Taahhütsüz kullanım; dilediğiniz zaman tek tıkla sonlandırın.
                </p>

                <div className="mb-6 flex items-baseline gap-1.5 border-subtle border-b pb-6">
                  <span className="font-bold font-cal text-4xl sm:text-5xl text-emphasis">990 ₺</span>
                  <span className="font-medium text-sm text-subtle">/ ay</span>
                </div>

                <ul className="mb-8 space-y-3">
                  {monthlyFeatures.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-emphasis text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-subtle" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <Button
                  href="/plan-bilgi?plan=monthly"
                  color="secondary"
                  className="w-full justify-center rounded-[10px] py-2.5 font-medium text-sm">
                  Aylık Planla Başla
                </Button>
              </div>
            </article>

            {/* Yıllık Plan Kartı (9.900 TL) */}
            <article
              className={classNames(
                "relative flex flex-col justify-between rounded-2xl border bg-default p-7 sm:p-9 shadow-sm transition",
                selectedBilling === "yearly" ? "border-emphasis ring-1 ring-emphasis" : "border-subtle"
              )}>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-bold font-cal text-emphasis text-xl">Yıllık Plan</h3>
                  <span className="rounded border border-subtle px-2 py-0.5 font-medium text-xs text-subtle">
                    12 Ay
                  </span>
                </div>
                <p className="mb-6 text-sm text-subtle">12 ay kesintisiz kullanım, 2 ay hediye.</p>

                <div className="mb-6 flex items-baseline gap-2.5 border-subtle border-b pb-6">
                  <span className="font-normal text-subtle text-xl line-through decoration-subtle/70 sm:text-2xl">
                    11.880 ₺
                  </span>
                  <span className="font-bold font-cal text-4xl sm:text-5xl text-emphasis">9.900 ₺</span>
                  <span className="font-medium text-sm text-subtle">/ yıl</span>
                </div>

                <ul className="mb-8 space-y-3">
                  {yearlyFeatures.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-emphasis text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-emphasis" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <Button
                  href="/plan-bilgi?plan=yearly"
                  color="primary"
                  className="w-full justify-center rounded-[10px] py-2.5 font-medium text-sm shadow-sm">
                  Yıllık Avantajla Başla
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </div>
            </article>
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

          <nav aria-label="Alt Bilgi Menüsü" className="flex items-center gap-6 text-xs">
            <Link href="#pricing" className="transition hover:text-emphasis">
              Fiyatlandırma
            </Link>
            <Link href="/auth/login" className="transition hover:text-emphasis">
              Giriş Yap
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
