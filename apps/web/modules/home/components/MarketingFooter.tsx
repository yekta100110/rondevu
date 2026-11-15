"use client";

import { trpc } from "@calcom/trpc/react";
import { Globe, Mail, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "../i18n/home-translations";
import { BrandLogo } from "./BrandLogo";

const DEFAULT_SUPPORT_EMAIL = "destek@rondevu.org";
const DEFAULT_SUPPORT_PHONE = "0552 119 19 87";
const DEFAULT_SUPPORT_WHATSAPP = "905521191987";

export interface MarketingFooterContact {
  phone?: string;
  email?: string;
  whatsapp?: string;
}

export interface MarketingFooterProps {
  locale: Locale;
  initialContact?: MarketingFooterContact;
}

export function MarketingFooter({ locale, initialContact }: MarketingFooterProps) {
  const pathname = usePathname();
  const normalizedPath = pathname && pathname !== "/" ? pathname.replace(/\/+$/, "") : "/";
  const homeHref = locale === "en" ? "/en" : "/";
  const pricingHref = locale === "en" ? "/en/pricing" : "/pricing";

  const languageSwitch = (() => {
    if (normalizedPath === "/en") {
      return { href: "/", label: "Türkçe", hrefLang: "tr" };
    }
    if (normalizedPath === "/en/pricing") {
      return { href: "/pricing", label: "Türkçe", hrefLang: "tr" };
    }
    if (normalizedPath.startsWith("/en/")) {
      return {
        href: normalizedPath.replace(/^\/en/, "") || "/",
        label: "Türkçe",
        hrefLang: "tr",
      };
    }
    if (normalizedPath === "/pricing") {
      return { href: "/en/pricing", label: "English", hrefLang: "en" };
    }
    if (normalizedPath === "/") {
      return { href: "/en", label: "English", hrefLang: "en" };
    }
    return locale === "en"
      ? {
          href: normalizedPath.replace(/^\/en/, "") || "/",
          label: "Türkçe",
          hrefLang: "tr",
        }
      : { href: `/en${normalizedPath}`, label: "English", hrefLang: "en" };
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
  const whatsapp = resolvedContact?.whatsapp || DEFAULT_SUPPORT_WHATSAPP;
  const cleanWhatsApp = whatsapp.replace(/[^\d]/g, "");

  return (
    <footer className="relative z-10 border-t border-zinc-800/80 bg-[#111214] text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 lg:gap-12">
          {/* Marka ve Açıklama */}
          <div className="space-y-4 md:col-span-1">
            <Link
              href={homeHref}
              aria-label={locale === "tr" ? "rOndevu Ana Sayfa" : "rOndevu Home"}
              className="inline-block transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50">
              <BrandLogo placement="footer" />
            </Link>
            <p className="max-w-xs text-xs leading-relaxed text-zinc-400">
              {locale === "tr"
                ? "Bireysel profesyoneller ve ekipler için modern, kesintisiz randevu ve rezervasyon yönetimi."
                : "Modern, seamless appointment scheduling and booking management for professionals and teams."}
            </p>
          </div>

          {/* Ürün Bağlantıları */}
          <div>
            <h3 className="text-sm font-medium text-[#F4F4F2]">{locale === "tr" ? "Ürün" : "Product"}</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href={homeHref} className="transition-colors hover:text-[#F4F4F2]">
                  {locale === "tr" ? "Ana Sayfa" : "Home"}
                </Link>
              </li>
              <li>
                <Link href={pricingHref} className="transition-colors hover:text-[#F4F4F2]">
                  {locale === "tr" ? "Fiyatlandırma" : "Pricing"}
                </Link>
              </li>
              <li>
                <Link
                  href={locale === "en" ? "/plan-bilgi?lang=en" : "/plan-bilgi"}
                  className="transition-colors hover:text-[#F4F4F2]">
                  {locale === "tr" ? "İletişim & Aktivasyon" : "Contact & Activation"}
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="transition-colors hover:text-[#F4F4F2]">
                  {locale === "tr" ? "Giriş Yap" : "Sign In"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Yasal Bağlantılar */}
          <div>
            <h3 className="text-sm font-medium text-[#F4F4F2]">{locale === "tr" ? "Yasal" : "Legal"}</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/tos" className="transition-colors hover:text-[#F4F4F2]">
                  {locale === "tr" ? "Kullanım Koşulları" : "Terms of Service"}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="transition-colors hover:text-[#F4F4F2]">
                  {locale === "tr" ? "Gizlilik Politikası" : "Privacy Policy"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Doğrudan İletişim */}
          <div>
            <h3 className="text-sm font-medium text-[#F4F4F2]">
              {locale === "tr" ? "Doğrudan İletişim" : "Direct Contact"}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 transition-colors hover:text-[#F4F4F2]">
                  <Mail className="h-4 w-4 text-zinc-500" aria-hidden="true" />
                  <span>{email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${cleanPhone}`}
                  className="inline-flex items-center gap-2 transition-colors hover:text-[#F4F4F2]">
                  <Phone className="h-4 w-4 text-zinc-500" aria-hidden="true" />
                  <span>{phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${cleanWhatsApp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors hover:text-emerald-400">
                  <MessageCircle className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                  <span>WhatsApp</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Alt Bilgi Çubuğu: Telif, Çatı Marka İmzası ve Dil Geçişi */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-800/80 pt-8 sm:flex-row text-xs text-zinc-500">
          <p>© 2026 rOndevu. {locale === "tr" ? "Tüm hakları saklıdır." : "All rights reserved."}</p>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <a
              href="https://yaska.works"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-zinc-300">
              Built by Yaska Works
            </a>

            <Link
              href={languageSwitch.href}
              hrefLang={languageSwitch.hrefLang}
              lang={languageSwitch.hrefLang}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-[#F4F4F2]">
              <Globe className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
              <span>{languageSwitch.label}</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
