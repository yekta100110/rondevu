"use client";

import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { homeTranslations, type Locale, type Translations } from "../i18n/home-translations";

export interface NavbarProps {
  locale: Locale;
  isLoggedIn?: boolean;
}

export function Navbar({ locale, isLoggedIn = false }: NavbarProps) {
  const t: Translations = homeTranslations[locale];
  return (
    <header className="sticky top-0 z-40 w-full border-b border-subtle/70 bg-default/90 backdrop-blur-xl">
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center px-4 sm:px-6 lg:px-8">
        <div aria-hidden="true" />
        <Link
          href="/"
          aria-label="rOndevu Anasayfa"
          className="flex items-center justify-self-center transition-opacity hover:opacity-85 focus-visible:outline-none">
          <BrandLogo />
        </Link>

        <div className="flex items-center justify-self-end">
          {isLoggedIn ? (
            <Link
              href="/event-types"
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-emphasis px-4 text-xs font-semibold text-inverted transition hover:opacity-90 active:scale-[0.98] shadow-xs">
              <span>{t.nav.dashboard}</span>
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="inline-flex h-9 items-center rounded-md bg-emphasis px-4 text-xs font-semibold text-inverted transition hover:opacity-90 active:scale-[0.98] shadow-xs">
              {t.nav.login}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
