"use client";

import Link from "next/link";
import { homeContent } from "../home-content";
import { homeTranslations, type Locale } from "../i18n/home-translations";
import { BrandLogo } from "./BrandLogo";

export interface MarketingHeaderProps {
  locale: Locale;
  isLoggedIn?: boolean;
  onContact?: () => void;
  /** Section anchors only make sense on the home page. */
  withAnchors?: boolean;
}

export function MarketingHeader({ locale, isLoggedIn = false, onContact, withAnchors = true }: MarketingHeaderProps) {
  const c = homeContent[locale];
  const t = homeTranslations[locale];
  const homeHref = locale === "en" ? "/en" : "/";
  const base = withAnchors ? "" : homeHref;
  const pricingHref = locale === "en" ? "/en/pricing" : "/pricing";

  const links = [
    { href: `${base}#nasil`, label: c.nav.how },
    { href: `${base}#ozellikler`, label: c.nav.features },
    { href: pricingHref, label: c.nav.pricing },
    { href: `${base}#sss`, label: c.nav.faq },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-subtle bg-default/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link
          href={homeHref}
          aria-label="rOndevu"
          className="flex items-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-default">
          <BrandLogo />
        </Link>

        <nav aria-label="Ana menü" className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-subtle transition-colors hover:text-emphasis">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href={isLoggedIn ? "/event-types" : "/auth/login"}
            className="text-sm font-medium text-emphasis transition-colors hover:text-subtle">
            {isLoggedIn ? t.nav.dashboard : t.nav.login}
          </Link>
          {onContact ? (
            <button
              type="button"
              onClick={onContact}
              className="hidden h-9 items-center rounded-lg bg-brand-default px-4 text-sm font-medium text-(--rondevu-brand-text) transition-colors hover:bg-brand-emphasis sm:inline-flex">
              {c.hero.primary}
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
