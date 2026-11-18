"use client";

import type { PlanContactConfig } from "@rondevu/lib/planContactConfig";
import { Check } from "lucide-react";
import { useCallback, useState } from "react";
import { MarketingFooter } from "../home/components/MarketingFooter";
import { MarketingHeader } from "../home/components/MarketingHeader";
import { PlanContactModal } from "../home/components/PlanContactModal";
import { homeContent } from "../home/home-content";
import { homeTranslations, type Locale } from "../home/i18n/home-translations";

interface PricingViewProps {
  isLoggedIn?: boolean;
  initialContact?: PlanContactConfig;
  initialLocale: Locale;
}

const primaryButton =
  "inline-flex h-11 w-full items-center justify-center rounded-lg bg-brand-default px-5 text-sm font-medium text-(--rondevu-brand-text) transition-colors hover:bg-brand-emphasis focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-default";
const secondaryButton =
  "inline-flex h-11 w-full items-center justify-center rounded-lg border border-default bg-default px-5 text-sm font-medium text-emphasis transition-colors hover:bg-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-default";

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

  const featureLines = [...c.pricing.included, ...c.features.items.map((item) => item.title)];
  const uniqueFeatures = Array.from(new Set(featureLines));

  return (
    <div className="min-h-screen bg-default text-default">
      <MarketingHeader
        locale={locale}
        isLoggedIn={isLoggedIn}
        withAnchors={false}
        onContact={() => openModal(null)}
      />

      <main className="px-4 pt-16 pb-24 sm:px-6 sm:pt-24 lg:px-8">
        <div className="mx-auto max-w-[1120px]">
          <h1 className="max-w-[640px] animate-fade-in-up text-[40px] font-semibold leading-[1.08] tracking-[-0.03em] text-emphasis motion-reduce:animate-none sm:text-[56px]">
            {c.pricing.title}
          </h1>
          <p className="mt-6 max-w-[560px] text-lg leading-7 text-subtle">{c.pricing.subtitle}</p>

          <div className="mt-14 grid gap-4 md:grid-cols-2">
            {(["monthly", "yearly"] as const).map((plan) => {
              const info = t.pricing[plan];
              return (
                <section key={plan} className="flex flex-col rounded-xl border border-default bg-default p-8">
                  <h2 className="text-sm font-medium text-subtle">{info.name}</h2>
                  <p className="mt-4 flex items-baseline gap-1">
                    <span className="text-5xl font-semibold tabular-nums tracking-[-0.03em] text-emphasis">
                      {info.price}
                    </span>
                    <span className="text-sm text-subtle">{info.period}</span>
                  </p>
                  <p className="mt-2 h-5 text-sm text-semantic-success">
                    {plan === "yearly" ? c.pricing.yearlyNote : ""}
                  </p>
                  <button
                    type="button"
                    onClick={() => openModal(plan)}
                    className={`mt-8 ${plan === "yearly" ? primaryButton : secondaryButton}`}>
                    {c.pricing.cta}
                  </button>
                  <ul className="mt-8 space-y-3 border-t border-subtle pt-8 text-sm text-default">
                    {uniqueFeatures.map((line) => (
                      <li key={line} className="flex items-start gap-3">
                        <Check className="mt-0.5 size-4 shrink-0 text-subtle" strokeWidth={1.5} aria-hidden="true" />
                        {line}
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>

          <section className="mt-24 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
            <h2 className="text-[32px] font-semibold leading-[1.15] tracking-[-0.02em] text-emphasis sm:text-[40px]">
              {c.faq.title}
            </h2>
            <div className="divide-y divide-subtle rounded-xl border border-default bg-default">
              {c.faq.items.map((item) => (
                <details key={item.q} className="group px-6 py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-emphasis marker:hidden [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span
                      className="text-xl leading-none text-muted transition-transform group-open:rotate-45"
                      aria-hidden="true">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 max-w-[560px] text-base leading-6 text-subtle">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
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
  );
}
