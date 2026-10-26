import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import type { Locale } from "../i18n/home-translations";

export function MarketingFooter({ locale }: { locale: Locale }) {
  return (
    <footer className="relative z-10 border-t border-subtle/70 bg-default px-4 py-12 text-center sm:px-6">
      <Link href="/" aria-label="rOndevu Anasayfa" className="inline-flex items-center justify-center">
        <BrandLogo placement="footer" />
      </Link>
      <nav aria-label={locale === "tr" ? "Yasal bağlantılar" : "Legal links"} className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-subtle">
        <Link href="/tos" className="transition-colors hover:text-emphasis">
          {locale === "tr" ? "Kullanım Koşulları" : "Terms of Service"}
        </Link>
        <Link href="/privacy" className="transition-colors hover:text-emphasis">
          {locale === "tr" ? "Gizlilik Politikası" : "Privacy Policy"}
        </Link>
      </nav>
      <p className="mt-6 text-sm text-subtle">
        © {new Date().getFullYear()} rOndevu. {locale === "tr" ? "Tüm hakları saklıdır." : "All rights reserved."}
      </p>
    </footer>
  );
}
