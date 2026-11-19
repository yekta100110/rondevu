"use client";

import type { PlanContactConfig } from "@rondevu/lib/planContactConfig";
import { useCallback, useState } from "react";
import { Hero } from "./components/Hero";
import { MarketingFooter } from "./components/MarketingFooter";
import { MarketingHeader } from "./components/MarketingHeader";
import { MotionProvider, Reveal } from "./components/motion";
import { PlanContactModal } from "./components/PlanContactModal";
import { PricingPlans } from "./components/Pricing";
import { BookingShowcase, Closing, Faq, Features, Flow } from "./components/Sections";
import { homeContent } from "./home-content";
import { homeTranslations, type Locale } from "./i18n/home-translations";

interface HomeViewProps {
  isLoggedIn?: boolean;
  initialContact?: PlanContactConfig;
  initialLocale: Locale;
}

export function HomeView({ isLoggedIn = false, initialContact, initialLocale }: HomeViewProps) {
  const locale = initialLocale;
  const c = homeContent[locale];
  const t = homeTranslations[locale];
  const pricingHref = locale === "en" ? "/en/pricing" : "/pricing";
  const [modalPlan, setModalPlan] = useState<"monthly" | "yearly" | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback((plan: "monthly" | "yearly" | null) => {
    setModalPlan(plan);
    setIsModalOpen(true);
  }, []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);
  // Plan buttons go straight to card checkout; the contact modal stays reachable from the header.
  const startCheckout = useCallback((plan: "monthly" | "yearly") => {
    window.location.href = `/billing/checkout?plan=${plan}`;
  }, []);

  return (
    <MotionProvider>
      <div className="min-h-screen overflow-x-clip bg-background text-foreground">
        <MarketingHeader locale={locale} isLoggedIn={isLoggedIn} onContact={() => openModal(null)} />

        <main>
          <Hero content={c} locale={locale} onContact={() => openModal(null)} />
          <BookingShowcase content={c.booking} locale={locale} />
          <Features content={c.features} />
          <Flow content={c.how} />

          <section
            id="fiyat"
            className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6 lg:py-32"
            aria-labelledby="fiyat-title">
            <Reveal onView className="mb-12 grid max-w-2xl gap-4">
              <h2 id="fiyat-title" className="text-balance font-semibold text-4xl tracking-[-0.04em] sm:text-5xl">
                {c.pricing.title}
              </h2>
              <p className="text-lg text-muted-foreground">{c.pricing.subtitle}</p>
            </Reveal>
            <PricingPlans
              content={c.pricing}
              prices={t.pricing}
              features={c.pricing.included}
              onChoose={startCheckout}
              headingId="home-plan"
              detailHref={pricingHref}
            />
          </section>

          <Faq content={c.faq} />
          <Closing content={c.cta} pricingHref="#fiyat" onContact={() => openModal(null)} />
        </main>

        <MarketingFooter locale={locale} initialContact={initialContact} />

        <PlanContactModal
          isOpen={isModalOpen}
          onClose={closeModal}
          planType={modalPlan}
          locale={locale}
          phone={initialContact?.phone ?? ""}
          email={initialContact?.email ?? ""}
          whatsapp={initialContact?.whatsapp ?? ""}
        />
      </div>
    </MotionProvider>
  );
}
