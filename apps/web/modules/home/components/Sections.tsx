"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRightIcon,
  BellIcon,
  CalendarCheckIcon,
  CalendarSyncIcon,
  ClockIcon,
  GlobeIcon,
  LinkIcon,
  MessageCircleIcon,
  ShieldCheckIcon,
  VideoIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { HomeContent } from "../home-content";
import { BookingDemo } from "./BookingDemo";
import { outlineButtonClass, primaryButtonClass } from "./MarketingHeader";
import { ease, Reveal } from "./motion";

const FEATURE_ICONS = [MessageCircleIcon, ShieldCheckIcon, CalendarSyncIcon, VideoIcon, GlobeIcon, BellIcon] as const;
const FLOW_ICONS = [ClockIcon, LinkIcon, CalendarCheckIcon, BellIcon] as const;
const sectionTitle = "text-balance font-semibold text-4xl tracking-[-0.04em] sm:text-5xl";

export function BookingShowcase({ content, locale }: { content: HomeContent["booking"]; locale: "tr" | "en" }) {
  return (
    <section
      className="mx-auto grid max-w-6xl items-start gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:py-32"
      aria-labelledby="randevu-title">
      <Reveal onView className="grid gap-5 lg:sticky lg:top-28">
        <h2 id="randevu-title" className={sectionTitle}>
          {content.title}
        </h2>
        <p className="text-lg text-muted-foreground">{content.body}</p>
      </Reveal>
      <Reveal onView delay={0.1}>
        <BookingDemo content={content} locale={locale} />
      </Reveal>
    </section>
  );
}

export function Features({ content }: { content: HomeContent["features"] }) {
  return (
    <section id="ozellikler" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6" aria-labelledby="ozellik-title">
      <Reveal onView className="mb-12 max-w-2xl">
        <h2 id="ozellik-title" className={sectionTitle}>
          {content.title}
        </h2>
      </Reveal>
      <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {content.items.map((item, i) => {
          const Icon = FEATURE_ICONS[i] ?? BellIcon;
          return (
            <motion.article
              key={item.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="group flex gap-4 bg-background p-6 transition-colors duration-150 hover:bg-muted/40">
              <span className="grid size-8 shrink-0 place-items-center rounded-md border border-border bg-muted transition-transform duration-300 group-hover:-translate-y-0.5">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <div className="grid gap-1">
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.body}</p>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

export function Flow({ content }: { content: HomeContent["how"] }) {
  const [active, setActive] = useState(0);
  const [seen, setSeen] = useState(false);
  const steps = content.steps;
  useEffect(() => {
    if (!seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setActive((a) => (a + 1) % steps.length), 2200);
    return () => clearInterval(id);
  }, [seen, steps.length]);

  return (
    <section id="nasil" className="scroll-mt-16 border-border border-y bg-muted/30" aria-labelledby="nasil-title">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <Reveal onView className="mb-14 max-w-2xl">
          <h2 id="nasil-title" className={sectionTitle}>
            {content.title}
          </h2>
        </Reveal>
        <motion.ol
          className="relative grid gap-8 md:grid-cols-4 md:gap-6"
          onViewportEnter={() => setSeen(true)}
          viewport={{ once: true }}>
          <div className="absolute top-5 right-[12.5%] left-[12.5%] hidden h-px bg-border md:block">
            <motion.div
              className="absolute inset-y-0 left-0 bg-foreground"
              animate={{ width: `${(active / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.8, ease }}
            />
          </div>
          {steps.map((s, i) => {
            const on = i <= active;
            const Icon = FLOW_ICONS[i] ?? BellIcon;
            return (
              <li
                key={s.title}
                className="relative grid grid-cols-[40px_1fr] items-start gap-x-4 gap-y-1 md:grid-cols-1 md:justify-items-center md:text-center">
                <motion.span
                  className={`relative z-10 grid size-10 place-items-center rounded-full border transition-colors duration-300 ${
                    on ? "border-foreground bg-foreground text-background" : "border-border bg-background text-muted-foreground"
                  }`}
                  animate={{ scale: i === active ? 1.08 : 1 }}
                  transition={{ duration: 0.4, ease }}>
                  <Icon className="size-4" aria-hidden="true" />
                </motion.span>
                <div className="grid gap-1 md:mt-4">
                  <h3 className="font-medium">{s.title}</h3>
                  <p className="text-muted-foreground text-sm">{s.body}</p>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={on ? "on" : "off"}
                      className={`font-mono text-xs ${on ? "text-foreground" : "text-muted-foreground/60"}`}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}>
                      {on ? s.meta : content.waiting}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </li>
            );
          })}
        </motion.ol>
      </div>
    </section>
  );
}

export function Faq({ content, headingLevel = "h2" }: { content: HomeContent["faq"]; headingLevel?: "h1" | "h2" }) {
  const Heading = headingLevel;
  return (
    <section
      id="sss"
      className="mx-auto grid max-w-6xl scroll-mt-24 gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]"
      aria-labelledby="sss-title">
      <Reveal onView>
        <Heading id="sss-title" className={sectionTitle}>
          {content.title}
        </Heading>
      </Reveal>
      <div className="divide-y divide-border rounded-xl border border-border">
        {content.items.map((item) => (
          <details key={item.q} className="group px-5 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium marker:hidden [&::-webkit-details-marker]:hidden">
              {item.q}
              <span
                className="text-muted-foreground text-xl leading-none transition-transform duration-300 group-open:rotate-45"
                aria-hidden="true">
                +
              </span>
            </summary>
            <p className="mt-3 max-w-[56ch] text-muted-foreground">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function Closing({
  content,
  pricingHref,
  onContact,
}: {
  content: HomeContent["cta"];
  pricingHref: string;
  onContact: () => void;
}) {
  return (
    <section className="relative overflow-hidden border-border border-t" aria-labelledby="son-title">
      <div className="mx-auto grid max-w-6xl justify-items-center gap-8 px-4 pt-28 pb-10 text-center sm:px-6">
        <Reveal onView>
          <h2 id="son-title" className="text-balance font-semibold text-4xl tracking-[-0.045em] sm:text-6xl">
            {content.title}
          </h2>
        </Reveal>
        <Reveal onView delay={0.05}>
          <p className="text-lg text-muted-foreground">{content.body}</p>
        </Reveal>
        <Reveal onView delay={0.1} className="flex flex-wrap justify-center gap-2">
          <button type="button" onClick={onContact} className={primaryButtonClass}>
            {content.button}
            <ArrowRightIcon className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
          </button>
          <a href={pricingHref} className={outlineButtonClass}>
            {content.secondary}
          </a>
        </Reveal>
        <motion.div
          aria-hidden="true"
          className="mt-16 select-none font-semibold text-[22vw] text-border leading-[0.8] tracking-[-0.07em] lg:text-[260px]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease }}>
          rOndevu
        </motion.div>
      </div>
    </section>
  );
}
