"use client";

import { APP_NAME } from "@calcom/lib/constants";
import { Button } from "@calcom/ui/components/button";
import { Logo } from "@calcom/ui/components/logo";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Mail, MessageCircle, Phone, Sparkles } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function BackgroundGrid() {
  const rows = 10;
  const cols = 18;
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
          <radialGradient id="planGridFade" cx="50%" cy="40%" rx="65%" ry="60%">
            <stop offset="10%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="planGridMask">
            <rect width={width} height={height} fill="url(#planGridFade)" />
          </mask>
        </defs>
        <g mask="url(#planGridMask)">
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

export function PlanBilgiView() {
  const searchParams = useSearchParams();
  const plan = searchParams?.get("plan");
  const isYearly = plan === "yearly";

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
              href="/"
              color="minimal"
              className="rounded-[8px] px-3.5 py-2 font-medium text-sm text-subtle hover:text-emphasis">
              <ArrowLeft className="mr-1.5 size-4" />
              Anasayfa
            </Button>
            <Button
              href="/auth/login"
              color="primary"
              className="rounded-[8px] px-4 py-2 font-medium text-sm shadow-sm">
              Giriş Yap
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-3xl px-4 pt-12 pb-24 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8">
          {/* Card */}
          <div className="overflow-hidden rounded-2xl border border-subtle bg-default p-7 shadow-sm sm:p-10">
            {/* Top Badge */}
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-subtle bg-cal-muted px-3 py-1 font-medium text-subtle text-xs">
              <Sparkles className="size-3.5 text-emphasis" />
              <span>
                {isYearly ? "Yıllık Avantajlı Plan (9.900 ₺ / yıl)" : "Aylık Esnek Plan (990 ₺ / ay)"}
              </span>
            </div>

            <h1 className="font-bold font-cal text-3xl text-emphasis tracking-tight sm:text-4xl">
              Plan Aktivasyonu ve Danışma
            </h1>

            <p className="mt-3 text-base text-subtle leading-relaxed">
              {APP_NAME} üzerinde randevularınızı hemen planlamaya başlamak, hesap aktivasyonunuzu
              tamamlamak veya aklınıza takılanları sormak için bize dilediğiniz zaman ulaşabilirsiniz.
            </p>

            {/* Plan Highlights */}
            <div className="mt-6 rounded-xl border border-subtle/80 bg-cal-muted/50 p-4 sm:p-5">
              <h2 className="mb-2 font-semibold text-emphasis text-sm">Seçilen Plan Özeti:</h2>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-subtle">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                  <span>
                    Ücret:{" "}
                    <strong className="text-emphasis">
                      {isYearly ? "9.900 ₺ / yıl (2 ay hediye)" : "990 ₺ / ay"}
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Sınırsız randevu ve takvim senkronizasyonu</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Öncelikli destek ve hızlı kurulum</span>
                </div>
              </div>
            </div>

            {/* Contact Options */}
            <div className="mt-8 space-y-4">
              <h2 className="font-semibold text-emphasis text-base">İletişim & Danışma Kanalları</h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Phone Card */}
                <div className="flex flex-col justify-between rounded-xl border border-subtle bg-default p-5 transition hover:border-subtle/80">
                  <div>
                    <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-cal-muted text-emphasis">
                      <Phone className="size-5" />
                    </div>
                    <div className="font-semibold text-emphasis text-sm">Telefon & WhatsApp</div>
                    <p className="mt-1 text-xs text-subtle">Hızlı arama veya WhatsApp mesajı</p>
                    <div className="mt-3 font-mono font-semibold text-base text-emphasis">
                      0552 119 19 87
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 pt-2">
                    <a
                      href="tel:05521191987"
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-[8px] bg-emphasis px-3 py-2 font-medium text-default text-xs transition hover:opacity-90 shadow-sm">
                      <Phone className="size-3.5" />
                      <span>Ara</span>
                    </a>
                    <a
                      href="https://wa.me/905521191987?text=Merhaba%2C%20rOndevu%20plan%20aktivasyonu%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-[8px] border border-subtle bg-default px-3 py-2 font-medium text-emphasis text-xs transition hover:bg-cal-muted">
                      <MessageCircle className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* Email Card */}
                <div className="flex flex-col justify-between rounded-xl border border-subtle bg-default p-5 transition hover:border-subtle/80">
                  <div>
                    <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-cal-muted text-emphasis">
                      <Mail className="size-5" />
                    </div>
                    <div className="font-semibold text-emphasis text-sm">E-posta</div>
                    <p className="mt-1 text-xs text-subtle">Aktivasyon ve faturalandırma talepleri</p>
                    <div className="mt-3 font-mono font-semibold text-base text-emphasis break-all">
                      y_ekta@icloud.com
                    </div>
                  </div>

                  <div className="mt-4 pt-2">
                    <a
                      href="mailto:y_ekta@icloud.com?subject=rOndevu%20Plan%20Aktivasyonu"
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-[8px] border border-subtle bg-default px-3 py-2 font-medium text-emphasis text-xs transition hover:bg-cal-muted">
                      <Mail className="size-3.5" />
                      <span>E-posta Gönder</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Return Link */}
            <div className="mt-10 flex items-center justify-between border-subtle/80 border-t pt-6 text-xs text-subtle">
              <span>Talepleriniz en kısa sürede değerlendirilip yanıtlanır.</span>
              <Link href="/" className="font-medium text-emphasis hover:underline">
                ← Planlara geri dön
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
