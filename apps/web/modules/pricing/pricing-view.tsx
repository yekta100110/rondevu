"use client";

import { trpc } from "@calcom/trpc/react";
import { useCallback, useEffect, useState } from "react";
import { Navbar } from "../home/components/Navbar";
import { PlanContactModal } from "../home/components/PlanContactModal";
import type { Locale } from "../home/i18n/home-translations";

interface PlanContactData {
  phone: string;
  email: string;
  whatsapp: string;
}

interface PricingViewProps {
  trHtml: string;
  enHtml: string;
  svgTemplates: string;
  isLoggedIn?: boolean;
  initialContact?: PlanContactData;
}

function PricingView({ trHtml, enHtml, svgTemplates, isLoggedIn = false, initialContact }: PricingViewProps) {
  const [locale, setLocale] = useState<Locale>("tr");
  const [modalPlanType, setModalPlanType] = useState<"monthly" | "yearly" | null>(null);

  const applySystemTheme = useCallback(() => {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (isDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      document.documentElement.style.backgroundColor = "#141414";
      document.body.style.backgroundColor = "#141414";
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      document.documentElement.style.backgroundColor = "#ffffff";
      document.body.style.backgroundColor = "#ffffff";
    }
  }, []);

  // Otomatik Dil ve Tema Tespiti
  useEffect(() => {
    let initialLoc: Locale = "tr";
    const browserLang = navigator.language?.toLowerCase() ?? "";
    if (browserLang.startsWith("en")) initialLoc = "en";
    localStorage.removeItem("app-locale");
    localStorage.removeItem("app-theme");
    setLocale(initialLoc);
    document.title = initialLoc === "tr" ? "Fiyatlandırma - rOndevu" : "Pricing - rOndevu";

    applySystemTheme();

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaChange = () => {
      applySystemTheme();
    };
    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, [applySystemTheme]);

  // Fiyatlandırma CTA butonlarını aktif dile göre ("Planı Seç" / "Choose Plan") senkronize et
  useEffect(() => {
    const root = document.getElementById("cal-1to1-pricing-root");
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

  // Both plans include the same individual features; normalize any missing
  // exported checkmark cells instead of implying plan-specific restrictions.
  useEffect(() => {
    const root = document.getElementById("cal-pricing-1to1-root");
    if (!root) return;

    const normalizeChecks = () => {
      root.querySelectorAll<HTMLElement>('#feature-breakdown [data-framer-name="Row"]').forEach((row) => {
        const firstCell = row.children[0] as HTMLElement | undefined;
        const featureText =
          firstCell?.dataset.framerName === "Feature Text Wrapper"
            ? firstCell
            : firstCell?.querySelector<HTMLElement>('[data-framer-name="Feature Text Wrapper"]');
        const isFeatureRow =
          (featureText?.querySelectorAll('[data-framer-component-type="RichTextContainer"]').length ?? 0) >=
          2;
        const cells = Array.from(row.children).slice(1) as HTMLElement[];
        if (!isFeatureRow || cells.length !== 2) return;

        cells.forEach((cell) => {
          if (
            cell.children.length === 1 &&
            cell.firstElementChild?.classList.contains("rondevu-feature-check")
          ) {
            return;
          }
          const check = document.createElement("span");
          check.className = "rondevu-feature-check";
          check.setAttribute("aria-label", locale === "tr" ? "Dahil" : "Included");
          check.textContent = "✓";
          cell.replaceChildren(check);
        });
      });
    };

    normalizeChecks();
    const observer = new MutationObserver(normalizeChecks);
    observer.observe(root, { childList: true, subtree: true });
    const timer = window.setTimeout(() => observer.disconnect(), 1200);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [locale]);

  // The exported Framer status badge contains an absolutely positioned remote
  // image without a positioned container. On the pricing layout that image can
  // stretch across the whole page and turn the footer link into an overlay.
  useEffect(() => {
    const root = document.getElementById("cal-pricing-1to1-root");
    if (!root) return;

    const label = locale === "tr" ? "Tüm Sistemler Aktif" : "All Systems Operational";
    root.querySelectorAll<HTMLElement>('[data-framer-name="Status Wrapper"]').forEach((status) => {
      status.classList.add("rondevu-status-link");
      status.setAttribute("title", label);
      const dot = document.createElement("span");
      dot.className = "rondevu-status-dot";
      dot.setAttribute("aria-hidden", "true");
      const text = document.createElement("span");
      text.className = "rondevu-status-label";
      text.textContent = label;
      status.replaceChildren(dot, text);
    });
  }, [locale]);

  const { data: contactConfig } = trpc.viewer.public.getPlanContact.useQuery(undefined, {
    initialData: initialContact,
    staleTime: 30000,
  });

  const phone = contactConfig?.phone || initialContact?.phone || "0552 119 19 87";
  const email = contactConfig?.email || initialContact?.email || "destek@rondevu.org";
  const whatsapp = contactConfig?.whatsapp || initialContact?.whatsapp || "905521191987";

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
      return;
    }

    // SSS Akordeon
    const questionTrigger = target.closest('[data-framer-name*="Question"]');
    if (questionTrigger) {
      const parent = questionTrigger.parentElement;
      const answerWrapper = parent?.querySelector('[data-framer-name*="Answer"]') as HTMLElement | null;
      if (answerWrapper) {
        const isHidden = answerWrapper.style.display === "none" || !answerWrapper.style.display;
        answerWrapper.style.display = isHidden ? "block" : "none";
      }
    }
  };

  const handleModalClose = (): void => {
    setModalPlanType(null);
  };

  return (
    <div className="relative min-h-screen bg-white dark:bg-[#141414] text-emphasis selection:bg-brand-default selection:text-brand transition-colors duration-200">
      {/* 1:1 Cal.com Framer Stylesheets */}
      <link rel="stylesheet" href="/cal_files/cal-framer.css" />
      <link rel="stylesheet" href="/cal_files/cal-pricing-framer.css" />

      {/* Cal.com SVG Şablonları */}
      <div id="svg-templates-container" dangerouslySetInnerHTML={{ __html: svgTemplates }} />

      {/* Ortak ve Tekil Navbar */}
      <Navbar locale={locale} isLoggedIn={isLoggedIn} />

      {/* 1:1 Cal.com Pricing Sayfa Gövdesi */}
      <div
        id="cal-pricing-1to1-root"
        onClick={handleContainerClick}
        dangerouslySetInnerHTML={{ __html: locale === "tr" ? trHtml : enHtml }}
      />

      {/* Admin Panelinden Dinamik İletişim Modalı (Ödeme Geçidi Yoktur) */}
      <PlanContactModal
        isOpen={modalPlanType !== null}
        onClose={handleModalClose}
        planType={modalPlanType || "monthly"}
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
