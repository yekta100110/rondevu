"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useState } from "react";
import { homeContent } from "../home-content";
import { homeTranslations, type Locale } from "../i18n/home-translations";
import { Wordmark } from "./BrandLogo";
import { ease } from "./motion";

export interface MarketingHeaderProps {
  locale: Locale;
  isLoggedIn?: boolean;
  onContact?: () => void;
  /** Section anchors only make sense on the home page. */
  withAnchors?: boolean;
}

export const primaryButtonClass =
  "group inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-[background-color,transform] duration-150 hover:bg-primary/90 active:scale-[.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
export const outlineButtonClass =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground transition-[background-color,transform] duration-150 hover:bg-accent active:scale-[.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

function ThemeButton({ label }: { label: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="relative flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground">
      <SunIcon className="size-4 rotate-0 scale-100 transition-transform duration-500 dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute size-4 rotate-90 scale-0 transition-transform duration-500 dark:rotate-0 dark:scale-100" />
    </button>
  );
}

export function MarketingHeader({ locale, isLoggedIn = false, onContact, withAnchors = true }: MarketingHeaderProps) {
  const c = homeContent[locale];
  const t = homeTranslations[locale];
  const homeHref = locale === "en" ? "/en" : "/";
  const base = withAnchors ? "" : homeHref;
  const pricingHref = locale === "en" ? "/en/pricing" : "/pricing";
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setSolid(v > 12));

  const links = [
    { href: `${base}#urun`, label: c.nav.product },
    { href: `${base}#nasil`, label: c.nav.how },
    { href: pricingHref, label: c.nav.pricing },
    { href: `${base}#sss`, label: c.nav.faq },
  ];

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease }}
      className={`fixed inset-x-0 top-0 z-40 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
        solid ? "border-border bg-background/70 backdrop-blur-xl" : "border-transparent"
      }`}>
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-4 sm:px-6">
        <Link href={homeHref} aria-label="rOndevu" className="rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
          <Wordmark />
        </Link>

        <nav aria-label={locale === "tr" ? "Ana menü" : "Main menu"} className="hidden gap-6 text-muted-foreground text-sm md:flex">
          {links.map((link) => (
            <Link key={link.label} href={link.href} className="group relative transition-colors hover:text-foreground">
              {link.label}
              <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-foreground transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <ThemeButton label={c.nav.theme} />
          <Link
            href={isLoggedIn ? "/event-types" : "/auth/login"}
            className="inline-flex h-9 items-center rounded-lg px-2.5 font-medium text-foreground text-sm transition-colors hover:bg-accent">
            {isLoggedIn ? t.nav.dashboard : t.nav.login}
          </Link>
          {onContact ? (
            <button type="button" onClick={onContact} className={`${primaryButtonClass} h-9`}>
              {c.hero.primary}
            </button>
          ) : null}
        </div>
      </div>
    </motion.header>
  );
}
