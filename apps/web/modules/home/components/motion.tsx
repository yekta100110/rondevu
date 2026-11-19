"use client";

import { animate, MotionConfig, motion, useInView, useMotionValue, useTransform } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

export const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.5, ease }}>
      {children}
    </MotionConfig>
  );
}

/** Content stays in the DOM from the start so crawlers and no-JS readers see it. */
export function Reveal({
  children,
  delay = 0,
  y = 12,
  className,
  onView = false,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  onView?: boolean;
}) {
  const props = onView
    ? { whileInView: { opacity: 1, y: 0, filter: "blur(0px)" }, viewport: { once: true, margin: "-80px" } }
    : { animate: { opacity: 1, y: 0, filter: "blur(0px)" } };
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      transition={{ duration: 0.7, ease, delay }}
      {...props}>
      {children}
    </motion.div>
  );
}

export function WordsIn({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          // biome-ignore lint/suspicious/noArrayIndexKey: words can repeat, order is stable
          key={i}
          className="inline-block whitespace-pre"
          initial={{ opacity: 0, y: "0.35em", filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease, delay: delay + i * 0.06 }}>
          {word + (i < words.length - 1 ? " " : "")}
        </motion.span>
      ))}
    </span>
  );
}

export function CountUp({
  to,
  format = (v) => String(v),
  className,
}: {
  to: number;
  format?: (v: number) => string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => format(Math.round(v)));
  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, to, { duration: 1.1, ease });
    return () => controls.stop();
  }, [inView, mv, to]);
  return (
    <motion.span ref={ref} className={className}>
      {text}
    </motion.span>
  );
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}
