"use client";

import { trpc } from "@calcom/trpc/react";
import { Globe, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "./BrandLogo";
import type { Locale } from "../i18n/home-translations";

const DEFAULT_SUPPORT_EMAIL = "destek@rondevu.org";
const DEFAULT_SUPPORT_PHONE = "0552 119 19 87";

export function MarketingFooter({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const normalizedPath = pathname && pathname !== "/" ? pathname.replace(/\/+$/, "") : "/";

  const languageSwitch = (() => {
    if (normalizedPath === "/en") {
      return { href: "/", label: "Türkçe", hrefLang: "tr" };
    }
    if (normalizedPath === "/en/pricing") {
      return { href: "/pricing", label: "Türkçe", hrefLang: "tr" };
    }
    if (normalizedPath === "/pricing") {
      return { href: "/en/pricing", label: "English", hrefLang: "en" };
    }
    if (normalizedPath === "/") {
      return { href: "/en", label: "English", hrefLang: "en" };
    }
    return locale === "en"
      ? { href: "/", label: "Türkçe", hrefLang: "tr" }
      : { href: "/en", label: "English", hrefLang: "en" };
  })();

  const { data: contactConfig } = trpc.viewer.public.getPlanContact.useQuery(undefined, {
    staleTime: 30000,
  });

  const email = contactConfig?.email || DEFAULT_SUPPORT_EMAIL;
  const phone =
    contactConfig?.phone && contactConfig.phone !== "0850 000 00 00"
      ? contactConfig.phone
      : DEFAULT_SUPPORT_PHONE;
  const cleanPhone = phone.replace(/[^\d+]/g, "");

  return (
    <footer className="relative z-10 border-t border-subtle/70 bg-default px-4 py-12 text-center sm:px-6">
      <Link href="/" aria-label="rOndevu Anasayfa" className="inline-flex items-center justify-center">
        <BrandLogo placement="footer" />
      </Link>
      <nav
        aria-label={locale === "tr" ? "Alt menü ve yasal bağlantılar" : "Footer navigation and legal links"}
        className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-subtle">
        <Link href="/pricing" className="transition-colors hover:text-emphasis">
          {locale === "tr" ? "Fiyatlandırma" : "Pricing"}
        </Link>
        <Link href="/plan-bilgi" className="transition-colors hover:text-emphasis">
          {locale === "tr" ? "İletişim & Aktivasyon" : "Contact & Activation"}
        </Link>
        <Link href="/tos" className="transition-colors hover:text-emphasis">
          {locale === "tr" ? "Kullanım Koşulları" : "Terms of Service"}
        </Link>
        <Link href="/privacy" className="transition-colors hover:text-emphasis">
          {locale === "tr" ? "Gizlilik Politikası" : "Privacy Policy"}
        </Link>
        <Link
          href={languageSwitch.href}
          hrefLang={languageSwitch.hrefLang}
          lang={languageSwitch.hrefLang}
          className="inline-flex items-center gap-1 transition-colors hover:text-emphasis">
          <Globe className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{languageSwitch.label}</span>
        </Link>
      </nav>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-subtle">
        <a
          href={`mailto:${email}`}
          className="inline-flex items-center gap-1.5 transition-colors hover:text-emphasis">
          <Mail className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{email}</span>
        </a>
        <a
          href={`tel:${cleanPhone}`}
          className="inline-flex items-center gap-1.5 transition-colors hover:text-emphasis">
          <Phone className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{phone}</span>
        </a>
      </div>
      <p className="mt-5 text-sm text-subtle">
        © {new Date().getFullYear()} rOndevu. {locale === "tr" ? "Tüm hakları saklıdır." : "All rights reserved."}
      </p>
    </footer>
  );
}
