"use client";

import type { PlanContactConfig } from "@rondevu/lib/planContactConfig";
import { useCallback, useState } from "react";
import { MarketingFooter } from "../home/components/MarketingFooter";
import { MarketingHeader } from "../home/components/MarketingHeader";
import { MotionProvider, Reveal, WordsIn } from "../home/components/motion";
import { PlanContactModal } from "../home/components/PlanContactModal";
import { PricingPlans } from "../home/components/Pricing";
import { Faq } from "../home/components/Sections";
import { homeContent } from "../home/home-content";
import { homeTranslations, type Locale } from "../home/i18n/home-translations";

interface PricingViewProps {
  isLoggedIn?: boolean;
  initialContact?: PlanContactConfig;
  initialLocale: Locale;
}

export function PricingView({ isLoggedIn = false, initialContact, initialLocale }: PricingViewProps) {
  const locale = initialLocale;
  const c = homeContent[locale];
  const t = homeTranslations[locale];
  const [modalPlan, setModalPlan] = useState<"monthly" | "yearly" | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback((plan: "monthly" | "yearly" | null) => {
    setModalPlan(plan);
    setIsModalOpen(true);
  }, []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const uniqueFeatures = Array.from(
    new Set([...c.pricing.included, ...c.features.items.map((item) => item.title)])
  );

  return (
    <MotionProvider>
      <div className="min-h-screen bg-background text-foreground">
        <MarketingHeader
          locale={locale}
          isLoggedIn={isLoggedIn}
          withAnchors={false}
          onContact={() => openModal(null)}
        />

        <main>
          <section className="mx-auto max-w-6xl px-4 pt-36 pb-24 sm:px-6 lg:pt-44" aria-labelledby="pricing-title">
            <div className="mb-14 grid max-w-3xl gap-6">
              <h1
                id="pricing-title"
                className="text-balance font-semibold text-5xl leading-[0.98] tracking-[-0.055em] sm:text-7xl">
                <WordsIn text={c.pricing.title} delay={0.05} />
              </h1>
              <Reveal delay={0.3}>
                <p className="max-w-[46ch] text-lg text-muted-foreground sm:text-xl">{c.pricing.subtitle}</p>
              </Reveal>
            </div>
            <Reveal delay={0.4}>
              <PricingPlans
                content={c.pricing}
                prices={t.pricing}
                features={uniqueFeatures}
                onChoose={openModal}
                headingId="pricing-plan"
              />
            </Reveal>
          </section>

          <div className="border-border border-t">
            <Faq content={c.faq} />
          </div>
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
