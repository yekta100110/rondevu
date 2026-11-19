"use client";

import { trpc } from "@rondevu/trpc/react";
import { Globe, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "../i18n/home-translations";
import { Wordmark } from "./BrandLogo";

const DEFAULT_SUPPORT_EMAIL = "destek@rondevu.org";
const DEFAULT_SUPPORT_PHONE = "0552 119 19 87";

interface MarketingFooterContact {
  phone?: string;
  email?: string;
  whatsapp?: string;
}

interface MarketingFooterProps {
  locale: Locale;
  initialContact?: MarketingFooterContact;
}

export function MarketingFooter({ locale, initialContact }: MarketingFooterProps) {
  const pathname = usePathname();
  const normalizedPath = pathname && pathname !== "/" ? pathname.replace(/\/+$/, "") : "/";
  const homeHref = locale === "en" ? "/en" : "/";
  const pricingHref = locale === "en" ? "/en/pricing" : "/pricing";
  const tr = locale === "tr";

  const languageSwitch = (() => {
    if (normalizedPath === "/en") return { href: "/", label: "Türkçe", hrefLang: "tr" };
    if (normalizedPath === "/en/pricing") return { href: "/pricing", label: "Türkçe", hrefLang: "tr" };
    if (normalizedPath === "/pricing") return { href: "/en/pricing", label: "English", hrefLang: "en" };
    if (normalizedPath === "/") return { href: "/en", label: "English", hrefLang: "en" };
    return locale === "en"
      ? { href: "/", label: "Türkçe", hrefLang: "tr" }
      : { href: "/en", label: "English", hrefLang: "en" };
  })();

  const { data: contactConfig } = trpc.viewer.public.getPlanContact.useQuery(undefined, {
    staleTime: 30000,
  });

  const resolvedContact = contactConfig ?? initialContact;
  const email = resolvedContact?.email || DEFAULT_SUPPORT_EMAIL;
  const phone =
    resolvedContact?.phone && resolvedContact.phone !== "0850 000 00 00"
      ? resolvedContact.phone
      : DEFAULT_SUPPORT_PHONE;
  const cleanPhone = phone.replace(/[^\d+]/g, "");

  const linkClass = "transition-colors hover:text-foreground";

  return (
    <footer className="relative z-10 border-border border-t bg-background">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[minmax(0,1fr)_auto]">
        <div className="grid content-start gap-4">
          <Link href={homeHref} aria-label={tr ? "rOndevu Ana Sayfa" : "rOndevu Home"} className="justify-self-start">
            <Wordmark />
          </Link>
          <div className="grid gap-2 text-muted-foreground text-sm">
            <a href={`mailto:${email}`} className={`inline-flex items-center gap-2 ${linkClass}`}>
              <Mail className="size-3.5" aria-hidden="true" />
              <span>{email}</span>
            </a>
            <a href={`tel:${cleanPhone}`} className={`inline-flex items-center gap-2 font-mono tabular-nums ${linkClass}`}>
              <Phone className="size-3.5" aria-hidden="true" />
              <span>{phone}</span>
            </a>
          </div>
        </div>
        <nav
          aria-label={tr ? "Alt menü ve yasal bağlantılar" : "Footer navigation and legal links"}
          className="grid grid-cols-2 gap-x-12 gap-y-2.5 text-muted-foreground text-sm sm:grid-cols-3">
          <Link href={homeHref} className={linkClass}>
            {tr ? "Ana Sayfa" : "Home"}
          </Link>
          <Link href={pricingHref} className={linkClass}>
            {tr ? "Fiyatlandırma" : "Pricing"}
          </Link>
          <Link href={locale === "en" ? "/plan-bilgi?lang=en" : "/plan-bilgi"} className={linkClass}>
            {tr ? "İletişim & Aktivasyon" : "Contact & Activation"}
          </Link>
          <Link href="/tos" className={linkClass}>
            {tr ? "Kullanım Koşulları" : "Terms of Service"}
          </Link>
          <Link href="/privacy" className={linkClass}>
            {tr ? "Gizlilik Politikası" : "Privacy Policy"}
          </Link>
          <Link href="/auth/login" className={linkClass}>
            {tr ? "Giriş Yap" : "Sign In"}
          </Link>
        </nav>
      </div>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 border-border border-t px-4 py-6 text-muted-foreground text-xs sm:px-6">
        <span>
          © {new Date().getFullYear()} rOndevu. {tr ? "Tüm hakları saklıdır." : "All rights reserved."}
        </span>
        <Link
          href={languageSwitch.href}
          hrefLang={languageSwitch.hrefLang}
          lang={languageSwitch.hrefLang}
          className={`inline-flex items-center gap-1.5 ${linkClass}`}>
          <Globe className="size-3.5" aria-hidden="true" />
          <span>{languageSwitch.label}</span>
        </Link>
      </div>
    </footer>
  );
}
