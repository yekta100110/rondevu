import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import { APP_NAME, WEBSITE_URL } from "@calcom/lib/constants";
import { getPlanContactConfig } from "@calcom/lib/planContactConfig";
import { PricingSchema } from "@components/schemas/MarketingSchemas";
import { buildLegacyRequest } from "@lib/buildLegacyCtx";
import { _generateMetadata, loadCalMarketingAssets } from "app/_utils";
import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { PricingView } from "~/pricing/pricing-view";
import type { Locale } from "~/home/i18n/home-translations";

import "../../../public/cal_files/cal-framer.css";
import "../../../public/cal_files/cal-pricing-framer.css";

const SITE_URL = WEBSITE_URL.replace(/\/+$/, "");
const PRICING_LANGUAGES = {
  tr: `${SITE_URL}/pricing`,
  en: `${SITE_URL}/en/pricing`,
  "x-default": `${SITE_URL}/pricing`,
};

const generateMetadata = async (): Promise<Metadata> => {
  const baseMetadata = await _generateMetadata(
    () => `Fiyatlandırma - ${APP_NAME}`,
    () =>
      "rOndevu şeffaf ve net fiyatlandırma: Aylık ve yıllık esnek paketler, sınırsız randevu, SMS doğrulaması ve takvim senkronizasyonu.",
    true,
    SITE_URL,
    "/pricing",
    PRICING_LANGUAGES,
    "tr_TR"
  );

  return {
    ...baseMetadata,
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      ...baseMetadata.openGraph,
      title: `Fiyatlandırma - ${APP_NAME}`,
      description:
        "rOndevu şeffaf ve net fiyatlandırma: Aylık ve yıllık esnek paketler, sınırsız randevu, SMS doğrulaması ve takvim senkronizasyonu.",
      locale: "tr_TR",
      type: "website",
    },
  };
};

const PricingPage = async () => {
  const requestHeaders = await headers();
  const session = await getServerSession({ req: buildLegacyRequest(requestHeaders, await cookies()) });
  const isLoggedIn = !!session?.user?.id;
  const initialContact = await getPlanContactConfig();
  const initialLocale: Locale = "tr";

  const { html, svgTemplates } = loadCalMarketingAssets("pricing-dom-tr.html");

  return (
    <>
      <PricingSchema contact={initialContact} locale={initialLocale} />
      <PricingView
        html={html}
        svgTemplates={svgTemplates}
        isLoggedIn={isLoggedIn}
        initialContact={initialContact}
        initialLocale={initialLocale}
      />
    </>
  );
};

export { generateMetadata };
export default PricingPage;
