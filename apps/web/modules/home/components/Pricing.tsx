"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { CheckIcon } from "lucide-react";
import { useState } from "react";
import type { HomeContent } from "../home-content";
import type { Translations } from "../i18n/home-translations";
import { outlineButtonClass, primaryButtonClass } from "./MarketingHeader";
import { ease } from "./motion";

type Plan = "monthly" | "yearly";

/**
 * Both plans carry the same features, so one card with a billing switch tells the truth better than
 * two near-identical cards.
 */
export function PricingPlans({
  content,
  prices,
  features,
  onChoose,
  headingId,
  detailHref,
}: {
  content: HomeContent["pricing"];
  prices: Translations["pricing"];
  features: string[];
  onChoose: (plan: Plan) => void;
  headingId?: string;
  detailHref?: string;
}) {
  const [plan, setPlan] = useState<Plan>("yearly");
  const info = prices[plan];
  const labels: Record<Plan, string> = { monthly: content.monthlyLabel, yearly: content.yearlyLabel };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
      <div className="grid gap-4">
        <div role="radiogroup" aria-label={content.title} className="inline-flex w-fit rounded-lg border border-border p-0.5">
          <LayoutGroup id={headingId}>
            {(["monthly", "yearly"] as const).map((p) => (
              <button
                key={p}
                type="button"
                role="radio"
                aria-checked={plan === p}
                onClick={() => setPlan(p)}
                className={`relative inline-flex h-8 items-center gap-2 rounded-md px-3 font-medium text-sm transition-colors duration-150 ${
                  plan === p ? "text-background" : "text-muted-foreground hover:text-foreground"
                }`}>
                {plan === p && (
                  <motion.span
                    layoutId={`${headingId ?? "plan"}-pill`}
                    className="absolute inset-0 rounded-md bg-foreground"
                    transition={{ type: "spring", stiffness: 500, damping: 38 }}
                  />
                )}
                <span className="relative">{labels[p]}</span>
                {p === "yearly" && (
                  <span className={`relative font-mono text-[11px] ${plan === p ? "text-background/70" : ""}`}>
                    {content.yearlyNote}
                  </span>
                )}
              </button>
            ))}
          </LayoutGroup>
        </div>
        <p className="max-w-[44ch] text-muted-foreground">{content.planNote}</p>
        {detailHref && (
          <a href={detailHref} className="w-fit font-medium text-sm underline-offset-4 hover:underline">
            {content.detailLink}
          </a>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
        className="flex flex-col gap-6 rounded-xl border border-foreground bg-card p-6 sm:p-8">
        <div className="flex items-baseline justify-between gap-4">
          <p className="font-medium">{info.name}</p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={plan}
              className="font-mono text-muted-foreground text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}>
              {plan === "yearly" ? content.yearlyNote : ""}
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="relative inline-flex overflow-hidden font-semibold text-5xl tracking-[-0.04em]">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={info.price}
                className="tabular-nums"
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.35, ease }}>
                {info.price}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="text-muted-foreground text-sm">{info.period}</span>
        </div>
        <div className="h-px bg-border" />
        <ul className="grid gap-2.5 text-sm">
          {features.map((line) => (
            <li key={line} className="flex gap-2">
              <CheckIcon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              {line}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => onChoose(plan)}
          className={`${plan === "yearly" ? primaryButtonClass : outlineButtonClass} w-full`}>
          {content.cta}
        </button>
      </motion.div>
    </div>
  );
}
