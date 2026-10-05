"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { homeTranslations, type Locale, type Translations } from "../i18n/home-translations";

export interface NavbarProps {
  locale: Locale;
  isLoggedIn?: boolean;
}

export function Navbar({ locale, isLoggedIn = false }: NavbarProps) {
  const t: Translations = homeTranslations[locale];
  return (
    <header className="sticky top-0 z-40 w-full border-b border-subtle/70 bg-default/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[60px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link
          href="/"
          aria-label="rOndevu Anasayfa"
          className="flex items-center transition-opacity hover:opacity-85 focus-visible:outline-none">
          <span className="font-cal text-[2rem] font-bold tracking-[-0.055em] text-emphasis select-none sm:text-[2.15rem]">
            rOndevu
          </span>
        </Link>

        <div className="flex items-center">
          {isLoggedIn ? (
            <Link
              href="/event-types"
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-emphasis px-4 text-xs font-semibold text-inverted transition hover:opacity-90 active:scale-[0.98] shadow-xs">
              <span>{t.nav.dashboard}</span>
              <ArrowRight className="size-3.5" />
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
