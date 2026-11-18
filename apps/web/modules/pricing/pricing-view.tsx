"use client";

import { trpc } from "@rondevu/trpc/react";
import { CheckCircle2, Clock, MessageCircle, Plus } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MarketingFooter } from "../home/components/MarketingFooter";
import { PlanContactModal } from "../home/components/PlanContactModal";
import type { Locale } from "../home/i18n/home-translations";

interface PlanContactData {
  phone: string;
  email: string;
  whatsapp: string;
}

interface PricingViewProps {
  html: string;
  svgTemplates: string;
  isLoggedIn?: boolean;
  initialContact?: PlanContactData;
  initialLocale: Locale;
}

interface FaqItem {
  q: string;
  a: string;
}

const TRUST_COPY: Record<Locale, { cardFree: string; sameDay: string; whatsapp: string }> = {
  tr: {
    cardFree: "Kredi kartı gerekmez",
    sameDay: "Aynı gün kurulum",
    whatsapp: "WhatsApp üzerinden anında aktivasyon",
  },
  en: {
    cardFree: "No credit card required",
    sameDay: "Same-day setup",
    whatsapp: "Instant activation via WhatsApp",
  },
};

const FAQ_COPY: Record<Locale, { heading: string; subheading: string; items: FaqItem[] }> = {
  tr: {
    heading: "Sıkça Sorulan Sorular",
    subheading: "Paket kapsamı, ödeme adımları ve kurulum süreciyle ilgili merak edilenler.",
    items: [
      {
        q: "Ödeme ve kredi kartı süreci nasıl işliyor?",
        a: "Sayfa üzerinden planınızı seçtiğinizde kart bilgisi girmeniz gerekmez. WhatsApp, telefon veya e-posta üzerinden ekibimizle iletişime geçtiğinizde hesabınız aynı gün içinde tanımlanır ve aktivasyon tamamlanır.",
      },
      {
        q: "Aylık ve yıllık paketler arasında özellik farkı var mı?",
        a: "Hayır. Özel alan adı (CNAME), WhatsApp bildirimleri, SMS doğrulaması, Google ve Outlook takvim bağlantısı dahil tüm ürün özellikleri her iki pakette de birebir aynıdır.",
      },
      {
        q: "Yıllık plandaki 2 ay hediye ve fiyat sabitleme nasıl uygulanır?",
        a: "Aylık paket 990 ₺ iken yıllık pakette 10 ay ücretine karşılık gelen 9.900 ₺ ödersiniz. Böylece 2 ay ücretsiz kullanır, aylık 825 ₺ karşılığıyla fiyatınızı 1 yıl boyunca sabitlersiniz.",
      },
      {
        q: "Kurulum ne kadar sürer, mevcut takvimimi bağlayabilir miyim?",
        a: "Hesabınız aynı gün aktif edilir; randevu türlerinizi, çalışma saatlerinizi ve Google, Microsoft Outlook veya Apple takvim bağlantılarınızı birkaç dakika içinde hazır hale getirebilirsiniz.",
      },
      {
        q: "Aylık pakette taahhüt var mı, istediğimde iptal edebilir miyim?",
        a: "Aylık pakette taahhüt yoktur. İhtiyacınız değiştiğinde WhatsApp veya e-posta üzerinden bize yazarak aboneliğinizi bir sonraki dönem için kolayca sonlandırabilirsiniz.",
      },
    ],
  },
  en: {
    heading: "Frequently Asked Questions",
    subheading: "Quick answers about plan parity, activation, billing, and setup.",
    items: [
      {
        q: "How do payment and activation work?",
        a: "No credit card is required on this page. Once you select a plan and reach out via WhatsApp, phone, or email, our team activates your workspace the same day.",
      },
      {
        q: "Is there any feature difference between Monthly and Yearly?",
        a: "No. Every product feature, including Custom Domain (CNAME), WhatsApp notifications, SMS verification, and Google or Outlook calendar sync, is identical in both plans.",
      },
      {
        q: "How do the 2 free months and price lock work on the Yearly plan?",
        a: "Instead of paying 990 ₺ per month, the Yearly plan is 9.900 ₺ for 12 months (the cost of 10 months). You get 2 months free (825 ₺/mo equivalent) and lock in your rate for a full year.",
      },
      {
        q: "How long does setup take, and can I connect my existing calendar?",
        a: "Your account is activated the same day, and you can configure event types, availability rules, and Google, Microsoft Outlook, or Apple calendar sync within minutes.",
      },
      {
        q: "Is there a long-term commitment on the Monthly plan?",
        a: "There is no lock-in contract on the Monthly plan. You can cancel before your next billing period anytime by messaging our team via WhatsApp or email.",
      },
    ],
  },
};

interface StaticSvgTemplatesProps {
  svgTemplates: string;
}

const StaticSvgTemplates = memo(function StaticSvgTemplates({ svgTemplates }: StaticSvgTemplatesProps) {
  const markup = useMemo(() => ({ __html: svgTemplates }), [svgTemplates]);
  return <div id="svg-templates-container" dangerouslySetInnerHTML={markup} />;
});

interface StaticPricingBodyProps {
  html: string;
  locale: Locale;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const StaticPricingBody = memo(function StaticPricingBody({ html, locale, onClick }: StaticPricingBodyProps) {
  const markup = useMemo(() => ({ __html: html }), [html]);
  return <div id="cal-pricing-1to1-root" data-locale={locale} onClick={onClick} dangerouslySetInnerHTML={markup} />;
});

function PricingView({ html, svgTemplates, initialContact, initialLocale }: PricingViewProps) {
  const locale = initialLocale;
  const [modalPlanType, setModalPlanType] = useState<"monthly" | "yearly" | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const trustSectionRef = useRef<HTMLElement>(null);
  const faqSectionRef = useRef<HTMLElement>(null);

  // Fiyatlandırma CTA butonlarını aktif dile göre ("Planı Seç" / "Choose Plan") senkronize et
  useEffect(() => {
    const root = document.getElementById("cal-pricing-1to1-root");
    if (!root) return;
    const planBtns = root.querySelectorAll<HTMLElement>("[data-plan-btn='true']");
    const label = locale === "tr" ? "Planı Seç" : "Choose Plan";
    planBtns.forEach((btn) => {
      const p = btn.querySelector<HTMLElement>(".framer-text");
      if (p && p.textContent !== label) {
        p.textContent = label;
      }
    });
  }, [locale]);

  useEffect(() => {
    const root = document.getElementById("cal-pricing-1to1-root");
    if (!root) return;

    root.querySelectorAll<HTMLElement>(".framer-text").forEach((text) => {
      const label = text.textContent?.trim().toLocaleLowerCase(locale) ?? "";
      if (!label.startsWith("advanced features") && !label.startsWith("gelişmiş randevu özellikleri")) return;

      text.closest<HTMLElement>('[data-framer-name*="Row"]')?.classList.add("rondevu-feature-section-divider");
    });
  }, [locale]);

  // Hero dışındaki alt bölümler için prefers-reduced-motion uyumlu scroll-reveal (+ scroll fallback)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const candidates = [
      document.getElementById("feature-breakdown"),
      trustSectionRef.current,
      faqSectionRef.current,
    ].filter((el): el is HTMLElement => el !== null);

    if (candidates.length === 0) return;

    const prefersReducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
      candidates.forEach((el) => {
        el.classList.remove("rondevu-pricing-reveal");
        el.classList.add("is-visible");
      });
      return;
    }

    const revealIfVisible = (el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.96) {
        el.classList.add("is-visible");
        return true;
      }
      return false;
    };

    const pending = new Set<HTMLElement>();
    candidates.forEach((el) => {
      el.classList.add("rondevu-pricing-reveal");
      if (!revealIfVisible(el)) {
        pending.add(el);
      }
    });

    if (pending.size === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight) {
            const target = entry.target as HTMLElement;
            target.classList.add("is-visible");
            pending.delete(target);
            observer.unobserve(target);
          }
        });
      },
      { threshold: 0.01, rootMargin: "0px 0px -16px 0px" }
    );

    pending.forEach((el) => observer.observe(el));

    const checkVisible = () => {
      pending.forEach((el) => {
        if (revealIfVisible(el)) {
          pending.delete(el);
          observer.unobserve(el);
        }
      });
      if (pending.size === 0) {
        window.removeEventListener("scroll", checkVisible);
      }
    };

    window.addEventListener("scroll", checkVisible, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", checkVisible);
      candidates.forEach((el) => el.classList.remove("rondevu-pricing-reveal", "is-visible"));
    };
  }, [locale]);

  const { data: contactConfig } = trpc.viewer.public.getPlanContact.useQuery(undefined, {
    staleTime: 30000,
  });

  const resolvedContact = contactConfig ?? initialContact;
  const rawPhone = resolvedContact?.phone;
  const phone = rawPhone && rawPhone !== "0850 000 00 00" ? rawPhone : "0552 119 19 87";
  const email = resolvedContact?.email || "destek@rondevu.org";
  const rawWhatsapp = resolvedContact?.whatsapp;
  const whatsapp =
    rawWhatsapp && rawWhatsapp !== "908500000000" ? rawWhatsapp : "905521191987";

  // Framer DOM içindeki etkileşimli tıklamaları yakalama (Paket Seçimi & İletişim Modalı)
  const handleContainerClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;

    // 1. data-plan niteliği taşıyan butonlar (yeni sekme/orta tık linke gitsin)
    const planTrigger = target.closest("[data-plan]") as HTMLElement | null;
    if (planTrigger) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      const plan = planTrigger.getAttribute("data-plan");
      if (plan !== "monthly" && plan !== "yearly") return;
      setModalPlanType(plan);
      return;
    }

    // 2. Kart bağlantıları ve sayfa içi kontroller
    const anchor = target.closest("a, button") as HTMLElement | null;
    if (!anchor) return;

    const href = anchor.getAttribute("href") || "";

    // Özellik karşılaştırma tablosuna kaydırma
    if (href.includes("#feature-breakdown")) {
      e.preventDefault();
      const el = document.getElementById("feature-breakdown");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleModalClose = (): void => {
    setModalPlanType(null);
  };

  const trust = TRUST_COPY[locale];
  const faq = FAQ_COPY[locale];

  return (
    <div className="relative min-h-screen bg-white dark:bg-[#141414] text-emphasis selection:bg-brand-default selection:text-brand transition-colors duration-200">
      {/* Cal.com SVG Şablonları */}
      <StaticSvgTemplates svgTemplates={svgTemplates} />

      {/* 1:1 Cal.com Pricing Sayfa Gövdesi */}
      <StaticPricingBody html={html} locale={locale} onClick={handleContainerClick} />

      {/* Güven Bandı */}
      <section
        ref={trustSectionRef}
        aria-label={locale === "tr" ? "Kurulum ve ödeme güvencesi" : "Setup and billing assurance"}
        className="mx-auto mt-10 w-full max-w-[1112px] px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 rounded-2xl border border-[#e5e5e5] bg-[#fafafa] px-5 py-4 text-sm font-medium text-[#242424] dark:border-white/10 dark:bg-[#181818] dark:text-[#e4e4e7]">
          <span className="inline-flex items-center gap-2">
            <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <span>{trust.cardFree}</span>
          </span>
          <span className="hidden text-[#a3a3a3] sm:inline dark:text-white/25" aria-hidden="true">
            ·
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <span>{trust.sameDay}</span>
          </span>
          <span className="hidden text-[#a3a3a3] sm:inline dark:text-white/25" aria-hidden="true">
            ·
          </span>
          <span className="inline-flex items-center gap-2">
            <MessageCircle className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <span>{trust.whatsapp}</span>
          </span>
        </div>
      </section>

      {/* Fiyatlandırma Sıkça Sorulan Sorular Akordeonu */}
      <section
        ref={faqSectionRef}
        aria-labelledby="rondevu-pricing-faq-title"
        className="mx-auto mb-16 mt-12 w-full max-w-[1112px] px-4 sm:px-6">
        <div className="rounded-2xl border border-[#e5e5e5] bg-white p-6 dark:border-white/10 dark:bg-[#181818] sm:p-8">
          <div className="mb-6">
            <h2
              id="rondevu-pricing-faq-title"
              className="font-cal text-2xl font-semibold tracking-tight text-[#181818] dark:text-[#f4f4f5] sm:text-3xl">
              {faq.heading}
            </h2>
            <p className="mt-1.5 text-sm text-[#737373] dark:text-[#a3a3a3]">{faq.subheading}</p>
          </div>

          <div className="divide-y divide-[#e5e5e5] border-t border-[#e5e5e5] dark:divide-white/10 dark:border-white/10">
            {faq.items.map((item, idx) => {
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
                    className="flex w-full items-center justify-between gap-4 py-4 text-left text-[15px] font-medium text-[#181818] transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#737373] dark:text-[#f4f4f5] dark:hover:text-white">
                    <span>{item.q}</span>
                    <Plus
                      aria-hidden="true"
                      className={`size-4 shrink-0 text-[#737373] transition-transform duration-200 motion-reduce:transition-none dark:text-[#a3a3a3] ${
                        isOpen ? "rotate-45 text-[#181818] dark:text-white" : "rotate-0"
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
                      <p className="pb-4 pr-8 text-sm leading-relaxed text-[#52525b] dark:text-[#a1a1aa]">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <MarketingFooter locale={locale} initialContact={initialContact} />

      {/* Admin Panelinden Dinamik İletişim Modalı (Ödeme Geçidi Yoktur) */}
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
