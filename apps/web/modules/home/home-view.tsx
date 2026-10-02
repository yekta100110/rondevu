"use client";

import { APP_NAME } from "@calcom/lib/constants";
import { trpc } from "@calcom/trpc/react";
import classNames from "@calcom/ui/classNames";
import { Button } from "@calcom/ui/components/button";
import { Logo } from "@calcom/ui/components/logo";
import {
  ArrowRight,
  Calendar,
  Check,
  ChevronDown,
  Globe,
  Mail,
  MessageSquare,
  Phone,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { FaqSection } from "./components/FaqSection";
import { HeroBookingMockup } from "./components/HeroBookingMockup";
import { ProcessSteps } from "./components/ProcessSteps";

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
  const [showMonthlyFeatures, setShowMonthlyFeatures] = useState(false);
  const [showYearlyFeatures, setShowYearlyFeatures] = useState(false);

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
    "Sınırsız randevu ve hizmet türü",
    "Google ve Apple Takvim eşitleme",
    "SMS ve e-posta ile otomatik hatırlatma",
    "SMS ile müşteri doğrulama",
    "Kendi web adresinizi bağlama (ör. doktorayse.com)",
    "İzin günleri ve tatil yönetimi",
  ];

  const yearlyFeatures = [
    "Aylık plandaki tüm özellikler dahil",
    "2 ay ücretsiz kullanım",
    "12 ay sabit fiyat garantisi",
    "Öncelikli destek ve kurulum yardımı",
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
              href="#how-it-works"
              color="minimal"
              className="hidden rounded-[8px] px-3.5 py-2 font-medium text-sm text-subtle hover:text-emphasis md:inline-flex">
              Nasıl Çalışır?
            </Button>
            <Button
              href="#features"
              color="minimal"
              className="hidden rounded-[8px] px-3.5 py-2 font-medium text-sm text-subtle hover:text-emphasis sm:inline-flex">
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
        {/* 2. YENİ BÖLÜM: 3 ADIMLI SÜREÇ AKIŞ ŞEMASI */}
        {/* ========================================================= */}
        <ProcessSteps />

        {/* ========================================================= */}
        {/* 3. 4 TEMEL ÖZELLİK KARTI */}
        {/* ========================================================= */}
        <section
          id="features"
          aria-labelledby="features-title"
          className="border-subtle/80 border-t pt-14 pb-8 sm:pt-20 sm:pb-12">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2
              id="features-title"
              className="font-bold font-cal text-2xl sm:text-3xl text-emphasis tracking-tight">
              Tüm Gelişmiş Özellikler Standart
            </h2>
            <p className="mt-2 text-sm text-subtle leading-relaxed max-w-lg mx-auto">
              Karmaşık paketler veya gizli ücretler yok; randevu süreçlerinizin ihtiyaç duyduğu her şey tek
              platformda.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* 1. Google/Apple Takvim Eşitleme */}
            <div className="rounded-2xl border border-subtle bg-default p-6 sm:p-7 shadow-xs transition hover:border-emphasis/40 flex flex-col justify-between">
              <div>
                <div className="mb-4 flex size-10 items-center justify-center rounded-xl border border-subtle bg-muted/40 text-emphasis">
                  <Calendar className="size-5" />
                </div>
                <h3 className="font-bold font-cal text-emphasis text-lg">Google & Apple Takvim Eşitleme</h3>
                <p className="mt-2 text-xs sm:text-sm text-subtle leading-relaxed">
                  Çift yönlü anlık senkronizasyon ile randevularınız takviminize otomatik işlenir, saat
                  çakışmaları tamamen önlenir.
                </p>
              </div>
            </div>

            {/* 2. SMS, E-posta & WhatsApp Hatırlatma */}
            <div className="rounded-2xl border border-subtle bg-default p-6 sm:p-7 shadow-xs transition hover:border-emphasis/40 flex flex-col justify-between">
              <div>
                <div className="mb-4 flex size-10 items-center justify-center rounded-xl border border-subtle bg-muted/40 text-emphasis">
                  <MessageSquare className="size-5" />
                </div>
                <h3 className="font-bold font-cal text-emphasis text-lg">
                  SMS, E-posta & WhatsApp Hatırlatma
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-subtle leading-relaxed">
                  Müşteriye otomatik hatırlatma bildirimleri gönderilerek unutulan veya kaçırılan randevulara
                  son verilir.
                </p>
              </div>
            </div>

            {/* 3. Müşteri Doğrulama ve Sahte Randevu Koruması */}
            <div className="rounded-2xl border border-subtle bg-default p-6 sm:p-7 shadow-xs transition hover:border-emphasis/40 flex flex-col justify-between">
              <div>
                <div className="mb-4 flex size-10 items-center justify-center rounded-xl border border-subtle bg-muted/40 text-emphasis">
                  <ShieldCheck className="size-5" />
                </div>
                <h3 className="font-bold font-cal text-emphasis text-lg">
                  Müşteri Doğrulama & Sahte Randevu Koruması
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-subtle leading-relaxed">
                  SMS doğrulama koduyla sahte rezervasyonlar engellenir, takviminiz güvenle korunur.
                </p>
              </div>
            </div>

            {/* 4. Kendi Özel Alan Adınız */}
            <div className="rounded-2xl border border-subtle bg-default p-6 sm:p-7 shadow-xs transition hover:border-emphasis/40 flex flex-col justify-between">
              <div>
                <div className="mb-4 flex size-10 items-center justify-center rounded-xl border border-subtle bg-muted/40 text-emphasis">
                  <Globe className="size-5" />
                </div>
                <h3 className="font-bold font-cal text-emphasis text-lg">Kendi Özel Alan Adınız</h3>
                <p className="mt-2 text-xs sm:text-sm text-subtle leading-relaxed">
                  Kendi markanız ve alan adınız (ör. doktorayse.com) altında kesintisiz ve kurumsal randevu
                  alma deneyimi.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 4. FİYATLANDIRMA BÖLÜMÜ */}
        {/* ========================================================= */}
        <section
          id="pricing"
          aria-labelledby="pricing-title"
          className="border-subtle/80 border-t py-16 sm:py-24">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2
              id="pricing-title"
              className="font-bold font-cal text-3xl text-emphasis tracking-tight sm:text-4xl">
              Tek Fiyata Premium Erişim
            </h2>
            <p className="mt-3 text-sm text-subtle sm:text-base leading-relaxed">
              Kilitli paketler veya danışan başı komisyon yok; tüm özellikler her iki planda da standart
              olarak eksiksiz açıktır.
            </p>
          </div>

          {/* Pricing Cards Grid */}
          <div className="mx-auto grid max-w-4xl grid-cols-1 items-start gap-8 lg:grid-cols-2">
            {/* Aylık Plan Kartı (990 TL) */}
            <article className="relative flex flex-col justify-between rounded-2xl border border-subtle bg-default p-7 sm:p-9 shadow-sm transition hover:border-emphasis/40">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-bold font-cal text-emphasis text-xl">Aylık Ödeme</h3>
                </div>
                <p className="mb-6 text-sm text-subtle">
                  Tüm premium özellikler dahil; dilediğiniz zaman tek tıkla sonlandırın.
                </p>

                <div className="mb-6 flex items-baseline gap-1.5 border-subtle border-b pb-6">
                  <span className="font-bold font-cal text-4xl sm:text-5xl text-emphasis">990 ₺</span>
                  <span className="font-medium text-sm text-subtle">/ ay</span>
                </div>

                {/* Açılır / Kapanır Plan Özellikleri */}
                <button
                  type="button"
                  onClick={() => setShowMonthlyFeatures(!showMonthlyFeatures)}
                  className="mb-6 flex w-full items-center justify-between rounded-xl border border-subtle bg-muted/20 px-4 py-2.5 text-xs font-medium text-emphasis transition hover:bg-muted/40">
                  <span>Dahil Olan Özellikler ({monthlyFeatures.length})</span>
                  <ChevronDown
                    className={classNames(
                      "size-4 text-subtle transition-transform duration-200",
                      showMonthlyFeatures && "rotate-180"
                    )}
                  />
                </button>

                {showMonthlyFeatures && (
                  <ul className="mb-6 space-y-3 pt-1">
                    {monthlyFeatures.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-emphasis text-sm">
                        <Check className="mt-0.5 size-4 shrink-0 text-emphasis" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}
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
            <article className="relative flex flex-col justify-between rounded-2xl border border-subtle bg-default p-7 sm:p-9 shadow-sm transition hover:border-emphasis/40">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-bold font-cal text-emphasis text-xl">Yıllık Ödeme</h3>
                  <span className="rounded-full border border-subtle bg-muted/60 px-2.5 py-0.5 font-medium text-xs text-emphasis">
                    2 Ay Hediye
                  </span>
                </div>
                <p className="mb-6 text-sm text-subtle">
                  Tüm premium özellikler dahil; 12 ay kesintisiz kullanım ve sabit fiyat garantisi.
                </p>

                <div className="mb-6 flex items-baseline gap-2.5 border-subtle border-b pb-6">
                  <span className="font-normal text-subtle text-xl line-through decoration-subtle/70 sm:text-2xl">
                    11.880 ₺
                  </span>
                  <span className="font-bold font-cal text-4xl sm:text-5xl text-emphasis">9.900 ₺</span>
                  <span className="font-medium text-sm text-subtle">/ yıl</span>
                </div>

                {/* Açılır / Kapanır Plan Özellikleri */}
                <button
                  type="button"
                  onClick={() => setShowYearlyFeatures(!showYearlyFeatures)}
                  className="mb-6 flex w-full items-center justify-between rounded-xl border border-subtle bg-muted/20 px-4 py-2.5 text-xs font-medium text-emphasis transition hover:bg-muted/40">
                  <span>Dahil Olan Özellikler ({yearlyFeatures.length})</span>
                  <ChevronDown
                    className={classNames(
                      "size-4 text-subtle transition-transform duration-200",
                      showYearlyFeatures && "rotate-180"
                    )}
                  />
                </button>

                {showYearlyFeatures && (
                  <ul className="mb-6 space-y-3 pt-1">
                    {yearlyFeatures.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-emphasis text-sm">
                        <Check className="mt-0.5 size-4 shrink-0 text-emphasis" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}
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
                  Sorularınız veya Kurulum Desteği İçin
                </h3>
                <p className="text-xs text-subtle leading-relaxed">
                  Sistem yapılandırması ve detaylar için doğrudan ekibimize ulaşabilirsiniz.
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
            <Link href="#how-it-works" className="transition hover:text-emphasis">
              Nasıl Çalışır?
            </Link>
            <Link href="#features" className="transition hover:text-emphasis">
              Özellikler
            </Link>
            <Link href="#pricing" className="transition hover:text-emphasis">
              Fiyatlandırma
            </Link>
            <Link href="#faq" className="transition hover:text-emphasis">
              SSS
            </Link>
            <Link href="/privacy" className="transition hover:text-emphasis">
              Gizlilik Politikası
            </Link>
            <Link href="/tos" className="transition hover:text-emphasis">
              Kullanım Koşulları
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
