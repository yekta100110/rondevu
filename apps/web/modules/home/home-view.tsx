"use client";

import type { PlanContactConfig } from "@rondevu/lib/planContactConfig";
import { trpc } from "@rondevu/trpc/react";
import { useRouter } from "next/navigation";
import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { MarketingFooter } from "./components/MarketingFooter";
import { PlanContactModal } from "./components/PlanContactModal";
import type { Locale } from "./i18n/home-translations";

interface HomeViewProps {
  html: string;
  svgTemplates: string;
  isLoggedIn?: boolean;
  initialContact?: PlanContactConfig;
  initialLocale: Locale;
}

const SvgTemplatesBody = memo(function SvgTemplatesBody({ svgTemplates }: { svgTemplates: string }) {
  const markup = useMemo(() => ({ __html: svgTemplates }), [svgTemplates]);
  return <div id="svg-templates-container" dangerouslySetInnerHTML={markup} />;
});

const FramerDomBody = memo(function FramerDomBody({
  html,
  onClick,
}: {
  html: string;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}) {
  const markup = useMemo(() => ({ __html: html }), [html]);
  return <div id="cal-1to1-root" onClick={onClick} dangerouslySetInnerHTML={markup} />;
});

/** Applies consistent open/closed FAQ accordion height and icon rotation without clipping long answers. */
function applyFaqItemState(item: HTMLElement, isOpen: boolean, immediate: boolean): void {
  item.dataset.faqOpen = String(isOpen);
  item.setAttribute("aria-expanded", String(isOpen));

  const answerWrapper = item.querySelector<HTMLElement>('[data-framer-name="Answer Wrapper"]');
  const answer = item.querySelector<HTMLElement>('[data-framer-name="Answer"]');
  const plusIcon = item.querySelector<HTMLElement>('[data-framer-name="Icon Wrapper"], .framer-1xikzrs');

  if (answer) {
    answer.style.setProperty("height", "auto", "important");
    answer.style.opacity = isOpen ? "1" : "0";
    answer.style.transform = "none";
    answer.style.transition = immediate ? "none" : "opacity 180ms ease";
  }

  if (answerWrapper) {
    const answerText = answer?.querySelector<HTMLElement>(".framer-text") ?? answer;
    const measuredHeight = Math.max(
      (answerText?.scrollHeight ?? answerText?.offsetHeight ?? 48) + 12,
      48
    );
    answerWrapper.style.display = "block";
    answerWrapper.style.overflow = "hidden";
    answerWrapper.style.transition = immediate ? "none" : "max-height 260ms ease, opacity 180ms ease";
    answerWrapper.style.maxHeight = isOpen ? `${measuredHeight}px` : "0px";
    answerWrapper.style.opacity = isOpen ? "1" : "0";
  }

  if (plusIcon) {
    plusIcon.style.transform = isOpen ? "rotate(45deg)" : "rotate(0deg)";
    plusIcon.style.transition = immediate ? "none" : "transform 200ms ease";
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
}

function HomeView({ html, svgTemplates, isLoggedIn = false, initialContact, initialLocale }: HomeViewProps) {
  const router = useRouter();
  const locale = initialLocale;
  const [modalPlanType, setModalPlanType] = useState<"general" | "monthly" | "yearly" | null>(null);
  const [mounted, setMounted] = useState(false);

  // Otomatik Dil ve Başlık Tespiti (Tema yönetimi izole ThemeProvider tarafından yapılır)
  useLayoutEffect(() => {
    setMounted(true);

    localStorage.removeItem("app-locale");
    document.title =
      locale === "tr"
        ? "rOndevu - Herkes İçin Randevu Sistemi"
        : "rOndevu - Clear & Simple Appointment Scheduling";
  }, [locale]);

  // Hero preview follows the source page's complete appointment-state cycle and user clicks across all responsive variants.
  useEffect(() => {
    if (!mounted) return;

    const profiles =
      locale === "tr"
        ? [
            {
              name: "Dr. Ayşe Yılmaz",
              title: "Danışmanlık Seansı",
              description:
                "Danışmanlık, klinik veya bireysel randevularınız için rOndevu ile hemen başlayın.",
              durationIndex: 0,
              dateIndex: 17,
            },
            {
              name: "Uzm. Deniz Kaya",
              title: "İlk Değerlendirme",
              description: "İlk görüşmenizi seçin; uygun saati ve görüşme ayrıntılarını tek ekranda görün.",
              durationIndex: 1,
              dateIndex: 22,
            },
            {
              name: "Ece Demir",
              title: "Proje Planlama",
              description:
                "Projenizin sonraki adımlarını netleştirmek için kısa bir planlama görüşmesi ayarlayın.",
              durationIndex: 2,
              dateIndex: 26,
            },
            {
              name: "Mert Arslan",
              title: "Tanışma Görüşmesi",
              description: "İhtiyaçlarınızı konuşalım ve size uygun randevu akışını birlikte oluşturalım.",
              durationIndex: 3,
              dateIndex: 30,
            },
          ]
        : [
            {
              name: "Dr. Ayse Yilmaz",
              title: "Consultation Session",
              description:
                "Start scheduling your consultations, clinic visits, or personal appointments with rOndevu.",
              durationIndex: 0,
              dateIndex: 17,
            },
            {
              name: "Deniz Kaya",
              title: "Initial Assessment",
              description:
                "Choose your first session and see an available time with every meeting detail in one place.",
              durationIndex: 1,
              dateIndex: 22,
            },
            {
              name: "Ece Demir",
              title: "Project Planning",
              description: "Book a focused planning session to clarify the next steps for your project.",
              durationIndex: 2,
              dateIndex: 26,
            },
            {
              name: "Mert Arslan",
              title: "Introductory Call",
              description: "Let’s discuss your needs and shape the appointment flow that works for you.",
              durationIndex: 3,
              dateIndex: 30,
            },
          ];

    const months =
      locale === "tr"
        ? ["Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos"]
        : ["April", "May", "June", "July", "August"];
    const availableDayIndices = new Set([17, 18, 19, 22, 23, 24, 25, 26, 29, 30, 31, 32, 33]);

    let activeProfileIndex = 0;
    let activeDurationIndex = profiles[0].durationIndex;
    let activeDateIndex = profiles[0].dateIndex;
    let activeMonthIndex = 1; // Mayıs / May
    let autoTimer: number | null = null;
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
      const heroContainer = document.querySelector<HTMLElement>(".framer-647xse");
      if (!heroContainer) return;

      const profile = profiles[activeProfileIndex];
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

      const monthText = months[activeMonthIndex] ?? months[1];
      heroContainer.querySelectorAll<HTMLElement>(".framer-1qlv0sk .framer-text").forEach((el) => {
        if (el.textContent !== monthText) el.textContent = monthText;
      });

      const isDark = document.documentElement.classList.contains("dark");

      const durationPills = heroContainer.querySelectorAll<HTMLElement>(".framer-103r016 .framer-V26CA");
      durationPills.forEach((pill, idx) => {
        const isSelected = idx % 4 === activeDurationIndex;
        pill.setAttribute("data-framer-name", isSelected ? "Selected" : "Unselected");
        pill.style.backgroundColor = isSelected ? (isDark ? "#27272a" : "#ffffff") : "transparent";
        pill.style.boxShadow = isSelected ? "0px 1px 3px 0px rgba(0, 0, 0, 0.1)" : "none";
        const textEl = pill.querySelector<HTMLElement>(".framer-text");
        if (textEl) {
          textEl.style.color = isSelected
            ? isDark
              ? "#ffffff"
              : "rgb(16, 16, 16)"
            : isDark
              ? "#71717a"
              : "rgb(137, 137, 137)";
        }
      });

      const dateItems = heroContainer.querySelectorAll<HTMLElement>(".framer-ste13c .framer-k4oXa");
      dateItems.forEach((item, idx) => {
        const dayIdx = idx % 35;
        const isEmpty = dayIdx < 3 || dayIdx > 33;
        const highlightEl = item.querySelector<HTMLElement>(".framer-156kf12");
        const dateText = item.querySelector<HTMLElement>(".framer-text");
        if (!highlightEl || !dateText) return;

        highlightEl.style.removeProperty("background-color");
        dateText.style.removeProperty("font-weight");

        if (isEmpty) {
          item.setAttribute("data-rondevu-day-state", "empty");
          item.setAttribute("data-rondevu-day-valid", "false");
          return;
        }

        item.setAttribute("data-rondevu-day-valid", "true");
        if (dayIdx === activeDateIndex) {
          item.setAttribute("data-rondevu-day-state", "selected");
        } else if (availableDayIndices.has(dayIdx)) {
          item.setAttribute("data-rondevu-day-state", "available");
        } else {
          item.setAttribute("data-rondevu-day-state", "default");
        }
      });
    };

    const startAutoCycle = () => {
      if (autoTimer !== null) window.clearInterval(autoTimer);
      autoTimer = window.setInterval(() => {
        activeProfileIndex = (activeProfileIndex + 1) % profiles.length;
        const nextProfile = profiles[activeProfileIndex];
        activeDurationIndex = nextProfile.durationIndex;
        activeDateIndex = nextProfile.dateIndex;
        updatePreview();
      }, 3500);
    };

    const heroEl = document.querySelector<HTMLElement>(".framer-647xse");
    const handleHeroClick = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (!target || !heroEl) return;

      const pill = target.closest<HTMLElement>(".framer-103r016 .framer-V26CA");
      if (pill) {
        const allPills = Array.from(heroEl.querySelectorAll<HTMLElement>(".framer-103r016 .framer-V26CA"));
        const idx = allPills.indexOf(pill);
        if (idx !== -1) {
          activeDurationIndex = idx % 4;
          activeProfileIndex = activeDurationIndex;
          updatePreview();
          startAutoCycle();
        }
        return;
      }

      const dayCell = target.closest<HTMLElement>('.framer-ste13c .framer-k4oXa[data-rondevu-day-valid="true"]');
      if (dayCell) {
        const allDays = Array.from(heroEl.querySelectorAll<HTMLElement>(".framer-ste13c .framer-k4oXa"));
        const idx = allDays.indexOf(dayCell);
        if (idx !== -1) {
          activeDateIndex = idx % 35;
          updatePreview();
          startAutoCycle();
        }
        return;
      }

      const prevBtn = target.closest<HTMLElement>(".framer-qd088j");
      if (prevBtn) {
        activeMonthIndex = (activeMonthIndex - 1 + months.length) % months.length;
        updatePreview();
        startAutoCycle();
        return;
      }

      const nextBtn = target.closest<HTMLElement>(".framer-191znqb");
      if (nextBtn) {
        activeMonthIndex = (activeMonthIndex + 1) % months.length;
        updatePreview();
        startAutoCycle();
      }
    };

    updatePreview();
    startAutoCycle();
    heroEl?.addEventListener("click", handleHeroClick);
    const themeObserver = new MutationObserver(updatePreview);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      if (autoTimer !== null) window.clearInterval(autoTimer);
      heroEl?.removeEventListener("click", handleHeroClick);
      themeObserver.disconnect();
      transitionTimers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [locale, mounted]);

  // Restore all step & bento interactive animations (Bento 1-4, Step 02-03) and keep them responsive to clicks.
  useEffect(() => {
    if (!mounted) return;

    const root = document.getElementById("cal-1to1-root");
    if (!root) return;

    // 1. Bento Kart 3: 6 To-do cards cycle + 12h/24h switcher + "Takvimimi üzerine ekle" toggle
    const todoTimeFormats = {
      tr: {
        h24: ["12:00 - 13:00", "11:00 - 12:00", "13:00 - 15:00", "12:00 - 14:00", "11:30 - 13:00", "11:00 - 14:30"],
        h12: ["12 ÖS - 1 ÖS", "11 ÖÖ - 12 ÖS", "1 ÖS - 3 ÖS", "12 ÖS - 2 ÖS", "11:30 ÖÖ - 1 ÖS", "11 ÖÖ - 2:30 ÖS"],
      },
      en: {
        h24: ["12:00 - 13:00", "11:00 - 12:00", "13:00 - 15:00", "12:00 - 14:00", "11:30 - 13:00", "11:00 - 14:30"],
        h12: ["12 PM - 1 PM", "11 AM - 12 PM", "1 PM - 3 PM", "12 PM - 2 PM", "11:30 AM - 1 PM", "11 AM - 2:30 PM"],
      },
    } as const;

    let hourMode: "12h" | "24h" = locale === "tr" ? "24h" : "12h";

    const applyBento3HourMode = () => {
      const pry = root.querySelector<HTMLElement>(".framer-pry2jb");
      if (!pry) return;
      const btn12 = pry.querySelector<HTMLElement>(".framer-1fcbxls");
      const btn24 = pry.querySelector<HTMLElement>(".framer-1qb6d8o");
      btn12?.setAttribute("data-rondevu-hour-active", String(hourMode === "12h"));
      btn24?.setAttribute("data-rondevu-hour-active", String(hourMode === "24h"));

      const labels = locale === "tr" ? todoTimeFormats.tr : todoTimeFormats.en;
      const times = hourMode === "24h" ? labels.h24 : labels.h12;
      const cards = pry.querySelectorAll<HTMLElement>('[data-framer-name="To-do cards"]');
      cards.forEach((card, index) => {
        const timeText = card.querySelectorAll<HTMLElement>(".framer-text")[1];
        if (timeText && times[index]) {
          timeText.textContent = times[index];
        }
      });
    };

    applyBento3HourMode();

    // 2. Bento Kart 1: Notice & buffer selector cycling + click interaction
    const noticeOptions =
      locale === "tr"
        ? [
            ["12 saat", "24 saat", "48 saat"],
            ["15 dk", "30 dk", "45 dk"],
            ["15 dk", "30 dk", "45 dk"],
            ["Seans süresini kullan (varsayılan)", "15 dk aralık", "30 dk aralık"],
          ]
        : [
            ["12 hours", "24 hours", "48 hours"],
            ["15 mins", "30 mins", "45 mins"],
            ["15 mins", "30 mins", "45 mins"],
            ["Use event length (default)", "15 min intervals", "30 min intervals"],
          ];
    const noticeIndices = [1, 1, 1, 0];

    const applyBento1NoticeValues = () => {
      const boxes = root.querySelectorAll<HTMLElement>(".framer-l5bt33 .framer-gJkts");
      boxes.forEach((box, idx) => {
        const opts = noticeOptions[idx];
        const textEl = box.querySelector<HTMLElement>(".framer-9pkuhi .framer-text");
        if (opts && textEl) {
          textEl.textContent = opts[noticeIndices[idx] % opts.length];
        }
      });
    };

    // 3. Bento Kart 2: Custom booking link duration pills cycling + click interaction
    let bento2DurationIndex = 1;
    const applyBento2Pills = () => {
      const cf = root.querySelector<HTMLElement>(".framer-cf392j");
      if (!cf) return;
      const isDark = document.documentElement.classList.contains("dark");
      const pills = cf.querySelectorAll<HTMLElement>(".framer-103r016 .framer-V26CA");
      pills.forEach((pill, idx) => {
        const isSelected = idx % 4 === bento2DurationIndex;
        pill.setAttribute("data-framer-name", isSelected ? "Selected" : "Unselected");
        pill.style.backgroundColor = isSelected ? (isDark ? "#27272a" : "#ffffff") : "transparent";
        pill.style.boxShadow = isSelected ? "0px 1px 3px 0px rgba(0, 0, 0, 0.1)" : "none";
        const textEl = pill.querySelector<HTMLElement>(".framer-text");
        if (textEl) {
          textEl.style.color = isSelected
            ? isDark
              ? "#ffffff"
              : "rgb(16, 16, 16)"
            : isDark
              ? "#71717a"
              : "rgb(137, 137, 137)";
        }
      });
    };
    applyBento2Pills();

    let frame = 0;
    const updateFeaturePreviews = () => {
      const calendarCards = root.querySelectorAll<HTMLElement>(
        '.framer-pry2jb [data-framer-name="To-do cards"]'
      );
      if (calendarCards.length > 0) {
        calendarCards.forEach((card, index) => {
          card.classList.toggle("rondevu-calendar-card-active", index === frame % calendarCards.length);
        });
      }

      const notificationSelectors = [
        '.framer-54l76e [data-framer-name="1"]',
        '.framer-54l76e [data-framer-name="2"]',
        '.framer-54l76e [data-framer-name="3"]',
      ] as const;
      const notifications = notificationSelectors
        .map((sel) => root.querySelector<HTMLElement>(sel))
        .filter((el): el is HTMLElement => Boolean(el));
      if (notifications.length > 0) {
        const activeIdx = frame % notifications.length;
        notifications.forEach((notification, index) => {
          const stackPos = (index - activeIdx + notifications.length) % notifications.length;
          notification.setAttribute("data-rondevu-stack-pos", String(stackPos));
          notification.classList.toggle("rondevu-notification-visible", stackPos === 0);
        });
      }

      if (frame > 0) {
        bento2DurationIndex = (bento2DurationIndex + 1) % 4;
        applyBento2Pills();

        const boxToRotate = frame % 3;
        noticeIndices[boxToRotate] = (noticeIndices[boxToRotate] + 1) % noticeOptions[boxToRotate].length;
        applyBento1NoticeValues();
      }

      frame += 1;
    };

    const handleFeatureClick = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      // Step 02 row toggle click
      const step2Row = target.closest<HTMLElement>('.framer-qm9fst [data-framer-name="Row"]');
      if (step2Row) {
        const isOff = step2Row.classList.contains("rondevu-row-off");
        step2Row.classList.toggle("rondevu-row-off", !isOff);
        step2Row.classList.toggle("rondevu-row-on", isOff);
        return;
      }

      // Step 03 meeting controls click
      const meetingBtn = target.closest<HTMLElement>(
        '.framer-igaxec [data-framer-name="Function Button Wrapper"] > [data-framer-component-type="SVG"]'
      );
      if (meetingBtn) {
        const allBtns = root.querySelectorAll<HTMLElement>(
          '.framer-igaxec [data-framer-name="Function Button Wrapper"] > [data-framer-component-type="SVG"]'
        );
        const wasPinned = meetingBtn.classList.contains("rondevu-control-pinned");
        allBtns.forEach((btn) => btn.classList.remove("rondevu-control-pinned"));
        if (!wasPinned) meetingBtn.classList.add("rondevu-control-pinned");
        return;
      }

      // Bento 1 notice selector click
      const noticeBox = target.closest<HTMLElement>(".framer-l5bt33 .framer-gJkts");
      if (noticeBox) {
        const allBoxes = Array.from(root.querySelectorAll<HTMLElement>(".framer-l5bt33 .framer-gJkts"));
        const idx = allBoxes.indexOf(noticeBox);
        if (idx !== -1 && noticeOptions[idx]) {
          noticeIndices[idx] = (noticeIndices[idx] + 1) % noticeOptions[idx].length;
          applyBento1NoticeValues();
          noticeBox.classList.add("rondevu-pill-pulse");
          window.setTimeout(() => noticeBox.classList.remove("rondevu-pill-pulse"), 160);
        }
        return;
      }

      // Bento 2 duration pill click
      const bento2Pill = target.closest<HTMLElement>(".framer-cf392j .framer-103r016 .framer-V26CA");
      if (bento2Pill) {
        const allPills = Array.from(root.querySelectorAll<HTMLElement>(".framer-cf392j .framer-103r016 .framer-V26CA"));
        const idx = allPills.indexOf(bento2Pill);
        if (idx !== -1) {
          bento2DurationIndex = idx % 4;
          applyBento2Pills();
        }
        return;
      }

      // Bento 3 "Takvimimi üzerine ekle" toggle
      const overlayToggle = target.closest<HTMLElement>(".framer-pry2jb .framer-m9yoxo");
      if (overlayToggle) {
        const pry = root.querySelector<HTMLElement>(".framer-pry2jb");
        pry?.classList.toggle("rondevu-overlay-off");
        return;
      }

      // Bento 3 "12h / 24h" switcher
      const btn12 = target.closest<HTMLElement>(".framer-pry2jb .framer-1fcbxls");
      if (btn12) {
        hourMode = "12h";
        applyBento3HourMode();
        return;
      }
      const btn24 = target.closest<HTMLElement>(".framer-pry2jb .framer-1qb6d8o");
      if (btn24) {
        hourMode = "24h";
        applyBento3HourMode();
        return;
      }

      // Bento 4 notification stack click to cycle immediately
      const notifArea = target.closest<HTMLElement>(".framer-54l76e .framer-ZlJxc");
      if (notifArea) {
        updateFeaturePreviews();
      }
    };

    updateFeaturePreviews();
    const interval = window.setInterval(updateFeaturePreviews, 2400);
    root.addEventListener("click", handleFeatureClick);
    const themeObserver = new MutationObserver(applyBento2Pills);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      window.clearInterval(interval);
      root.removeEventListener("click", handleFeatureClick);
      themeObserver.disconnect();
    };
  }, [locale, mounted]);

  // Lightweight IntersectionObserver scroll-reveal for below-the-fold sections (with reduced-motion & fallback safety).
  useEffect(() => {
    if (!mounted) return;
    const root = document.getElementById("cal-1to1-root");
    if (!root) return;

    const integrationContainers = Array.from(
      root.querySelectorAll<HTMLElement>(".framer-1btm4pg-container")
    ).map((el) => el.closest<HTMLElement>(".framer-f96tv2 > div") ?? el);
    const ctaContainers = Array.from(
      root.querySelectorAll<HTMLElement>(".framer-3gy7g1-container")
    ).map((el) => el.closest<HTMLElement>(".framer-f96tv2 > div") ?? el);
    const targets = Array.from(
      new Set(
        [
          root.querySelector<HTMLElement>(".framer-1uc0xrr"),
          root.querySelector<HTMLElement>(".framer-1j78ach"),
          root.querySelector<HTMLElement>(".framer-1bsidtw"),
          ...integrationContainers,
          root.querySelector<HTMLElement>(".framer-1o2z9n8"),
          ...ctaContainers,
        ].filter((el): el is HTMLElement => Boolean(el))
      )
    );

    if (targets.length === 0) return;

    const prefersReducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
      targets.forEach((el) => {
        el.classList.remove("rondevu-reveal");
        el.classList.add("rondevu-revealed");
      });
      return;
    }

    const revealIfVisible = (el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.96) {
        el.classList.add("rondevu-revealed");
        return true;
      }
      return false;
    };

    const pending = new Set<HTMLElement>();
    targets.forEach((el) => {
      el.classList.add("rondevu-reveal");
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
            target.classList.add("rondevu-revealed");
            pending.delete(target);
            observer.unobserve(target);
          }
        });
      },
      { threshold: 0.04, rootMargin: "0px 0px -24px 0px" }
    );

    pending.forEach((el) => observer.observe(el));

    const handleScrollCheck = () => {
      pending.forEach((el) => {
        if (revealIfVisible(el)) {
          pending.delete(el);
          observer.unobserve(el);
        }
      });
    };

    window.addEventListener("scroll", handleScrollCheck, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScrollCheck);
    };
  }, [locale, mounted]);

  // Static Framer FAQ markup contains both visual states; normalize initial open/closed heights and chrome cleanly.
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
        .forEach((item, index) => {
          item.style.setProperty("border-bottom", "1px solid rgba(177, 177, 178, 0.3)", "important");
          if (item.dataset.faqOpen === undefined) {
            const initiallyOpen = index === 0 || item.getAttribute("data-framer-name") === "Open";
            applyFaqItemState(item, initiallyOpen, true);
          }
        });
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

    const refreshOpenHeights = () => {
      faqSection
        .querySelectorAll<HTMLElement>('[data-framer-name="Open"], [data-framer-name="Closed"]')
        .forEach((item) => {
          if (item.dataset.faqOpen === "true") {
            applyFaqItemState(item, true, true);
          }
        });
    };

    normalizeFaqChrome();
    const rafId = window.requestAnimationFrame(refreshOpenHeights);
    const timer = window.setTimeout(() => {
      normalizeFaqChrome();
      refreshOpenHeights();
    }, 0);
    const themeObserver = new MutationObserver(normalizeFaqChrome);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    window.addEventListener("resize", refreshOpenHeights);
    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(timer);
      themeObserver.disconnect();
      window.removeEventListener("resize", refreshOpenHeights);
    };
  }, [locale, mounted]);

  useEffect(() => {
    if (!mounted) return;
    const links = document.querySelectorAll<HTMLAnchorElement>("#cal-1to1-root .rondevu-hero-login-link");
    links.forEach((link) => {
      if (isLoggedIn) {
        link.setAttribute("href", "/event-types");
        link.textContent = locale === "en" ? "Go to Dashboard" : "Hesabım var · Panele Git";
      } else {
        link.setAttribute("href", "/auth/login");
        link.textContent =
          locale === "en" ? "Already have an account? Sign in" : "Hesabım var · Giriş Yap";
      }
    });
  }, [isLoggedIn, locale, mounted]);

  // Remove retired calls to action and status content from either static language fragment.
  useEffect(() => {
    if (!mounted) return;

    const root = document.querySelector<HTMLElement>("#cal-1to1-root");
    if (!root) return;

    root.querySelectorAll<HTMLElement>("a, button").forEach((action) => {
      const label = action.textContent?.replace(/\s+/g, " ").trim().toLowerCase() ?? "";
      if (!label.includes("book a demo") && !label.includes("talk to sales")) return;

      const buttonWrapper = action.closest<HTMLElement>(
        '[data-framer-name="Button Wrapper"], [data-framer-name="Button Container"], [class*="-container"]'
      );
      (buttonWrapper ?? action).remove();
    });

    root.querySelectorAll<HTMLElement>('[data-framer-name="Status Wrapper"]').forEach((status) => {
      status.remove();
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

  const resolvedContact = contactConfig ?? initialContact;
  const phone =
    resolvedContact?.phone && resolvedContact.phone !== "0850 000 00 00"
      ? resolvedContact.phone
      : "0552 119 19 87";
  const email = resolvedContact?.email || "destek@rondevu.org";
  const whatsapp =
    resolvedContact?.whatsapp && resolvedContact.whatsapp !== "908500000000"
      ? resolvedContact.whatsapp
      : "905521191987";

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
        applyFaqItemState(item, nextOpen, false);
      });
      return;
    }

    const anchor = target.closest("a, button");
    if (!anchor) return;

    const href = anchor.getAttribute("href") || "";
    const text = anchor.textContent?.trim().toLowerCase() || "";
    const pricingPath = locale === "en" ? "/en/pricing" : "/pricing";

    if (href === "/auth/login" || href === "/event-types") {
      e.preventDefault();
      router.push(href);
      return;
    }

    if (text.includes("bilgi al")) {
      e.preventDefault();
      setModalPlanType("general");
      return;
    }

    // Doğrudan fiyatlandırma sayfasına gitme
    if (href === "/pricing" || href === "/en/pricing") {
      e.preventDefault();
      router.push(pricingPath);
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
        router.push(pricingPath);
      }
      return;
    }

    // "Hemen Başla" / "Get started" / Kayıt butonları -> Doğrudan fiyatlandırma
    if (
      href.includes("signup") ||
      text.includes("get started") ||
      text.includes("hemen başla") ||
      text.includes("hemen başlayın") ||
      text.includes("plan seç")
    ) {
      e.preventDefault();
      router.push(pricingPath);
      return;
    }
  };

  const handleContainerClickRef = useRef(handleContainerClick);
  handleContainerClickRef.current = handleContainerClick;
  const onRootClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    handleContainerClickRef.current(e);
  }, []);

  return (
    <div className="relative min-h-screen bg-white dark:bg-[#141414] text-emphasis selection:bg-brand-default selection:text-brand transition-colors duration-200">
      {/* Cal.com SVG Şablonları */}
      <SvgTemplatesBody svgTemplates={svgTemplates} />

      {/* 1:1 Cal.com Sayfa Gövdesi */}
      <FramerDomBody html={html} onClick={onRootClick} />
      <MarketingFooter locale={locale} initialContact={resolvedContact} />

      {/* Admin Panelinden Dinamik İletişim Modalı */}
      <PlanContactModal
        isOpen={!!modalPlanType}
        planType={modalPlanType === "general" ? null : modalPlanType}
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
