"use client";

import { trpc } from "@calcom/trpc/react";
import { Check, CheckCircle2, Clock, MessageCircle, Plus, Sparkles } from "lucide-react";
import { useCallback, useState } from "react";
import { MarketingFooter } from "../home/components/MarketingFooter";
import { MarketingHeader } from "../home/components/MarketingHeader";
import { PlanContactModal } from "../home/components/PlanContactModal";
import type { Locale } from "../home/i18n/home-translations";

interface PlanContactData {
  phone: string;
  email: string;
  whatsapp: string;
}

interface PricingViewProps {
  html?: string;
  svgTemplates?: string;
  isLoggedIn?: boolean;
  initialContact?: PlanContactData;
  initialLocale: Locale;
}

interface FaqItem {
  q: string;
  a: string;
}

interface TableRow {
  title: string;
  description: string;
  monthly: boolean | string;
  yearly: boolean | string;
}

interface PricingCopy {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  billingCycleLabel: string;
  monthlyToggle: string;
  yearlyToggle: string;
  yearlyFreeTag: string;

  monthlyPlanName: string;
  monthlyPrice: string;
  monthlyPeriod: string;
  monthlyDesc: string;
  monthlyNote: string;
  chooseMonthly: string;

  yearlyPill: string;
  yearlyPlanName: string;
  yearlyPrice: string;
  yearlyPeriod: string;
  yearlyMonthlyEquivalent: string;
  priceLockLabel: string;
  yearlyDesc: string;
  chooseYearly: string;

  featuresHeading: string;
  monthlyFeatures: string[];
  yearlyFeatures: string[];

  trustAriaLabel: string;
  trustCardFree: string;
  trustSameDay: string;
  trustWhatsapp: string;

  tableHeading: string;
  tableSubheading: string;
  tableColFeature: string;
  tableColMonthly: string;
  tableColYearly: string;
  tableRows: TableRow[];

  faqHeading: string;
  faqSubheading: string;
  faqItems: FaqItem[];

  closingTitle: string;
  closingSubtitle: string;
  chatWhatsapp: string;
  contactTeam: string;
}

const PRICING_COPY: Record<Locale, PricingCopy> = {
  tr: {
    heroBadge: "Tüm özellikler eşit · Gizli ücret yok",
    heroTitle: "Şeffaf, tek ve net fiyatlandırma",
    heroSubtitle:
      "İster aylık esneklikle başlayın, ister yıllık avantajla 2 ay hediye ve 1 yıl sabit fiyat güvencesi kazanın. Her iki planda da tüm ürün özellikleri eksiksiz sunulur.",
    billingCycleLabel: "Faturalandırma dönemi",
    monthlyToggle: "Aylık",
    yearlyToggle: "Yıllık",
    yearlyFreeTag: "2 ay hediye",

    monthlyPlanName: "Aylık Plan",
    monthlyPrice: "990 ₺",
    monthlyPeriod: "/ ay",
    monthlyDesc: "Taahhütsüz ve esnek. İhtiyacınız olduğunda dilediğiniz ay duraklatın veya sonlandırın.",
    monthlyNote: "Aylık periyotta ödenir, taahhüt gerektirmez.",
    chooseMonthly: "Aylık Planı Seç",

    yearlyPill: "2 ay ücretsiz · En çok tercih edilen",
    yearlyPlanName: "Yıllık Plan",
    yearlyPrice: "9.900 ₺",
    yearlyPeriod: "/ yıl",
    yearlyMonthlyEquivalent: "825 ₺ / ay karşılığı",
    priceLockLabel: "1 yıl sabit fiyat güvencesi",
    yearlyDesc:
      "10 ay ücretine 12 ay kesintisiz kullanım ve 1 yıl boyunca olası fiyat artışlarından tam korunma.",
    chooseYearly: "Yıllık Planı Seç",

    featuresHeading: "Plana dahil tüm özellikler",
    monthlyFeatures: [
      "Sınırsız randevu ve rezervasyon",
      "WhatsApp randevu bildirimleri ve hatırlatmalar",
      "SMS ile tek kullanımlık kod doğrulaması",
      "Google ve Microsoft Outlook takvim senkronizasyonu",
      "Özel alan adı (CNAME) desteği",
      "Ofis Dışı / İzinlerim yönetimi",
      "Çoklu dil (Türkçe ve İngilizce) arayüz",
    ],
    yearlyFeatures: [
      "Sınırsız randevu ve rezervasyon",
      "WhatsApp randevu bildirimleri ve hatırlatmalar",
      "SMS ile tek kullanımlık kod doğrulaması",
      "Google ve Microsoft Outlook takvim senkronizasyonu",
      "Özel alan adı (CNAME) desteği",
      "Ofis Dışı / İzinlerim yönetimi",
      "Çoklu dil (Türkçe ve İngilizce) arayüz",
      "2 ay hediye (10 ay öde, 12 ay kullan)",
      "1 yıl boyunca sabit fiyat güvencesi",
    ],

    trustAriaLabel: "Kurulum ve ödeme güvencesi",
    trustCardFree: "Kredi kartı gerekmez",
    trustSameDay: "Aynı gün kurulum",
    trustWhatsapp: "WhatsApp üzerinden anında aktivasyon",

    tableHeading: "Paket kapsamı ve özellik karşılaştırması",
    tableSubheading:
      "rOndevu'da yapay paket sınırları veya özellik kısıtlamaları yoktur. İki paket de aynı profesyonel araç setini sunar.",
    tableColFeature: "Özellik",
    tableColMonthly: "Aylık Plan",
    tableColYearly: "Yıllık Plan",
    tableRows: [
      {
        title: "Sınırsız Randevu & Rezervasyon",
        description: "Aylık randevu sayısı veya danışan kotası sınırı olmadan tam kullanım",
        monthly: true,
        yearly: true,
      },
      {
        title: "WhatsApp Randevu Bildirimleri",
        description: "Randevu oluşturma, hatırlatma ve güncelleme bildirimleri",
        monthly: true,
        yearly: true,
      },
      {
        title: "SMS ile Güvenli Doğrulama",
        description: "Rezervasyon esnasında tek kullanımlık kod ile gerçek müşteri teyidi",
        monthly: true,
        yearly: true,
      },
      {
        title: "Google & Outlook Takvim Senkronizasyonu",
        description: "Mevcut takvimlerinizle çift yönlü anlık çakışma kontrolü",
        monthly: true,
        yearly: true,
      },
      {
        title: "Özel Alan Adı (CNAME) Desteği",
        description: "randevu.sirketiniz.com gibi kendi alan adınız üzerinden profesyonel sunum",
        monthly: true,
        yearly: true,
      },
      {
        title: "Ofis Dışı / İzinlerim Yönetimi",
        description: "Tatiller, mola saatleri ve özel bloklanmış zaman dilimleri",
        monthly: true,
        yearly: true,
      },
      {
        title: "Çoklu Dil Deneyimi (TR / EN)",
        description: "Danışanlarınız için Türkçe ve İngilizce rezervasyon akışı",
        monthly: true,
        yearly: true,
      },
      {
        title: "Kurulum & Aktivasyon",
        description: "Aynı gün uzman ekibimiz tarafından çalışma alanının tanımlanması",
        monthly: "Aynı gün",
        yearly: "Aynı gün",
      },
      {
        title: "Fiyat Avantajı & Güvence",
        description: "Dönemsel tasarruf ve fiyat sabitleme avantajı",
        monthly: "Standart (990 ₺ / ay)",
        yearly: "2 ay hediye (825 ₺ / ay) + 1 yıl sabit fiyat",
      },
    ],

    faqHeading: "Sıkça Sorulan Sorular",
    faqSubheading: "Paket kapsamı, ödeme adımları ve kurulum süreciyle ilgili merak edilenler.",
    faqItems: [
      {
        q: "Ödeme ve kredi kartı süreci nasıl işliyor?",
        a: "Sayfa üzerinden planınızı seçtiğinizde kart bilgisi girmeniz gerekmez. WhatsApp, telefon veya e-posta üzerinden ekibimizle iletişime geçtiğinizde hesabınız aynı gün içinde tanımlanır ve aktivasyon tamamlanır.",
      },
      {
        q: "Aylık ve yıllık paketler arasında özellik farkı var mı?",
        a: "Hayır. Özel alan adı (CNAME), WhatsApp bildirimleri, SMS doğrulaması, Google ve Outlook takvim bağlantısı ile Ofis Dışı / İzinlerim yönetimi dahil tüm ürün özellikleri her iki pakette de birebir aynıdır.",
      },
      {
        q: "Yıllık plandaki 2 ay hediye ve fiyat sabitleme nasıl uygulanır?",
        a: "Aylık paket 990 ₺ iken yıllık pakette 10 ay ücretine karşılık gelen 9.900 ₺ ödersiniz. Böylece 2 ay ücretsiz kullanır, aylık 825 ₺ karşılığıyla fiyatınızı 1 yıl boyunca sabitlersiniz.",
      },
      {
        q: "Kurulum ne kadar sürer, mevcut takvimimi bağlayabilir miyim?",
        a: "Hesabınız aynı gün aktif edilir; randevu türlerinizi, çalışma saatlerinizi, ofis dışı izinlerinizi ve Google, Microsoft Outlook veya Apple takvim bağlantılarınızı birkaç dakika içinde hazır hale getirebilirsiniz.",
      },
      {
        q: "Aylık pakette taahhüt var mı, istediğimde iptal edebilir miyim?",
        a: "Aylık pakette taahhüt yoktur. İhtiyacınız değiştiğinde WhatsApp veya e-posta üzerinden bize yazarak aboneliğinizi bir sonraki dönem için kolayca sonlandırabilirsiniz.",
      },
    ],

    closingTitle: "Aklınıza takılan bir soru mu var?",
    closingSubtitle:
      "Ekibimizle WhatsApp veya telefon üzerinden doğrudan görüşerek sorularınızı yanıtlayabilir, randevu sisteminizi aynı gün aktif edebilirsiniz.",
    chatWhatsapp: "WhatsApp'tan Danışın",
    contactTeam: "Bizi Arayın",
  },
  en: {
    heroBadge: "Equal features · Zero hidden fees",
    heroTitle: "Transparent, simple, and honest pricing",
    heroSubtitle:
      "Start with flexible monthly billing or save with 2 free months and a 1-year price lock on the yearly plan. All product features are included identically in both options.",
    billingCycleLabel: "Billing frequency",
    monthlyToggle: "Monthly",
    yearlyToggle: "Yearly",
    yearlyFreeTag: "2 months free",

    monthlyPlanName: "Monthly Plan",
    monthlyPrice: "990 TL",
    monthlyPeriod: "/ month",
    monthlyDesc:
      "Flexible with no long-term commitment. Pause or cancel before your next period whenever you need.",
    monthlyNote: "Billed monthly with no lock-in contract.",
    chooseMonthly: "Choose Monthly Plan",

    yearlyPill: "2 months free · Most popular",
    yearlyPlanName: "Yearly Plan",
    yearlyPrice: "9.900 TL",
    yearlyPeriod: "/ year",
    yearlyMonthlyEquivalent: "825 TL / mo equivalent",
    priceLockLabel: "1-year price lock guarantee",
    yearlyDesc:
      "Pay upfront for 10 months, enjoy 2 months free, and protect your workspace from rate increases for a full year.",
    chooseYearly: "Choose Yearly Plan",

    featuresHeading: "Included in this plan",
    monthlyFeatures: [
      "Unlimited appointments and reservations",
      "WhatsApp appointment notifications and reminders",
      "SMS one-time verification codes",
      "Google and Microsoft Outlook calendar sync",
      "Custom domain (CNAME) support",
      "Out of office / Leave management",
      "Multi-language (Turkish and English) booking flow",
    ],
    yearlyFeatures: [
      "Unlimited appointments and reservations",
      "WhatsApp appointment notifications and reminders",
      "SMS one-time verification codes",
      "Google and Microsoft Outlook calendar sync",
      "Custom domain (CNAME) support",
      "Out of office / Leave management",
      "Multi-language (Turkish and English) booking flow",
      "2 months free (pay for 10, get 12 months)",
      "Guaranteed price lock for 1 full year",
    ],

    trustAriaLabel: "Setup and billing assurance",
    trustCardFree: "No credit card required",
    trustSameDay: "Same-day setup",
    trustWhatsapp: "Instant activation via WhatsApp",

    tableHeading: "Feature parity and plan scope",
    tableSubheading:
      "rOndevu does not use artificial feature gates. Both plans give you the exact same professional scheduling toolkit.",
    tableColFeature: "Feature",
    tableColMonthly: "Monthly Plan",
    tableColYearly: "Yearly Plan",
    tableRows: [
      {
        title: "Unlimited Appointments & Reservations",
        description: "Full capacity without client limits or monthly booking caps",
        monthly: true,
        yearly: true,
      },
      {
        title: "WhatsApp Appointment Notifications",
        description: "Automatic confirmations, reminders, and schedule update messages",
        monthly: true,
        yearly: true,
      },
      {
        title: "SMS Verification",
        description: "One-time verification code to ensure legitimate client bookings",
        monthly: true,
        yearly: true,
      },
      {
        title: "Google & Outlook Calendar Sync",
        description: "Instant two-way synchronization to prevent double bookings",
        monthly: true,
        yearly: true,
      },
      {
        title: "Custom Domain (CNAME) Support",
        description: "Professional booking page under your own domain name",
        monthly: true,
        yearly: true,
      },
      {
        title: "Out of Office / Leave Management",
        description: "Flexible availability rules for holidays, vacations, and short breaks",
        monthly: true,
        yearly: true,
      },
      {
        title: "Multi-language Booking (TR / EN)",
        description: "Seamless Turkish and English interfaces for local and global clients",
        monthly: true,
        yearly: true,
      },
      {
        title: "Setup & Activation",
        description: "Same-day workspace configuration by our team",
        monthly: "Same day",
        yearly: "Same day",
      },
      {
        title: "Pricing Advantage & Price Lock",
        description: "Term savings and long-term price protection",
        monthly: "Standard (990 TL / mo)",
        yearly: "2 months free (825 TL / mo) + 1-year lock",
      },
    ],

    faqHeading: "Frequently Asked Questions",
    faqSubheading: "Quick answers about plan parity, activation, billing, and setup.",
    faqItems: [
      {
        q: "How do payment and activation work?",
        a: "No credit card is required on this page. Once you select a plan and reach out via WhatsApp, phone, or email, our team activates your workspace the same day.",
      },
      {
        q: "Is there any feature difference between Monthly and Yearly?",
        a: "No. Every product feature, including Custom Domain (CNAME), WhatsApp notifications, SMS verification, Google or Outlook calendar sync, and Out of office / Leave management, is identical in both plans.",
      },
      {
        q: "How do the 2 free months and price lock work on the Yearly plan?",
        a: "Instead of paying 990 TL per month, the Yearly plan is 9.900 TL for 12 months (the cost of 10 months). You get 2 months free (825 TL/mo equivalent) and lock in your rate for a full year.",
      },
      {
        q: "How long does setup take, and can I connect my existing calendar?",
        a: "Your account is activated the same day, and you can configure event types, working hours, out-of-office rules, and Google, Microsoft Outlook, or Apple calendar sync within minutes.",
      },
      {
        q: "Is there a long-term commitment on the Monthly plan?",
        a: "There is no lock-in contract on the Monthly plan. You can cancel before your next billing period anytime by messaging our team via WhatsApp or email.",
      },
    ],

    closingTitle: "Have questions before you begin?",
    closingSubtitle:
      "Talk directly with our team via WhatsApp or phone to get your scheduling live the same day.",
    chatWhatsapp: "Chat on WhatsApp",
    contactTeam: "Call Our Team",
  },
};

function PricingView({
  html: _html,
  svgTemplates: _svgTemplates,
  isLoggedIn = false,
  initialContact,
  initialLocale = "tr",
}: PricingViewProps) {
  const locale = initialLocale;
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [modalPlanType, setModalPlanType] = useState<"monthly" | "yearly" | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const { data: contactConfig } = trpc.viewer.public.getPlanContact.useQuery(undefined, {
    staleTime: 30000,
  });

  const resolvedContact = contactConfig ?? initialContact;
  const rawPhone = resolvedContact?.phone;
  const phone = rawPhone && rawPhone !== "0850 000 00 00" ? rawPhone : "0552 119 19 87";
  const email = resolvedContact?.email || "destek@rondevu.org";
  const rawWhatsapp = resolvedContact?.whatsapp;
  const whatsapp = rawWhatsapp && rawWhatsapp !== "908500000000" ? rawWhatsapp : "905521191987";
  const cleanWhatsapp = whatsapp.replace(/\D/g, "");

  const handleModalClose = useCallback((): void => {
    setModalPlanType(null);
  }, []);

  const t = PRICING_COPY[locale];

  return (
    <div className="relative min-h-screen bg-[#111214] text-[#f4f4f5] antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Ambient background accent */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.12),transparent_70%)]"
        aria-hidden="true"
      />

      {/* Ortak Üst Navigasyon */}
      <MarketingHeader
        locale={locale}
        isLoggedIn={isLoggedIn}
        onContactClick={() => setModalPlanType("monthly")}
      />

      <main className="relative pb-24">
        {/* Hero Bölümü */}
        <section className="mx-auto max-w-4xl px-4 pt-16 pb-10 text-center sm:px-6 sm:pt-20 sm:pb-12 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-zinc-300">
            <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
            <span>{t.heroBadge}</span>
          </div>

          <h1 className="mt-6 font-cal text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            {t.heroTitle}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            {t.heroSubtitle}
          </p>

          {/* Faturalandırma Dönemi Geçişi */}
          <div className="mt-8 flex items-center justify-center">
            <div
              role="tablist"
              aria-label={t.billingCycleLabel}
              className="inline-flex items-center rounded-xl border border-white/10 bg-[#18191d] p-1 text-xs font-medium">
              <button
                type="button"
                role="tab"
                aria-selected={billingCycle === "monthly"}
                onClick={() => setBillingCycle("monthly")}
                className={`rounded-lg px-4 py-2 transition-all duration-150 ${
                  billingCycle === "monthly"
                    ? "bg-white/10 font-semibold text-white shadow-xs"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}>
                {t.monthlyToggle}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={billingCycle === "yearly"}
                onClick={() => setBillingCycle("yearly")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 transition-all duration-150 ${
                  billingCycle === "yearly"
                    ? "bg-white/10 font-semibold text-white shadow-xs"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}>
                <span>{t.yearlyToggle}</span>
                <span className="rounded-md border border-emerald-500/30 bg-emerald-500/20 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
                  {t.yearlyFreeTag}
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Fiyatlandırma Kartları (Side-by-Side Grid) */}
        <section
          aria-label={locale === "tr" ? "Fiyatlandırma seçenekleri" : "Pricing options"}
          className="mx-auto mt-2 max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
            {/* Aylık Plan Kartı */}
            <div
              className={`relative flex flex-col justify-between rounded-2xl border bg-[#18191d] p-6 sm:p-8 transition-all duration-200 ${
                billingCycle === "monthly"
                  ? "border-white/30 shadow-lg shadow-black/40 ring-1 ring-white/20"
                  : "border-white/10 hover:border-white/20"
              }`}>
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="font-cal text-xl font-semibold text-white">{t.monthlyPlanName}</h2>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{t.monthlyDesc}</p>

                <div className="mt-6 flex items-baseline gap-1.5">
                  <span className="font-cal text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                    {t.monthlyPrice}
                  </span>
                  <span className="text-sm font-normal text-zinc-400">{t.monthlyPeriod}</span>
                </div>

                <p className="mt-2 text-xs text-zinc-400">{t.monthlyNote}</p>

                <button
                  type="button"
                  onClick={() => setModalPlanType("monthly")}
                  className="mt-6 w-full rounded-xl border border-white/15 bg-white/5 py-3 px-5 text-sm font-semibold text-white transition-all duration-150 hover:border-white/25 hover:bg-white/10 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20">
                  {t.chooseMonthly}
                </button>

                <div className="mt-8 border-t border-white/10 pt-6">
                  <p className="text-xs font-medium text-zinc-400">{t.featuresHeading}</p>
                  <ul className="mt-4 space-y-3 text-sm text-zinc-300">
                    {t.monthlyFeatures.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5">
                        <Check className="size-4 shrink-0 text-emerald-400 mt-0.5" aria-hidden="true" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Yıllık Plan Kartı (Öne Çıkan / 2 Ay Ücretsiz) */}
            <div
              className={`relative flex flex-col justify-between rounded-2xl border bg-[#18191d] p-6 sm:p-8 transition-all duration-200 ${
                billingCycle === "yearly"
                  ? "border-emerald-500/50 shadow-2xl shadow-emerald-950/30 ring-1 ring-emerald-500/30"
                  : "border-emerald-500/30 hover:border-emerald-400/50 shadow-lg shadow-emerald-950/20"
              }`}>
              {/* 2 Ay Ücretsiz Rozeti */}
              <div className="absolute -top-3.5 left-6 inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-zinc-950 shadow-md">
                <Sparkles className="size-3.5" aria-hidden="true" />
                <span>{t.yearlyPill}</span>
              </div>

              <div>
                <div className="flex items-center justify-between pt-1">
                  <h2 className="font-cal text-xl font-semibold text-white">{t.yearlyPlanName}</h2>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{t.yearlyDesc}</p>

                <div className="mt-6 flex items-baseline gap-1.5">
                  <span className="font-cal text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                    {t.yearlyPrice}
                  </span>
                  <span className="text-sm font-normal text-zinc-400">{t.yearlyPeriod}</span>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-emerald-400">
                  <span>{t.yearlyMonthlyEquivalent}</span>
                  <span className="text-zinc-500" aria-hidden="true">
                    ·
                  </span>
                  <span>{t.priceLockLabel}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setModalPlanType("yearly")}
                  className="mt-6 w-full rounded-xl bg-white py-3 px-5 text-sm font-semibold text-zinc-950 shadow-sm transition-all duration-150 hover:bg-zinc-100 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40">
                  {t.chooseYearly}
                </button>

                <div className="mt-8 border-t border-white/10 pt-6">
                  <p className="text-xs font-medium text-zinc-400">{t.featuresHeading}</p>
                  <ul className="mt-4 space-y-3 text-sm text-zinc-300">
                    {t.yearlyFeatures.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5">
                        <Check className="size-4 shrink-0 text-emerald-400 mt-0.5" aria-hidden="true" />
                        <span
                          className={
                            feat.includes("2 ay") ||
                            feat.includes("2 months") ||
                            feat.includes("sabit fiyat") ||
                            feat.includes("price lock")
                              ? "font-medium text-emerald-300"
                              : ""
                          }>
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Güven Bandı */}
        <section
          aria-label={t.trustAriaLabel}
          className="mx-auto mt-12 w-full max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-2xl border border-white/10 bg-[#18191d] px-6 py-4 text-sm font-medium text-zinc-300">
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="size-4 shrink-0 text-emerald-400" aria-hidden="true" />
              <span>{t.trustCardFree}</span>
            </span>
            <span className="hidden text-white/20 sm:inline" aria-hidden="true">
              ·
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock className="size-4 shrink-0 text-emerald-400" aria-hidden="true" />
              <span>{t.trustSameDay}</span>
            </span>
            <span className="hidden text-white/20 sm:inline" aria-hidden="true">
              ·
            </span>
            <span className="inline-flex items-center gap-2">
              <MessageCircle className="size-4 shrink-0 text-emerald-400" aria-hidden="true" />
              <span>{t.trustWhatsapp}</span>
            </span>
          </div>
        </section>

        {/* Net Kapsam Karşılaştırma Tablosu */}
        <section
          aria-labelledby="pricing-comparison-title"
          className="mx-auto mt-20 w-full max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center sm:mb-10">
            <h2
              id="pricing-comparison-title"
              className="font-cal text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {t.tableHeading}
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-zinc-400">{t.tableSubheading}</p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#18191d]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02]">
                    <th scope="col" className="py-4 px-6 font-semibold text-white">
                      {t.tableColFeature}
                    </th>
                    <th
                      scope="col"
                      className="w-36 py-4 px-6 text-center font-semibold text-zinc-300 sm:w-44">
                      {t.tableColMonthly}
                    </th>
                    <th
                      scope="col"
                      className="w-36 bg-emerald-500/[0.04] py-4 px-6 text-center font-semibold text-emerald-400 sm:w-44">
                      {t.tableColYearly}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {t.tableRows.map((row) => (
                    <tr key={row.title} className="transition-colors hover:bg-white/[0.015]">
                      <td className="py-4 px-6">
                        <div className="font-medium text-white">{row.title}</div>
                        <div className="mt-0.5 text-xs text-zinc-400">{row.description}</div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        {typeof row.monthly === "boolean" ? (
                          row.monthly ? (
                            <Check className="mx-auto size-4 text-emerald-400" aria-hidden="true" />
                          ) : (
                            <span className="text-xs text-zinc-500">—</span>
                          )
                        ) : (
                          <span className="text-xs font-medium text-zinc-300">{row.monthly}</span>
                        )}
                      </td>
                      <td className="bg-emerald-500/[0.02] py-4 px-6 text-center">
                        {typeof row.yearly === "boolean" ? (
                          row.yearly ? (
                            <Check className="mx-auto size-4 text-emerald-400" aria-hidden="true" />
                          ) : (
                            <span className="text-xs text-zinc-500">—</span>
                          )
                        ) : (
                          <span className="text-xs font-semibold text-emerald-400">{row.yearly}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Sıkça Sorulan Sorular Akordeonu */}
        <section
          aria-labelledby="pricing-faq-title"
          className="mx-auto mt-20 w-full max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-white/10 bg-[#18191d] p-6 sm:p-10">
            <div className="mb-8">
              <h2
                id="pricing-faq-title"
                className="font-cal text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                {t.faqHeading}
              </h2>
              <p className="mt-2 text-sm text-zinc-400">{t.faqSubheading}</p>
            </div>

            <div className="divide-y divide-white/10 border-t border-white/10">
              {t.faqItems.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                const panelId = `pricing-faq-panel-${idx}`;
                const triggerId = `pricing-faq-trigger-${idx}`;

                return (
                  <div key={item.q} className="py-1">
                    <button
                      id={triggerId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between gap-4 rounded-lg py-5 text-left text-[15px] font-medium text-white transition-colors hover:text-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50">
                      <span>{item.q}</span>
                      <Plus
                        aria-hidden="true"
                        className={`size-4 shrink-0 text-zinc-400 transition-transform duration-200 motion-reduce:transition-none ${
                          isOpen ? "rotate-45 text-white" : "rotate-0"
                        }`}
                      />
                    </button>
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={triggerId}
                      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}>
                      <div className="overflow-hidden">
                        <p className="pb-5 pr-8 text-sm leading-relaxed text-zinc-300">{item.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* İletişim & Danışma Çağrısı */}
        <section className="mx-auto mt-16 w-full max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#18191d] to-[#141518] p-8 text-center sm:p-10">
            <h3 className="font-cal text-xl font-semibold text-white sm:text-2xl">{t.closingTitle}</h3>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-zinc-400">{t.closingSubtitle}</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
                  locale === "tr"
                    ? "Merhaba, rOndevu paketleri hakkında bilgi almak istiyorum."
                    : "Hello, I would like information about rOndevu plans."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 shadow-sm transition hover:bg-emerald-400 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400">
                <MessageCircle className="size-4" aria-hidden="true" />
                <span>{t.chatWhatsapp}</span>
              </a>
              <button
                type="button"
                onClick={() => setModalPlanType("monthly")}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20">
                <span>{t.contactTeam}</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Ortak Alt Bilgi (Footer) */}
      <MarketingFooter locale={locale} initialContact={resolvedContact} />

      {/* Dinamik Plan İletişim Modalı */}
      <PlanContactModal
        isOpen={modalPlanType !== null}
        onClose={handleModalClose}
        planType={modalPlanType}
        locale={locale}
        phone={phone}
        email={email}
        whatsapp={whatsapp}
      />
    </div>
  );
}

export type { PlanContactData, PricingViewProps };
export { PricingView };
