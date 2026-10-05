"use client";

import { trpc } from "@calcom/trpc/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Navbar } from "./components/Navbar";
import { PlanContactModal } from "./components/PlanContactModal";
import type { Locale } from "./i18n/home-translations";

interface HomeViewProps {
  trHtml: string;
  enHtml: string;
  svgTemplates: string;
  isLoggedIn?: boolean;
}

function HomeView({ trHtml, enHtml, svgTemplates, isLoggedIn = false }: HomeViewProps) {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>("tr");
  const [modalPlanType, setModalPlanType] = useState<"monthly" | "yearly" | null>(null);
  const [systemTheme, setSystemTheme] = useState<"dark" | "light">("light");
  const [mounted, setMounted] = useState(false);

  const applySystemTheme = useCallback(() => {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setSystemTheme(isDark ? "dark" : "light");

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
    setMounted(true);

    // Browser language and color-scheme preferences determine the public marketing experience.
    let initialLoc: Locale = "tr";
    const browserLang = navigator.language?.toLowerCase() ?? "";
    if (browserLang.startsWith("en")) {
      initialLoc = "en";
    }
    localStorage.removeItem("app-locale");
    localStorage.removeItem("app-theme");
    setLocale(initialLoc);
    document.title =
      initialLoc === "tr"
        ? "rOndevu - Herkes İçin Randevu Sistemi"
        : "rOndevu - Clear & Simple Appointment Scheduling";

    applySystemTheme();

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaChange = () => {
      applySystemTheme();
    };
    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, [applySystemTheme]);

  // Hero preview follows the source page's complete appointment-state cycle without relying on Framer runtime hydration.
  useEffect(() => {
    if (!mounted) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const profiles =
      locale === "tr"
        ? [
            {
              name: "Dr. Ayşe Yılmaz",
              title: "Danışmanlık Seansı",
              description:
                "Danışmanlık, klinik veya bireysel randevularınız için rOndevu ile hemen başlayın.",
              durationIndex: 0,
              dateIndex: 14,
            },
            {
              name: "Uzm. Deniz Kaya",
              title: "İlk Değerlendirme",
              description: "İlk görüşmenizi seçin; uygun saati ve görüşme ayrıntılarını tek ekranda görün.",
              durationIndex: 1,
              dateIndex: 18,
            },
            {
              name: "Ece Demir",
              title: "Proje Planlama",
              description:
                "Projenizin sonraki adımlarını netleştirmek için kısa bir planlama görüşmesi ayarlayın.",
              durationIndex: 2,
              dateIndex: 21,
            },
            {
              name: "Mert Arslan",
              title: "Tanışma Görüşmesi",
              description: "İhtiyaçlarınızı konuşalım ve size uygun randevu akışını birlikte oluşturalım.",
              durationIndex: 3,
              dateIndex: 25,
            },
          ]
        : [
            {
              name: "Dr. Ayse Yilmaz",
              title: "Consultation Session",
              description:
                "Start scheduling your consultations, clinic visits, or personal appointments with rOndevu.",
              durationIndex: 0,
              dateIndex: 14,
            },
            {
              name: "Deniz Kaya",
              title: "Initial Assessment",
              description:
                "Choose your first session and see an available time with every meeting detail in one place.",
              durationIndex: 1,
              dateIndex: 18,
            },
            {
              name: "Ece Demir",
              title: "Project Planning",
              description: "Book a focused planning session to clarify the next steps for your project.",
              durationIndex: 2,
              dateIndex: 21,
            },
            {
              name: "Mert Arslan",
              title: "Introductory Call",
              description: "Let’s discuss your needs and shape the appointment flow that works for you.",
              durationIndex: 3,
              dateIndex: 25,
            },
          ];

    let activeIndex = 0;
    const transitionTimers = new Set<number>();

    const setPreviewText = (elements: NodeListOf<HTMLElement>, value: string) => {
      elements.forEach((element) => {
        if (element.textContent === value) return;
        element.classList.add("rondevu-hero-preview-changing");
        const timer = window.setTimeout(() => {
          element.textContent = value;
          element.classList.remove("rondevu-hero-preview-changing");
          transitionTimers.delete(timer);
        }, 140);
        transitionTimers.add(timer);
      });
    };

    const updatePreview = () => {
      const heroContainer = document.querySelector(".framer-647xse");
      if (!heroContainer) return;

      const profile = profiles[activeIndex];
      if (!profile) return;
      setPreviewText(
        heroContainer.querySelectorAll<HTMLElement>(".framer-hw592q .framer-text"),
        profile.name
      );
      setPreviewText(
        heroContainer.querySelectorAll<HTMLElement>(".framer-y52rve .framer-text"),
        profile.title
      );
      setPreviewText(
        heroContainer.querySelectorAll<HTMLElement>(".framer-cxfwa4 .framer-text"),
        profile.description
      );

      const durationPills = heroContainer.querySelectorAll<HTMLElement>(".framer-103r016 .framer-V26CA");
      if (durationPills.length > 0) {
        durationPills.forEach((pill, idx) => {
          if (idx === profile.durationIndex) {
            pill.setAttribute("data-framer-name", "Selected");
            pill.style.backgroundColor = document.documentElement.classList.contains("dark")
              ? "#27272a"
              : "#ffffff";
            pill.style.boxShadow = "0px 1px 3px 0px rgba(0, 0, 0, 0.1)";
            const textEl = pill.querySelector<HTMLElement>(".framer-text");
            if (textEl) {
              textEl.style.color = document.documentElement.classList.contains("dark")
                ? "#ffffff"
                : "rgb(16, 16, 16)";
            }
          } else {
            pill.setAttribute("data-framer-name", "Unselected");
            pill.style.backgroundColor = "transparent";
            pill.style.boxShadow = "none";
            const textEl = pill.querySelector<HTMLElement>(".framer-text");
            if (textEl) {
              textEl.style.color = "var(--token-73a9b904-5ed0-4590-a8cc-d5ddf2346358, rgb(137, 137, 137))";
            }
          }
        });
      }

      // Takvim günlerini de akışa uygun vurgula
      const dateItems = heroContainer.querySelectorAll<HTMLElement>(".framer-ste13c .framer-k4oXa");
      if (dateItems.length > 0) {
        dateItems.forEach((item, idx) => {
          const highlightEl = item.querySelector<HTMLElement>(".framer-156kf12");
          const dateText = item.querySelector<HTMLElement>(".framer-text");
          if (idx === profile.dateIndex && highlightEl && dateText) {
            highlightEl.style.backgroundColor = document.documentElement.classList.contains("dark")
              ? "rgba(255, 255, 255, 0.15)"
              : "rgba(0, 0, 0, 0.08)";
            dateText.style.fontWeight = "700";
          } else if (highlightEl && dateText && !item.getAttribute("data-original-selected")) {
            highlightEl.style.backgroundColor = "transparent";
            dateText.style.fontWeight = "500";
          }
        });
      }
    };

    updatePreview();
    const interval = setInterval(() => {
      activeIndex = (activeIndex + 1) % profiles.length;
      updatePreview();
    }, 3500);

    return () => {
      clearInterval(interval);
      transitionTimers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [locale, mounted]);

  // Restore the exported feature-preview motion without loading Framer's full runtime.
  useEffect(() => {
    if (!mounted || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const updateFeaturePreviews = () => {
      const root = document.getElementById("cal-1to1-root");
      if (!root) return;

      const calendarCards = root.querySelectorAll<HTMLElement>(
        '.framer-pry2jb [data-framer-name="To-do cards"]'
      );
      calendarCards.forEach((card, index) => {
        card.classList.toggle("rondevu-calendar-card-active", index === frame % calendarCards.length);
      });

      const notifications = root.querySelectorAll<HTMLElement>(
        '.framer-54l76e [data-framer-name="1"], .framer-54l76e [data-framer-name="2"], .framer-54l76e [data-framer-name="3"]'
      );
      notifications.forEach((notification, index) => {
        const notificationFrame = (frame + 1) % notifications.length;
        notification.classList.toggle("rondevu-notification-visible", index <= notificationFrame);
      });

      frame += 1;
    };

    updateFeaturePreviews();
    const interval = window.setInterval(updateFeaturePreviews, 2200);
    return () => window.clearInterval(interval);
  }, [locale, mounted]);

  // The exported feature grid is static HTML. Add the recurring-service card here so it stays in
  // sync with the selected language without depending on Framer's client-side runtime.
  useEffect(() => {
    if (!mounted) return;

    const root = document.getElementById("cal-1to1-root");
    if (!root) return;

    let sectionNeedle = "much more";
    if (locale === "tr") sectionNeedle = "çok daha fazlası";

    const sectionHeading = Array.from(root.querySelectorAll<HTMLElement>("h2")).find((heading): boolean => {
      const content = heading.textContent?.toLocaleLowerCase(locale) ?? "";
      return content.includes(sectionNeedle);
    });
    const featureGrid = sectionHeading
      ?.closest<HTMLElement>('[data-framer-name="Section Structure"]')
      ?.querySelector<HTMLElement>('[data-framer-name="Feature Grid"]');
    if (!featureGrid) return;

    featureGrid.querySelector("[data-rondevu-recurring-feature]")?.remove();

    let copy = {
      title: "Recurring appointment services",
      description:
        "Schedule appointments at regular intervals so recurring clients do not need to book each visit individually.",
    };
    if (locale === "tr") {
      copy = {
        title: "Tekrarlanan randevu hizmetleri",
        description:
          "Belirli aralıklarla randevu planlayın; düzenli danışanlarınızın her seferinde tek tek randevu almasına gerek kalmasın.",
      };
    }

    const container = document.createElement("div");
    container.className = "ssr-variant rondevu-recurring-feature-container";
    container.setAttribute("data-rondevu-recurring-feature", "true");
    container.innerHTML = `
      <article class="rondevu-recurring-feature" tabindex="0">
        <span class="rondevu-recurring-feature-icon" aria-hidden="true">↻</span>
        <h3>${copy.title}</h3>
        <div class="rondevu-recurring-feature-hover">
          <p class="rondevu-recurring-feature-hover-title">${copy.title}</p>
          <p>${copy.description}</p>
        </div>
      </article>`;
    featureGrid.append(container);

    return (): void => {
      container.remove();
    };
  }, [locale, mounted]);

  // Static Framer FAQ markup contains both visual states; normalize its copy and action order after hydration.
  useEffect(() => {
    if (!mounted) return;

    const faqSection = document.querySelector<HTMLElement>('#cal-1to1-root [data-framer-name="FAQ Section"]');
    if (!faqSection) return;

    const badge = faqSection.querySelector<HTMLElement>('[data-framer-name="White Icon"] p');
    if (badge) badge.textContent = locale === "tr" ? "SSS" : "FAQ";

    const actions = faqSection.querySelector<HTMLElement>('[data-framer-name="Button Wrapper"]');
    const questionGroup = faqSection.querySelector<HTMLElement>('[data-framer-name="Question 1"]');
    const target = questionGroup?.parentElement?.parentElement?.parentElement;
    if (actions && target) target.append(actions);

    const normalizeFaqChrome = () => {
      const iconColor = document.documentElement.classList.contains("dark") ? "#f4f4f5" : "#18181b";
      faqSection
        .querySelectorAll<HTMLElement>('[data-framer-name="Open"], [data-framer-name="Closed"]')
        .forEach((item) =>
          item.style.setProperty("border-bottom", "1px solid rgba(177, 177, 178, 0.3)", "important")
        );
      faqSection.querySelectorAll<HTMLElement>('[data-framer-name="Icon Wrapper"]').forEach((iconWrapper) => {
        iconWrapper.style.setProperty("background", "transparent", "important");
        iconWrapper.style.setProperty("border", "0", "important");
        iconWrapper.style.setProperty("box-shadow", "none", "important");
      });
      faqSection.querySelectorAll<HTMLElement>('[data-framer-name="Plus, add small"]').forEach((plus) => {
        plus.replaceChildren(document.createTextNode("+"));
        plus.style.setProperty("align-items", "center", "important");
        plus.style.setProperty("background", "transparent", "important");
        plus.style.setProperty("color", iconColor, "important");
        plus.style.setProperty("display", "flex", "important");
        plus.style.setProperty("font-family", "Arial, sans-serif", "important");
        plus.style.setProperty("font-size", "22px", "important");
        plus.style.setProperty("font-weight", "300", "important");
        plus.style.setProperty("justify-content", "center", "important");
        plus.style.setProperty("line-height", "1", "important");
      });
    };

    normalizeFaqChrome();
    const timer = window.setTimeout(normalizeFaqChrome, 0);
    return () => window.clearTimeout(timer);
  }, [locale, mounted, systemTheme]);

  // Normalize the static Framer footer and hero preview after hydration so both
  // language variants share the same readable status and current calendar year.
  useEffect(() => {
    if (!mounted) return;

    const root = document.querySelector<HTMLElement>("#cal-1to1-root");
    if (!root) return;

    const statusLabel = locale === "tr" ? "Tüm Sistemler Aktif" : "All Systems Operational";
    root.querySelectorAll<HTMLElement>('[data-framer-name="Status Wrapper"]').forEach((status) => {
      status.classList.add("rondevu-status-link");
      status.setAttribute("title", statusLabel);
      status.replaceChildren(
        Object.assign(document.createElement("span"), {
          className: "rondevu-status-dot",
          ariaHidden: "true",
        }),
        Object.assign(document.createElement("span"), {
          className: "rondevu-status-label",
          textContent: statusLabel,
        })
      );
    });

    root.querySelectorAll<HTMLElement>('[data-framer-name="Logo Wrapper"]').forEach((logo) => {
      if (!logo.closest('[data-framer-name="Status Wrapper"]')) {
        logo.querySelectorAll<HTMLImageElement>('img[src*="rondevu-icon.png"]').forEach((image) => {
          image.remove();
        });
      }
    });
  }, [locale, mounted]);

  useEffect(() => {
    if (!mounted) return;

    const normalizeYear = () => {
      const root = document.querySelector<HTMLElement>("#cal-1to1-root");
      if (!root) return;
      root
        .querySelectorAll<HTMLElement>('.framer-13qztwn .framer-text, [data-framer-name="2022"] .framer-text')
        .forEach((year) => {
          if (year.textContent?.trim() === "2025") year.textContent = "2026";
        });
      root.querySelectorAll<HTMLElement>(".framer-1u8wsic .framer-text").forEach((year) => {
        if (year.textContent?.trim() === "2025") year.textContent = "2026";
      });
    };

    normalizeYear();
    const observer = new MutationObserver(normalizeYear);
    const root = document.querySelector<HTMLElement>("#cal-1to1-root");
    if (root) observer.observe(root, { childList: true, subtree: true });
    const timer = window.setTimeout(() => observer.disconnect(), 2000);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [mounted]);

  const { data: contactConfig } = trpc.viewer.public.getPlanContact.useQuery(undefined, {
    staleTime: 30000,
  });

  const phone = contactConfig?.phone || "0552 119 19 87";
  const email = contactConfig?.email || "destek@rondevu.org";
  const whatsapp = contactConfig?.whatsapp || "905521191987";

  const handleModalClose = (): void => {
    setModalPlanType(null);
  };

  // Framer DOM içindeki etkileşimli öğeleri yakalama (SSS Accordion & Fiyatlandırma Yönlendirmeleri)
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;

    // SSS Akordeon Tıklaması
    const questionTrigger = target.closest<HTMLElement>(
      '[data-framer-name="Question"], [data-framer-name="Question Wrapper"], .framer-1xikzrs'
    );
    if (questionTrigger) {
      const variant = questionTrigger.closest<HTMLElement>(
        '[data-framer-name="Open"], [data-framer-name="Closed"]'
      );
      const question = questionTrigger
        .closest<HTMLElement>('[data-framer-name="FAQ Wrapper"]')
        ?.querySelector<HTMLElement>('[data-framer-name="Question"]');
      const questionText = question?.textContent?.trim();
      if (!variant || !questionText) return;

      const faqVariants = Array.from(
        document.querySelectorAll<HTMLElement>('[data-framer-name="Open"], [data-framer-name="Closed"]')
      ).filter(
        (item) =>
          item.querySelector<HTMLElement>('[data-framer-name="Question"]')?.textContent?.trim() ===
          questionText
      );
      const nextOpen = !faqVariants.some((item) => item.dataset.faqOpen === "true");

      faqVariants.forEach((item) => {
        item.dataset.faqOpen = String(nextOpen);
        const answerWrapper = item.querySelector<HTMLElement>('[data-framer-name="Answer Wrapper"]');
        const answer = item.querySelector<HTMLElement>('[data-framer-name="Answer"]');
        const plusIcon = item.querySelector<HTMLElement>(
          '[data-framer-name="Icon Wrapper"], .framer-1xikzrs'
        );
        let contentHeight = 48;
        if (answerWrapper) {
          const answerText = answer?.querySelector<HTMLElement>(".framer-text") ?? answer;
          contentHeight = Math.min(
            Math.max(answerText?.scrollHeight ?? answerText?.offsetHeight ?? 48, 48),
            240
          );
          answerWrapper.style.display = "block";
          answerWrapper.style.overflow = "hidden";
          answerWrapper.style.maxHeight = nextOpen ? `${contentHeight}px` : "0px";
          answerWrapper.style.opacity = nextOpen ? "1" : "0";
          answerWrapper.style.transition = "max-height 240ms ease, opacity 180ms ease";
        }
        if (answer) {
          answer.style.setProperty("height", nextOpen ? `${contentHeight}px` : "1px", "important");
          answer.style.opacity = nextOpen ? "1" : "0";
          answer.style.transform = "none";
          answer.style.transition = "opacity 180ms ease";
        }
        if (plusIcon) {
          plusIcon.style.transform = nextOpen ? "rotate(45deg)" : "rotate(0deg)";
          plusIcon.style.transition = "transform 200ms ease";
          const plus = plusIcon.matches('[data-framer-name="Plus, add small"]')
            ? plusIcon
            : plusIcon.querySelector<HTMLElement>('[data-framer-name="Plus, add small"]');
          if (plus) {
            plus.replaceChildren(document.createTextNode("+"));
            plus.style.setProperty("background", "transparent", "important");
            plus.style.setProperty(
              "color",
              document.documentElement.classList.contains("dark") ? "#f4f4f5" : "#18181b",
              "important"
            );
            plus.style.setProperty("display", "flex", "important");
            plus.style.setProperty("justify-content", "center", "important");
            plus.style.setProperty("align-items", "center", "important");
          }
        }
        item.setAttribute("aria-expanded", String(nextOpen));
      });
      return;
    }

    const anchor = target.closest("a, button");
    if (!anchor) return;

    const href = anchor.getAttribute("href") || "";
    const text = anchor.textContent?.trim().toLowerCase() || "";

    // "Bilgi Alın" / "Talk to sales" / "Book a demo" -> İletişim Modalı
    if (
      href.includes("talk-to-sales") ||
      href.includes("book-a-demo") ||
      text.includes("bilgi al") ||
      text.includes("talk to sales") ||
      text.includes("book a demo")
    ) {
      e.preventDefault();
      setModalPlanType("monthly");
      return;
    }

    // Doğrudan /pricing sayfasına gitme
    if (href === "/pricing") {
      e.preventDefault();
      router.push("/pricing");
      return;
    }

    // Fiyatlandırma veya paket bağlantıları
    if (
      href.includes("#pricing") ||
      href.includes("/pricing") ||
      text.includes("fiyatlandırma") ||
      text.includes("pricing") ||
      text.includes("paketleri incele")
    ) {
      e.preventDefault();
      const pricingEl = document.getElementById("pricing");
      if (pricingEl) {
        pricingEl.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push("/pricing");
      }
      return;
    }

    // "Hemen Başla" / "Get started" / Kayıt butonları -> Doğrudan /pricing
    if (
      href === "/pricing" ||
      href.includes("/pricing") ||
      href.includes("signup") ||
      text.includes("get started") ||
      text.includes("hemen başla") ||
      text.includes("hemen başlayın") ||
      text.includes("plan seç")
    ) {
      e.preventDefault();
      router.push("/pricing");
      return;
    }
  };

  return (
    <div className="relative min-h-screen bg-white dark:bg-[#141414] text-emphasis selection:bg-brand-default selection:text-brand transition-colors duration-200">
      {/* 1:1 Cal.com Framer Stylesheet */}
      <link rel="stylesheet" href="/cal_files/cal-framer.css" />

      {/* Cal.com SVG Şablonları */}
      <div id="svg-templates-container" dangerouslySetInnerHTML={{ __html: svgTemplates }} />

      {/* Ortak ve Tekil Navbar */}
      <Navbar locale={locale} isLoggedIn={isLoggedIn} />

      {/* 1:1 Cal.com Sayfa Gövdesi */}
      <div
        id="cal-1to1-root"
        onClick={handleContainerClick}
        dangerouslySetInnerHTML={{ __html: locale === "tr" ? trHtml : enHtml }}
      />

      {/* Admin Panelinden Dinamik İletişim Modalı */}
      <PlanContactModal
        isOpen={!!modalPlanType}
        planType={modalPlanType}
        locale={locale}
        phone={phone}
        email={email}
        whatsapp={whatsapp}
        onClose={handleModalClose}
      />
    </div>
  );
}

export type { HomeViewProps };
export { HomeView };
