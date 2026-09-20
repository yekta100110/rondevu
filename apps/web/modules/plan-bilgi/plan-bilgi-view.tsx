"use client";

import { APP_NAME } from "@calcom/lib/constants";
import { Button } from "@calcom/ui/components/button";
import { Logo } from "@calcom/ui/components/logo";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Mail, MessageCircle, Phone } from "lucide-react";
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
          <Link
            href="/"
            aria-label="rOndevu Anasayfa"
            className="flex items-center gap-2 transition-opacity hover:opacity-85">
            <Logo />
          </Link>

          <nav aria-label="Sayfa Menüsü" className="flex items-center gap-3">
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
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-2xl px-4 pt-12 pb-24 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
          <article className="rounded-2xl border border-subtle bg-default p-7 sm:p-10 shadow-sm">
            {/* Header */}
            <div className="mb-6">
              <div className="mb-3 inline-flex items-center rounded-full border border-subtle bg-muted/40 px-3 py-0.5 text-xs font-medium text-subtle">
                <span>{isYearly ? "Yıllık Plan (9.900 ₺ / yıl)" : "Aylık Plan (990 ₺ / ay)"}</span>
              </div>
              <h1 className="font-bold font-cal text-3xl text-emphasis tracking-tight sm:text-4xl">
                Hesap Aktivasyonu
              </h1>
              <p className="mt-3 text-base text-subtle leading-relaxed">
                Hesabınızı hemen açıp profil linkinizi teslim edelim. Başlamak veya aklınıza takılanları
                sormak için doğrudan bize yazabilirsiniz.
              </p>
            </div>

            {/* Plan Özeti */}
            <div className="mb-8 rounded-xl border border-subtle bg-muted/20 p-5">
              <div className="flex items-baseline justify-between border-subtle border-b pb-3 mb-3">
                <span className="font-medium text-sm text-emphasis">
                  {isYearly ? "Yıllık Plan Tercihi" : "Aylık Plan Tercihi"}
                </span>
                <span className="font-semibold text-emphasis text-base">
                  {isYearly ? "9.900 ₺ / yıl" : "990 ₺ / ay"}
                </span>
              </div>
              <ul className="space-y-2 text-xs text-subtle">
                <li className="flex items-center gap-2">
                  <Check className="size-3.5 text-subtle shrink-0" />
                  <span>Google Takvim ve Google Meet tam entegrasyonu</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3.5 text-subtle shrink-0" />
                  <span>Özel biyografi linki (rondevu.org/adiniz)</span>
                </li>
                {isYearly && (
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-subtle shrink-0" />
                    <span>2 ay ücretsiz kullanım ve öncelikli destek</span>
                  </li>
                )}
              </ul>
            </div>

            {/* İletişim Kanalları */}
            <section aria-labelledby="contact-heading" className="space-y-4">
              <h2 id="contact-heading" className="font-semibold text-emphasis text-sm">
                Doğrudan İletişim Kanalları
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Telefon & WhatsApp */}
                <div className="flex flex-col justify-between rounded-xl border border-subtle bg-default p-5 transition hover:border-subtle/90">
                  <div>
                    <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-muted/50 text-emphasis">
                      <Phone className="size-4" />
                    </div>
                    <div className="font-semibold text-emphasis text-sm">Telefon & WhatsApp</div>
                    <p className="mt-0.5 text-xs text-subtle">Hızlı arama veya WhatsApp mesajı</p>
                    <div className="mt-3 font-mono font-medium text-base text-emphasis">0552 119 19 87</div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 pt-1">
                    <a
                      href="tel:05521191987"
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-[8px] bg-emphasis px-3 py-2 font-medium text-default text-xs transition hover:opacity-90 shadow-sm">
                      <Phone className="size-3.5" />
                      <span>Ara</span>
                    </a>
                    <a
                      href={`https://wa.me/905521191987?text=${encodeURIComponent(
                        `Merhaba, rOndevu ${isYearly ? "Yıllık Plan" : "Aylık Plan"} hesap aktivasyonu için yazıyorum.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-[8px] border border-subtle bg-default px-3 py-2 font-medium text-emphasis text-xs transition hover:bg-muted/40">
                      <MessageCircle className="size-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* E-posta */}
                <div className="flex flex-col justify-between rounded-xl border border-subtle bg-default p-5 transition hover:border-subtle/90">
                  <div>
                    <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-muted/50 text-emphasis">
                      <Mail className="size-4" />
                    </div>
                    <div className="font-semibold text-emphasis text-sm">E-posta</div>
                    <p className="mt-0.5 text-xs text-subtle">Aktivasyon talebi iletmek için</p>
                    <div className="mt-3 font-mono font-medium text-base text-emphasis break-all">
                      y_ekta@icloud.com
                    </div>
                  </div>

                  <div className="mt-4 pt-1">
                    <a
                      href={`mailto:y_ekta@icloud.com?subject=${encodeURIComponent(
                        `rOndevu Hesap Aktivasyonu (${isYearly ? "Yıllık Plan" : "Aylık Plan"})`
                      )}`}
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-[8px] border border-subtle bg-default px-3 py-2 font-medium text-emphasis text-xs transition hover:bg-muted/40">
                      <Mail className="size-3.5" />
                      <span>E-posta Gönder</span>
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* Alt Bilgi */}
            <div className="mt-8 flex items-center justify-between border-subtle/80 border-t pt-5 text-xs text-subtle">
              <span>Talebiniz hızla yanıtlanır.</span>
              <Link href="/" className="font-medium text-emphasis hover:underline">
                ← Planlara geri dön
              </Link>
            </div>
          </article>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-subtle/80 border-t bg-default/60 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 text-xs text-subtle sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Logo small />
            <span>
              © {new Date().getFullYear()} {APP_NAME}
            </span>
          </div>
          <Link href="/" className="transition hover:text-emphasis">
            Anasayfa
          </Link>
        </div>
      </footer>
    </div>
  );
}
