"use client";

import type { PlanContactConfig } from "@rondevu/lib/planContactConfig";
import { CalendarCheck, Globe, MessageCircle, ShieldCheck, Video } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";
import { HomeHero } from "./components/hero/HomeHero";
import { HomePreview } from "./components/HomePreview";
import { MarketingFooter } from "./components/MarketingFooter";
import { MarketingHeader } from "./components/MarketingHeader";
import { PlanContactModal } from "./components/PlanContactModal";
import { homeContent } from "./home-content";
import { homeTranslations, type Locale } from "./i18n/home-translations";

interface HomeViewProps {
  isLoggedIn?: boolean;
  initialContact?: PlanContactConfig;
  initialLocale: Locale;
}

const FEATURE_ICONS = [MessageCircle, ShieldCheck, CalendarCheck, Video, Globe] as const;

const primaryButton =
  "inline-flex h-11 items-center justify-center rounded-lg bg-brand-default px-5 text-sm font-medium text-(--rondevu-brand-text) transition-colors hover:bg-brand-emphasis focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-default";
const secondaryButton =
  "inline-flex h-11 items-center justify-center rounded-lg border border-default bg-default px-5 text-sm font-medium text-emphasis transition-colors hover:bg-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-default";

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

  return (
    <div className="min-h-screen bg-default text-default">
      <MarketingHeader locale={locale} isLoggedIn={isLoggedIn} onContact={() => openModal(null)} />

      <main>
        <HomeHero locale={locale} whatsapp={initialContact?.whatsapp} />

        <section className="px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8">
          <div className="mx-auto max-w-[1120px]">
            <HomePreview content={c.preview} />
          </div>
        </section>

        <section className="border-y border-subtle bg-muted px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[1120px] flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-subtle">{c.audience.label}</p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-emphasis">
              {c.audience.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section id="nasil" className="scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-[1120px]">
            <h2 className="max-w-[560px] text-[32px] font-semibold leading-[1.15] tracking-[-0.02em] text-emphasis sm:text-[44px]">
              {c.how.title}
            </h2>
            <ol className="mt-12 grid gap-4 md:grid-cols-3">
              {c.how.steps.map((step, index) => (
                <li key={step.title} className="rounded-xl border border-default bg-default p-8">
                  <span className="text-sm tabular-nums text-muted">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="mt-6 text-xl font-medium tracking-[-0.01em] text-emphasis">{step.title}</h3>
                  <p className="mt-3 text-base leading-6 text-subtle">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="ozellikler" className="scroll-mt-20 border-y border-subtle bg-muted px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-[1120px]">
            <h2 className="max-w-[640px] text-[32px] font-semibold leading-[1.15] tracking-[-0.02em] text-emphasis sm:text-[44px]">
              {c.features.title}
            </h2>
            <div className="mt-12 grid gap-4 md:grid-cols-6">
              {c.features.items.map((item, index) => {
                const Icon = FEATURE_ICONS[index] ?? MessageCircle;
                const span = index < 2 ? "md:col-span-3" : "md:col-span-2";
                return (
                  <article key={item.title} className={`rounded-xl border border-default bg-default p-8 ${span}`}>
                    <Icon className="size-5 text-subtle" strokeWidth={1.5} aria-hidden="true" />
                    <h3 className="mt-6 text-xl font-medium tracking-[-0.01em] text-emphasis">{item.title}</h3>
                    <p className="mt-3 text-base leading-6 text-subtle">{item.body}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="fiyat" className="scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto grid max-w-[1120px] gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
            <div>
              <h2 className="text-[32px] font-semibold leading-[1.15] tracking-[-0.02em] text-emphasis sm:text-[44px]">
                {c.pricing.title}
              </h2>
              <p className="mt-4 max-w-[440px] text-base leading-6 text-subtle">{c.pricing.subtitle}</p>
              <ul className="mt-8 space-y-3 text-base text-default">
                {c.pricing.included.map((line) => (
                  <li key={line} className="flex items-center gap-3">
                    <span className="size-1.5 rounded-full bg-brand-default" aria-hidden="true" />
                    {line}
                  </li>
                ))}
              </ul>
              <Link
                href={pricingHref}
                className="mt-8 inline-flex text-sm font-medium text-brand-default underline-offset-4 hover:underline">
                {c.pricing.detailLink}
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {(["monthly", "yearly"] as const).map((plan) => {
                const info = t.pricing[plan];
                return (
                  <div key={plan} className="flex flex-col rounded-xl border border-default bg-default p-8">
                    <p className="text-sm font-medium text-subtle">
                      {plan === "monthly" ? c.pricing.monthlyLabel : c.pricing.yearlyLabel}
                    </p>
                    <p className="mt-4 flex items-baseline gap-1">
                      <span className="text-4xl font-semibold tabular-nums tracking-[-0.02em] text-emphasis">
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
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="sss" className="scroll-mt-20 border-y border-subtle bg-muted px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto grid max-w-[1120px] gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
            <h2 className="text-[32px] font-semibold leading-[1.15] tracking-[-0.02em] text-emphasis sm:text-[44px]">
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
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-[1120px] rounded-xl bg-inverted px-8 py-16 sm:px-16">
            <h2 className="max-w-[560px] text-[32px] font-semibold leading-[1.15] tracking-[-0.02em] text-inverted sm:text-[44px]">
              {c.cta.title}
            </h2>
            <p className="mt-4 max-w-[480px] text-base leading-6 text-inverted/70">{c.cta.body}</p>
            <button
              type="button"
              onClick={() => openModal(null)}
              className="mt-8 inline-flex h-11 items-center justify-center rounded-lg bg-default px-5 text-sm font-medium text-emphasis transition-colors hover:bg-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-default">
              {c.cta.button}
            </button>
          </div>
        </section>
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
