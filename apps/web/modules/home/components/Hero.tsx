"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { HomeContent } from "../home-content";
import { type DayRange, DayRing } from "./DayRing";
import { fmtMinutes, HomePreview } from "./HomePreview";
import { outlineButtonClass, primaryButtonClass } from "./MarketingHeader";
import { Reveal, WordsIn, ease } from "./motion";

const DEMO_SLOTS = [540, 585, 630, 675, 780, 825, 870, 915, 960, 1050, 1095];
const DEMO_LENGTH = 45;

export function Hero({
  content,
  locale,
  onContact,
}: {
  content: HomeContent;
  locale: "tr" | "en";
  onContact: () => void;
}) {
  const { hero } = content;
  const [selected, setSelected] = useState<DayRange | null>(null);
  const [pulse, setPulse] = useState(0);
  const [isBooked, setIsBooked] = useState(false);

  // The ring books itself: holds a free slot, confirms it, then moves to the next one.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let i = 0;
    const id = setInterval(() => {
      if (i % 2 === 0) {
        const start = DEMO_SLOTS[(i / 2) % DEMO_SLOTS.length];
        setSelected({ start, end: start + DEMO_LENGTH });
        setIsBooked(false);
      } else {
        setPulse((p) => p + 1);
        setIsBooked(true);
      }
      i++;
    }, 2600);
    return () => clearInterval(id);
  }, []);

  const frame = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: frame, offset: ["start end", "start 0.3"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [14, 0]);

  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-title">
      <div className="relative mx-auto max-w-6xl px-4 pt-36 sm:px-6 lg:pt-44">
        <DayRing
          selected={selected}
          pulse={pulse}
          booked={content.preview.appointments}
          className="pointer-events-none absolute top-[300px] left-1/2 size-[640px] max-w-none -translate-x-1/2 -translate-y-1/2 text-foreground opacity-90 sm:top-[360px] sm:size-[1040px]"
        />
        <div className="relative mx-auto grid max-w-3xl justify-items-center gap-7 text-center">
          <h1
            id="hero-title"
            className="text-balance font-semibold text-5xl leading-[0.98] tracking-[-0.055em] sm:text-7xl lg:text-[88px]">
            <WordsIn text={hero.title} delay={0.1} />
          </h1>
          <Reveal delay={0.4}>
            <p className="mx-auto max-w-[46ch] text-lg text-muted-foreground sm:text-xl">{hero.subtitle}</p>
          </Reveal>
          <Reveal delay={0.5} className="flex flex-wrap justify-center gap-2">
            <button type="button" onClick={onContact} className={primaryButtonClass}>
              {hero.primary}
              <ArrowRightIcon className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
            </button>
            <a href="#nasil" className={outlineButtonClass}>
              {hero.secondary}
            </a>
          </Reveal>
          <Reveal delay={0.6}>
            <AnimatePresence mode="wait">
              <motion.p
                key={selected ? `${selected.start}-${isBooked}` : "idle"}
                className="font-mono text-muted-foreground text-xs tabular-nums"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3 }}>
                {selected
                  ? `${hero.ringTomorrow} ${fmtMinutes(selected.start)} – ${fmtMinutes(selected.end)} · ${
                      isBooked ? hero.ringBooked : hero.ringFree
                    }`
                  : hero.ringIdle}
              </motion.p>
            </AnimatePresence>
          </Reveal>
        </div>

        <div id="urun" className="relative mt-24 scroll-mt-24 pb-24 [perspective:1600px] sm:mt-32 lg:pb-32">
          <motion.div
            ref={frame}
            style={{ scale, rotateX, transformOrigin: "50% 0%" }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.7 }}
            className="relative">
            <HomePreview content={content.preview} locale={locale} />
          </motion.div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
        </div>
      </div>
    </section>
  );
}
