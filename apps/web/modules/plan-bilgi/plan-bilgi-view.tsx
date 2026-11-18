"use client";

import { APP_NAME } from "@rondevu/lib/constants";
import { trpc } from "@rondevu/trpc/react";
import { Button } from "@rondevu/ui/components/button";
import { Logo } from "@rondevu/ui/components/logo";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Globe, Mail, MessageCircle, Phone, Sparkles } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Locale } from "../home/i18n/home-translations";

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

interface PlanBilgiViewProps {
  initialContact?: PlanContactInfo;
  initialLocale?: Locale;
}

export interface PlanContactInfo {
  phone: string;
  email: string;
  whatsapp: string;
}

export function PlanBilgiView({ initialContact, initialLocale = "tr" }: PlanBilgiViewProps = {}) {
  const searchParams = useSearchParams();
  const plan = searchParams?.get("plan");
  const langParam = searchParams?.get("lang");
  const locale: Locale = langParam === "en" ? "en" : langParam === "tr" ? "tr" : initialLocale;
  const isEn = locale === "en";
  const isYearly = plan === "yearly";

  const homeHref = isEn ? "/en" : "/";
  const pricingHref = isEn ? "/en/pricing" : "/pricing";
  const switchLocaleHref = (() => {
    const params = new URLSearchParams();
    if (!isEn) params.set("lang", "en");
    if (plan === "monthly" || plan === "yearly") params.set("plan", plan);
    const qs = params.toString();
    return qs ? `/plan-bilgi?${qs}` : "/plan-bilgi";
  })();

  const { data: contactConfig } = trpc.viewer.public.getPlanContact.useQuery(undefined, {
    staleTime: 30000,
  });

  const resolvedContact = contactConfig ?? initialContact;
  const rawPhone = resolvedContact?.phone;
  const phone = rawPhone && rawPhone !== "0850 000 00 00" ? rawPhone : "0552 119 19 87";
  const email = resolvedContact?.email || "destek@rondevu.org";
  const rawWhatsapp = resolvedContact?.whatsapp;
  const whatsapp = rawWhatsapp && rawWhatsapp !== "908500000000" ? rawWhatsapp : "905521191987";

  const cleanPhone = phone.replace(/[^\d+]/g, "");
  const cleanWhatsapp = whatsapp.replace(/[^\d]/g, "");

  const whatsappMessage = isEn
    ? `Hello, I am reaching out to activate my rOndevu ${isYearly ? "Yearly Plan" : "Monthly Plan"} account.`
    : `Merhaba, rOndevu ${isYearly ? "Yıllık Plan" : "Aylık Plan"} hesap aktivasyonu için yazıyorum.`;

  const emailSubject = isEn
    ? `rOndevu Account Activation (${isYearly ? "Yearly Plan" : "Monthly Plan"})`
    : `rOndevu Hesap Aktivasyonu (${isYearly ? "Yıllık Plan" : "Aylık Plan"})`;

  return (
    <div className="relative min-h-screen bg-default text-emphasis selection:bg-brand-default selection:text-brand">
      <BackgroundGrid />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-20 border-subtle/80 border-b bg-default/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href={homeHref}
            aria-label={isEn ? "rOndevu Home" : "rOndevu Ana Sayfa"}
            className="flex items-center gap-2 transition-opacity hover:opacity-85">
            <Logo />
          </Link>

          <nav aria-label={isEn ? "Page Menu" : "Sayfa Menüsü"} className="flex items-center gap-1.5 sm:gap-3">
            <Link
              href={switchLocaleHref}
              hrefLang={isEn ? "tr" : "en"}
              lang={isEn ? "tr" : "en"}
              className="inline-flex items-center gap-1 rounded-[8px] px-2.5 py-2 font-medium text-xs sm:text-sm text-subtle transition-colors hover:text-emphasis">
              <Globe className="size-3.5" aria-hidden="true" />
              <span>{isEn ? "Türkçe" : "English"}</span>
            </Link>
            <Button
              href={homeHref}
              color="minimal"
              className="rounded-[8px] px-2.5 sm:px-3.5 py-2 font-medium text-xs sm:text-sm text-subtle hover:text-emphasis">
              <ArrowLeft className="mr-1.5 size-4" aria-hidden="true" />
              {isEn ? "Home" : "Ana Sayfa"}
            </Button>
            <Button
              href="/auth/login"
              color="primary"
              className="rounded-[8px] px-3 sm:px-4 py-2 font-medium text-xs sm:text-sm shadow-sm">
              {isEn ? "Sign In" : "Giriş Yap"}
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
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-subtle bg-muted/40 px-3 py-0.5 text-xs font-medium text-emphasis shadow-2xs">
                <Sparkles className="size-3 text-emphasis" />
                <span>
                  {isEn
                    ? `Full Access at One Price · ${isYearly ? "Yearly Billing" : "Monthly Billing"}`
                    : `Tek Fiyata Premium Erişim · ${isYearly ? "Yıllık Ödeme" : "Aylık Ödeme"}`}
                </span>
              </div>
              <h1 className="font-bold font-display text-3xl text-emphasis tracking-tight sm:text-4xl">
                {isEn ? "Account Activation" : "Hesap Aktivasyonu"}
              </h1>
              <p className="mt-3 text-base text-subtle leading-relaxed">
                {isEn
                  ? "rOndevu is a commission-free online appointment scheduling and calendar management platform for doctors, lawyers, psychologists, and independent consultants. Both monthly and yearly plans include every feature without restrictions; reach out and we will activate your account and send your personal booking link."
                  : "rOndevu; doktorlar, avukatlar, psikologlar ve bağımsız danışmanlar için komisyonsuz çalışan çevrimiçi randevu ve takvim yönetim platformudur. Aylık ve yıllık planlarda tüm özellikler kısıtlamasız sunulur; hesabınızı hemen açıp profil linkinizi teslim edelim."}
              </p>
            </div>

            {/* Plan Summary */}
            <div className="mb-8 rounded-xl border border-subtle bg-muted/20 p-5">
              <div className="flex items-baseline justify-between border-subtle border-b pb-3 mb-3">
                <span className="font-medium text-sm text-emphasis">
                  {isEn
                    ? isYearly
                      ? "Yearly Plan (2 Months Free)"
                      : "Monthly Plan (Flexible)"
                    : isYearly
                      ? "Yıllık Tercih (2 Ay Hediye)"
                      : "Aylık Tercih (Taahhütsüz)"}
                </span>
                <span className="font-semibold text-emphasis text-base">
                  {isEn
                    ? isYearly
                      ? "9.900 ₺ / yr"
                      : "990 ₺ / mo"
                    : isYearly
                      ? "9.900 ₺ / yıl"
                      : "990 ₺ / ay"}
                </span>
              </div>
              <ul className="space-y-2 text-xs text-subtle">
                <li className="flex items-center gap-2">
                  <Check className="size-3.5 text-emphasis shrink-0" />
                  <span className="font-medium text-emphasis">
                    {isEn
                      ? "Unrestricted access to all scheduling features"
                      : "Tüm özelliklere kısıtlamasız erişim"}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3.5 text-subtle shrink-0" />
                  <span>
                    {isEn
                      ? "Google Calendar, Apple Calendar, Outlook & Google Meet, Zoom, Teams, rOndevu Video sync"
                      : "Google Takvim, Apple Calendar, Outlook ve Google Meet, Zoom, Teams, rOndevu Video entegrasyonu"}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3.5 text-subtle shrink-0" />
                  <span>
                    {isEn
                      ? "WhatsApp, SMS, and email notifications with 6-digit SMS OTP verification"
                      : "WhatsApp, SMS ve e-posta bildirimleri, OTP doğrulama koruması"}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3.5 text-subtle shrink-0" />
                  <span>
                    {isEn
                      ? "Custom domain mapping (CNAME) and personal bio booking link"
                      : "Özel alan adı bağlama (CNAME) ve kişisel profil bağlantısı"}
                  </span>
                </li>
                {isYearly && (
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-subtle shrink-0" />
                    <span>
                      {isEn
                        ? "2 months free usage and 12-month fixed price guarantee"
                        : "2 ay ücretsiz kullanım ve 12 ay sabit fiyat garantisi"}
                    </span>
                  </li>
                )}
              </ul>
            </div>

            {/* Direct Contact Channels */}
            <section aria-labelledby="contact-heading" className="space-y-4">
              <h2 id="contact-heading" className="font-semibold text-emphasis text-sm">
                {isEn ? "Direct Contact Channels" : "Doğrudan İletişim Kanalları"}
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Phone & WhatsApp */}
                <div className="flex flex-col justify-between rounded-xl border border-subtle bg-default p-5 transition hover:border-subtle/90">
                  <div>
                    <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-muted/50 text-emphasis">
                      <Phone className="size-4" />
                    </div>
                    <div className="font-semibold text-emphasis text-sm">
                      {isEn ? "Phone & WhatsApp" : "Telefon & WhatsApp"}
                    </div>
                    <p className="mt-0.5 text-xs text-subtle">
                      {isEn ? "Quick call or WhatsApp message" : "Hızlı arama veya WhatsApp mesajı"}
                    </p>
                    <div className="mt-3 font-mono font-medium text-base text-emphasis">{phone}</div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 pt-1">
                    <a
                      href={`tel:${cleanPhone}`}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-[8px] bg-emphasis px-3 py-2 font-medium text-default text-xs transition hover:opacity-90 shadow-sm">
                      <Phone className="size-3.5" />
                      <span>{isEn ? "Call" : "Ara"}</span>
                    </a>
                    <a
                      href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(whatsappMessage)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-[8px] border border-subtle bg-default px-3 py-2 font-medium text-emphasis text-xs transition hover:bg-muted/40">
                      <MessageCircle className="size-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col justify-between rounded-xl border border-subtle bg-default p-5 transition hover:border-subtle/90">
                  <div>
                    <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-muted/50 text-emphasis">
                      <Mail className="size-4" />
                    </div>
                    <div className="font-semibold text-emphasis text-sm">{isEn ? "Email" : "E-posta"}</div>
                    <p className="mt-0.5 text-xs text-subtle">
                      {isEn ? "Send an activation request" : "Aktivasyon talebi iletmek için"}
                    </p>
                    <div className="mt-3 font-mono font-medium text-base text-emphasis break-all">
                      {email}
                    </div>
                  </div>

                  <div className="mt-4 pt-1">
                    <a
                      href={`mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(emailSubject)}`}
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-[8px] border border-subtle bg-default px-3 py-2 font-medium text-emphasis text-xs transition hover:bg-muted/40">
                      <Mail className="size-3.5" />
                      <span>{isEn ? "Send Email" : "E-posta Gönder"}</span>
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* How It Works & Quick FAQ */}
            <section
              aria-labelledby="how-it-works-heading"
              className="mt-8 space-y-5 border-subtle/80 border-t pt-6">
              <div>
                <h2 id="how-it-works-heading" className="font-semibold text-emphasis text-sm">
                  {isEn ? "How It Works" : "Nasıl Çalışır?"}
                </h2>
                <ol className="mt-2.5 space-y-1.5 text-xs text-subtle leading-relaxed">
                  <li>
                    <span className="font-medium text-emphasis">
                      {isEn ? "1. Contact & Plan Selection:" : "1. İletişim ve Plan Seçimi:"}
                    </span>{" "}
                    {isEn
                      ? "Share your preference for the monthly or yearly plan via phone, WhatsApp, or email."
                      : "Telefon, WhatsApp veya e-posta üzerinden aylık ya da yıllık plan tercihinizi iletin."}
                  </li>
                  <li>
                    <span className="font-medium text-emphasis">
                      {isEn ? "2. Fast Onboarding:" : "2. Hızlı Kurulum:"}
                    </span>{" "}
                    {isEn
                      ? "Your personal booking link, calendar sync, and optional custom domain (CNAME) are ready the same day."
                      : "Kişisel randevu linkiniz, takvim bağlantınız ve isterseniz özel alan adınız (CNAME) aynı gün hazırlanır."}
                  </li>
                  <li>
                    <span className="font-medium text-emphasis">
                      {isEn ? "3. Commission-Free Scheduling:" : "3. Komisyonsuz Kullanım:"}
                    </span>{" "}
                    {isEn
                      ? "Clients book with SMS verification while WhatsApp, SMS, and email reminders go out automatically."
                      : "Danışanlarınız SMS doğrulaması ile randevu alır; WhatsApp, SMS ve e-posta hatırlatmaları otomatik iletilir."}
                  </li>
                </ol>
              </div>

              <div>
                <h2 className="font-semibold text-emphasis text-sm">
                  {isEn ? "Quick FAQ" : "Kısa Sıkça Sorulan Sorular"}
                </h2>
                <dl className="mt-2.5 space-y-3 text-xs">
                  <div>
                    <dt className="font-medium text-emphasis">
                      {isEn
                        ? "Is there any feature difference between monthly and yearly plans?"
                        : "Aylık ve yıllık paket arasında özellik farkı var mı?"}
                    </dt>
                    <dd className="mt-0.5 text-subtle leading-relaxed">
                      {isEn
                        ? "No. Every feature—including custom domain (CNAME), SMS OTP, WhatsApp/SMS/email notifications, and calendar sync—is identical in both plans; the yearly plan gives you 2 months free."
                        : "Hayır. Özel alan adı (CNAME), SMS OTP, WhatsApp/SMS/e-posta bildirimleri ve takvim senkronizasyonu dahil tüm özellikler her iki pakette de eşittir; yıllık pakette 2 ay ücretsiz fiyat avantajı sunulur."}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-emphasis">
                      {isEn
                        ? "Are there any per-booking commissions?"
                        : "Randevu başına komisyon alınıyor mu?"}
                    </dt>
                    <dd className="mt-0.5 text-subtle leading-relaxed">
                      {isEn
                        ? "No. Beyond the flat monthly (990 ₺) or yearly (9.900 ₺) plan, there are zero per-booking fees or commissions."
                        : "Hayır, sabit aylık (990 ₺) veya yıllık (9.900 ₺) plan dışında randevu başına komisyon yoktur."}
                    </dd>
                  </div>
                </dl>
              </div>
            </section>

            {/* Bottom Note */}
            <div className="mt-8 flex items-center justify-between border-subtle/80 border-t pt-5 text-xs text-subtle">
              <span>{isEn ? "We respond promptly." : "Talebiniz hızla yanıtlanır."}</span>
              <Link href={pricingHref} className="font-medium text-emphasis hover:underline">
                {isEn ? "← Back to pricing" : "← Planlara geri dön"}
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
          <Link href={homeHref} className="transition hover:text-emphasis">
            {isEn ? "Home" : "Ana Sayfa"}
          </Link>
        </div>
      </footer>
    </div>
  );
}
