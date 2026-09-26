"use client";

import { APP_NAME } from "@calcom/lib/constants";
import { trpc } from "@calcom/trpc/react";
import classNames from "@calcom/ui/classNames";
import { Button } from "@calcom/ui/components/button";
import { Logo } from "@calcom/ui/components/logo";
import { ArrowRight, Check, Mail, MessageSquare, Phone, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AdminFeatureCards } from "./components/AdminFeatureCards";
import { FaqSection } from "./components/FaqSection";
import { HeroBookingMockup } from "./components/HeroBookingMockup";

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

export interface PlanContactData {
  phone: string;
  email: string;
  whatsapp: string;
}

interface HomeViewProps {
  isLoggedIn?: boolean;
  initialContact?: PlanContactData;
}

export function HomeView({ isLoggedIn = false, initialContact }: HomeViewProps) {
  const [selectedBilling, setSelectedBilling] = useState<"monthly" | "yearly">("yearly");

  const { data: contactConfig } = trpc.viewer.public.getPlanContact.useQuery(undefined, {
    initialData: initialContact,
    staleTime: 30000,
  });

  const phone = contactConfig?.phone || initialContact?.phone || "0552 119 19 87";
  const email = contactConfig?.email || initialContact?.email || "destek@rondevu.org";
  const whatsapp = contactConfig?.whatsapp || initialContact?.whatsapp || "905521191987";
  const cleanPhone = phone.replace(/[^\d+]/g, "");
  const cleanWhatsapp = whatsapp.replace(/[^\d]/g, "");

  const monthlyFeatures = [
    "Tüm özelliklere kısıtlamasız premium erişim",
    "Sınırsız randevu ve etkinlik türü",
    "SMS ve E-posta hatırlatıcı bildirimleri",
    "Google & Apple Takvim anlık çift yönlü eşitleme",
    "Telefon ve e-posta doğrulama (OTP koruması)",
    "No-show ('Katılmadı') danışan takibi & koruması",
    "Out of Office (Acil durum toplu iptal & SMS)",
    "Özel gün & bayram tatili kapatma",
    "Kendi alan adına bağlama (Custom Domain)",
    "Birebir kurulum ve uzman desteği",
  ];

  const yearlyFeatures = [
    "Aylık plandaki TÜM premium özellikler eksiksiz dahil",
    "Hiçbir özellik veya kullanım kısıtlaması yok",
    "2 ay ücretsiz kullanım (1.980 ₺ doğrudan tasarruf)",
    "12 ay boyunca fiyat artışından etkilenmeme garantisi",
    "Öncelikli birebir teknik kurulum ve WhatsApp desteği",
    "Özel takvim kuralı ve iş akışı yapılandırması",
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
              href="#features"
              color="minimal"
              className="hidden rounded-[8px] px-3.5 py-2 font-medium text-sm text-subtle hover:text-emphasis md:inline-flex">
              Özellikler
            </Button>
            <Button
              href="#pricing"
              color="minimal"
              className="hidden rounded-[8px] px-3.5 py-2 font-medium text-sm text-subtle hover:text-emphasis sm:inline-flex">
              Fiyatlandırma
            </Button>
            <Button
              href="#faq"
              color="minimal"
              className="hidden rounded-[8px] px-3.5 py-2 font-medium text-sm text-subtle hover:text-emphasis sm:inline-flex">
              SSS
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
        {/* ========================================================= */}
        {/* 1. HERO BÖLÜMÜ */}
        {/* ========================================================= */}
        <section aria-labelledby="hero-title" className="pt-20 pb-12 text-center sm:pt-24 sm:pb-16">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-subtle bg-muted/40 px-3.5 py-1 text-xs font-medium text-subtle">
            <span className="size-1.5 rounded-full bg-emphasis" />
            <span>Modern, Doğrulanmış ve Güvenli Randevu Deneyimi</span>
          </div>

          <h1
            id="hero-title"
            className="mx-auto max-w-4xl font-bold font-cal text-4xl text-emphasis leading-[1.14] tracking-tight sm:text-5xl md:text-6xl">
            Herkes için randevu sistemi
          </h1>

          <p className="mx-auto mt-6 max-w-2xl font-normal text-base text-subtle leading-relaxed sm:text-lg">
            Müsaitlik saatlerinizi belirleyin, kurallarınızı koyun; randevu alma, doğrulama, SMS hatırlatma ve
            takvim senkronizasyonunu tek merkezden yönetin.
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
              href="#features"
              color="secondary"
              className="rounded-[10px] px-5 py-2.5 font-medium text-sm">
              Özellikleri İncele
            </Button>
          </div>

          {/* Canlı Randevu Alma Akışı Simülasyonu (Ekran Görüntüleri İlhamlı Mockup) */}
          <HeroBookingMockup />
        </section>

        {/* ========================================================= */}
        {/* 2. 12 ÖZELLİĞİ İÇEREN 4 ANA OPERASYONEL BLOK */}
        {/* ========================================================= */}
        <div id="features" className="border-subtle/80 border-t pt-10 sm:pt-14">
          <div className="mx-auto mb-8 max-w-3xl text-center">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-subtle bg-muted/40 px-3.5 py-1 text-xs font-medium text-emphasis shadow-2xs">
              <Sparkles className="size-3.5 text-emphasis" />
              <span>Tek Fiyata Premium Erişim</span>
            </div>
            <h2 className="font-bold font-cal text-2xl sm:text-3xl text-emphasis tracking-tight">
              Yapay Plan Kısıtlamaları Yok, Tüm Altyapı Elinizin Altında
            </h2>
            <p className="mt-2.5 text-xs sm:text-sm text-subtle leading-relaxed max-w-xl mx-auto">
              rOndevu'da "bu özellik sadece üst planda var" anlayışı veya gizli sınırlar yoktur.
              Geliştirdiğimiz tüm güçlü araçlar ve güvenlik önlemleri her kullanıcımıza standart olarak
              eksiksiz açılır.
            </p>
          </div>
          <AdminFeatureCards contactConfig={contactConfig} />
        </div>

        {/* ========================================================= */}
        {/* 3. FİYATLANDIRMA BÖLÜMÜ */}
        {/* ========================================================= */}
        <section
          id="pricing"
          aria-labelledby="pricing-title"
          className="border-subtle/80 border-t py-16 sm:py-24">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-subtle bg-muted/40 px-3.5 py-1 text-xs font-medium text-emphasis shadow-2xs">
              <Sparkles className="size-3.5 text-emphasis" />
              <span>Tek Fiyata Premium Erişim</span>
            </div>
            <h2
              id="pricing-title"
              className="font-bold font-cal text-3xl text-emphasis tracking-tight sm:text-4xl">
              Farklı Planlar veya Kısıtlamalar Yok: Tek Fiyata Premium Erişim
            </h2>
            <p className="mt-3 text-sm text-subtle sm:text-base leading-relaxed">
              rOndevu'da kısıtlanmış özellikler, kilitli paketler veya danışan başı komisyon yoktur. İster
              aylık ister yıllık tercih edin; tüm randevu, takvim, SMS, güvenlik ve alan adı altyapısına
              hiçbir erişim kısıtlaması olmadan tek fiyata premium erişirsiniz.
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
                <span className="rounded-full border border-subtle bg-muted/60 px-2 py-0.5 font-medium text-[11px] text-emphasis">
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
                  <h3 className="font-bold font-cal text-emphasis text-xl">Aylık Ödeme</h3>
                  <span className="rounded border border-subtle px-2 py-0.5 font-medium text-xs text-subtle">
                    Kısıtlama Yok · Taahhütsüz
                  </span>
                </div>
                <p className="mb-6 text-sm text-subtle">
                  Farklı paket veya kısıtlama yok; tüm premium özellikler dahil. Dilediğiniz zaman tek tıkla
                  sonlandırın.
                </p>

                <div className="mb-6 flex items-baseline gap-1.5 border-subtle border-b pb-6">
                  <span className="font-bold font-cal text-4xl sm:text-5xl text-emphasis">990 ₺</span>
                  <span className="font-medium text-sm text-subtle">/ ay</span>
                </div>

                <ul className="mb-8 space-y-3">
                  {monthlyFeatures.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-emphasis text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-emphasis" />
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
                  <h3 className="font-bold font-cal text-emphasis text-xl">Yıllık Ödeme</h3>
                  <span className="rounded border border-subtle px-2 py-0.5 font-medium text-xs text-subtle">
                    Kısıtlama Yok · 2 Ay Hediye
                  </span>
                </div>
                <p className="mb-6 text-sm text-subtle">
                  Tüm premium özellikler dahil; 12 ay kesintisiz kullanım, 2 ay hediye ve sabit fiyat
                  garantisi.
                </p>

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

          {/* Plan İletişim & Kurulum Danışma Barı (Admin Paneli ile Senkron) */}
          <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-subtle bg-muted/20 p-6 sm:p-7">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div className="space-y-1">
                <h3 className="font-semibold text-emphasis text-sm sm:text-base">
                  Planlar veya Özel Kurulum Hakkında Bilgi Alın
                </h3>
                <p className="text-xs text-subtle leading-relaxed">
                  Sorularınız, kurumsal ihtiyaçlarınız veya sistem yapılandırması için doğrudan bize
                  ulaşabilirsiniz.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <a
                  href={`tel:${cleanPhone}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-subtle bg-default px-3 py-1.5 text-xs font-medium text-emphasis hover:bg-muted/50 transition shadow-xs">
                  <Phone className="size-3.5 text-subtle" />
                  <span>{phone}</span>
                </a>
                <a
                  href={`https://wa.me/${cleanWhatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-subtle bg-default px-3 py-1.5 text-xs font-medium text-emphasis hover:bg-muted/50 transition shadow-xs">
                  <MessageSquare className="size-3.5 text-subtle" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-subtle bg-default px-3 py-1.5 text-xs font-medium text-emphasis hover:bg-muted/50 transition shadow-xs">
                  <Mail className="size-3.5 text-subtle" />
                  <span>{email}</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 4. SIKÇA SORULAN SORULAR (FAQ) BÖLÜMÜ */}
        {/* ========================================================= */}
        <div id="faq">
          <FaqSection />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-subtle/80 border-t bg-default/60 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-subtle sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Logo small />
            <span className="text-xs">© {new Date().getFullYear()} rOndevu. Tüm hakları saklıdır.</span>
          </div>

          <nav aria-label="Alt Bilgi Menüsü" className="flex flex-wrap items-center gap-6 text-xs">
            <Link href="#features" className="transition hover:text-emphasis">
              Özellikler
            </Link>
            <Link href="#pricing" className="transition hover:text-emphasis">
              Fiyatlandırma
            </Link>
            <Link href="#faq" className="transition hover:text-emphasis">
              SSS
            </Link>
            <a href={`mailto:${email}`} className="transition hover:text-emphasis">
              İletişim ({email})
            </a>
            <Link href="/auth/login" className="transition hover:text-emphasis">
              Giriş Yap
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
