"use client";

import { trpc } from "@calcom/trpc/react";
import { useEffect, useState } from "react";
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

function PricingView({ html, svgTemplates, initialContact, initialLocale }: PricingViewProps) {
  const locale = initialLocale;
  const [modalPlanType, setModalPlanType] = useState<"monthly" | "yearly" | null>(null);

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
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;

    // 1. data-plan niteliği taşıyan butonlar
    const planTrigger = target.closest("[data-plan]") as HTMLElement | null;
    if (planTrigger) {
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
  };

  const handleModalClose = (): void => {
    setModalPlanType(null);
  };

  return (
    <div className="relative min-h-screen bg-white dark:bg-[#141414] text-emphasis selection:bg-brand-default selection:text-brand transition-colors duration-200">
      {/* Cal.com SVG Şablonları */}
      <div id="svg-templates-container" dangerouslySetInnerHTML={{ __html: svgTemplates }} />

      {/* 1:1 Cal.com Pricing Sayfa Gövdesi */}
      <div
        id="cal-pricing-1to1-root"
        data-locale={locale}
        onClick={handleContainerClick}
        dangerouslySetInnerHTML={{ __html: html }}
      />
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
