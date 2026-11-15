"use client";

import { Globe, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandLogo } from "./BrandLogo";

export interface MarketingHeaderProps {
  locale: "tr" | "en";
  isLoggedIn?: boolean;
  onContactClick?: () => void;
}

function resolveLanguageSwitch(pathname: string | null, currentLocale: "tr" | "en") {
  const normalized = pathname && pathname !== "/" ? pathname.replace(/\/+$/, "") : "/";

  if (currentLocale === "en") {
    let targetHref = "/";
    if (normalized === "/en") {
      targetHref = "/";
    } else if (normalized === "/en/pricing") {
      targetHref = "/pricing";
    } else if (normalized.startsWith("/en/")) {
      targetHref = normalized.replace(/^\/en/, "") || "/";
    } else {
      targetHref = normalized;
    }

    return {
      href: targetHref,
      label: "Türkçe",
      shortLabel: "TR",
      hrefLang: "tr",
    };
  }

  let targetHref = "/en";
  if (normalized === "/") {
    targetHref = "/en";
  } else if (normalized === "/pricing") {
    targetHref = "/en/pricing";
  } else if (normalized.startsWith("/en")) {
    targetHref = normalized;
  } else {
    targetHref = `/en${normalized}`;
  }

  return {
    href: targetHref,
    label: "English",
    shortLabel: "EN",
    hrefLang: "en",
  };
}

export function MarketingHeader({ locale, isLoggedIn = false, onContactClick }: MarketingHeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const homeHref = locale === "en" ? "/en" : "/";
  const pricingHref = locale === "en" ? "/en/pricing" : "/pricing";
  const isPricingActive = pathname === pricingHref;
  const langSwitch = resolveLanguageSwitch(pathname, locale);

  const pricingLabel = locale === "tr" ? "Fiyatlandırma" : "Pricing";
  const contactLabel = locale === "tr" ? "Bilgi Al" : "Contact";
  const loginLabel = locale === "tr" ? "Giriş Yap" : "Sign In";
  const dashboardLabel = locale === "tr" ? "Panel" : "Dashboard";
  const brandAriaLabel = locale === "tr" ? "rOndevu Ana Sayfa" : "rOndevu Home";
  const langToggleAriaLabel = locale === "tr" ? "Switch to English" : "Türkçe sayfaya geç";
  const menuToggleAriaLabel = mobileMenuOpen
    ? locale === "tr"
      ? "Menüyü kapat"
      : "Close menu"
    : locale === "tr"
      ? "Menüyü aç"
      : "Open menu";

  // Sayfa değişiminde menüyü otomatik kapat
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Escape tuşu ile menüyü kapat
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-[#111214]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Sol Logo */}
        <Link
          href={homeHref}
          aria-label={brandAriaLabel}
          className="flex items-center rounded-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50">
          <BrandLogo placement="header" />
        </Link>

        {/* Masaüstü Navigasyon */}
        <nav
          aria-label={locale === "tr" ? "Ana menü" : "Main menu"}
          className="hidden md:flex md:items-center md:gap-6">
          <Link
            href={pricingHref}
            className={`text-sm font-medium transition-colors ${
              isPricingActive ? "text-[#F4F4F2]" : "text-zinc-400 hover:text-[#F4F4F2]"
            }`}>
            {pricingLabel}
          </Link>

          <Link
            href={langSwitch.href}
            hrefLang={langSwitch.hrefLang}
            lang={langSwitch.hrefLang}
            aria-label={langToggleAriaLabel}
            className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-[#F4F4F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50">
            <Globe className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
            <span>{langSwitch.shortLabel}</span>
          </Link>

          {onContactClick && (
            <button
              type="button"
              onClick={onContactClick}
              className="inline-flex items-center rounded-lg border border-zinc-700/70 bg-zinc-800/60 px-3.5 py-1.5 text-sm font-medium text-zinc-200 transition hover:bg-zinc-750 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 active:scale-[0.98]">
              {contactLabel}
            </button>
          )}

          {isLoggedIn ? (
            <Link
              href="/event-types"
              className="inline-flex items-center rounded-lg bg-emerald-600 px-3.5 py-1.5 text-sm font-medium text-white shadow-xs transition hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 active:scale-[0.98]">
              {dashboardLabel}
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="inline-flex items-center rounded-lg bg-emerald-600 px-3.5 py-1.5 text-sm font-medium text-white shadow-xs transition hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 active:scale-[0.98]">
              {loginLabel}
            </Link>
          )}
        </nav>

        {/* Mobil Butonlar (Dil ve Hamburger) */}
        <div className="flex items-center gap-2.5 md:hidden">
          <Link
            href={langSwitch.href}
            hrefLang={langSwitch.hrefLang}
            lang={langSwitch.hrefLang}
            aria-label={langToggleAriaLabel}
            className="inline-flex items-center gap-1 rounded-md border border-zinc-800 bg-zinc-900/70 px-2 py-1 text-xs font-medium text-zinc-300">
            <Globe className="h-3 w-3 text-zinc-400" aria-hidden="true" />
            <span>{langSwitch.shortLabel}</span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="marketing-mobile-menu"
            aria-label={menuToggleAriaLabel}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/70 text-zinc-300 transition hover:bg-zinc-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50">
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobil Açılır Menü */}
      {mobileMenuOpen && (
        <div
          id="marketing-mobile-menu"
          className="border-b border-zinc-800 bg-[#141416]/98 px-4 pb-6 pt-4 shadow-2xl backdrop-blur-xl md:hidden sm:px-6">
          <div className="flex flex-col space-y-3">
            <Link
              href={pricingHref}
              onClick={() => setMobileMenuOpen(false)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isPricingActive
                  ? "bg-zinc-800/70 text-[#F4F4F2]"
                  : "text-zinc-300 hover:bg-zinc-800/40 hover:text-white"
              }`}>
              {pricingLabel}
            </Link>

            {onContactClick && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onContactClick();
                }}
                className="flex w-full items-center justify-center rounded-lg border border-zinc-700/70 bg-zinc-800/60 px-4 py-2.5 text-sm font-medium text-zinc-200 transition hover:bg-zinc-750 hover:text-white">
                {contactLabel}
              </button>
            )}

            {isLoggedIn ? (
              <Link
                href="/event-types"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-xs transition hover:bg-emerald-500">
                {dashboardLabel}
              </Link>
            ) : (
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-xs transition hover:bg-emerald-500">
                {loginLabel}
              </Link>
            )}

            <div className="flex items-center justify-between border-t border-zinc-800/80 pt-3 text-xs text-zinc-400">
              <span>{locale === "tr" ? "Dil:" : "Language:"}</span>
              <Link
                href={langSwitch.href}
                hrefLang={langSwitch.hrefLang}
                lang={langSwitch.hrefLang}
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 text-zinc-200 hover:text-white">
                <Globe className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
                <span>{langSwitch.label}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
