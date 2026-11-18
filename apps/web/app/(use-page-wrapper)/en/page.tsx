import { getServerSession } from "@rondevu/features/auth/lib/getServerSession";
import { APP_NAME, WEBSITE_URL } from "@rondevu/lib/constants";
import { getPlanContactConfig } from "@rondevu/lib/planContactConfig";
import { HomeSchema } from "@components/schemas/MarketingSchemas";
import { buildLegacyRequest } from "@lib/buildLegacyCtx";
import { _generateMetadata, loadCalMarketingAssets } from "app/_utils";
import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { HomeView } from "~/home/home-view";
import type { Locale } from "~/home/i18n/home-translations";

import "../../../public/cal_files/cal-framer.css";

const SITE_URL = WEBSITE_URL.replace(/\/+$/, "");
const HOME_LANGUAGES = {
  tr: SITE_URL,
  en: `${SITE_URL}/en`,
  "x-default": SITE_URL,
};

const generateMetadata = async (): Promise<Metadata> => {
  const title = `${APP_NAME} - Clear & Simple Appointment Scheduling`;
  const description =
    "Set your availability and booking rules; manage online scheduling, SMS verification, automated reminders, and calendar sync in one place.";

  const baseMetadata = await _generateMetadata(
    () => title,
    () => description,
    true,
    SITE_URL,
    "/en",
    HOME_LANGUAGES,
    "en_US"
  );

  return {
    ...baseMetadata,
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      ...baseMetadata.openGraph,
      title,
      description,
      locale: "en_US",
      type: "website",
    },
  };
};

const EnglishHomePage = async () => {
  const requestHeaders = await headers();
  const [session, contact] = await Promise.all([
    getServerSession({ req: buildLegacyRequest(requestHeaders, await cookies()) }),
    getPlanContactConfig(),
  ]);
  const isLoggedIn = !!session?.user?.id;
  const initialLocale: Locale = "en";

  const { html, svgTemplates } = loadCalMarketingAssets("cal-dom-en.html", { extractBody: true });

  return (
    <>
      <HomeSchema contact={contact} locale={initialLocale} />
      <HomeView
        html={html}
        svgTemplates={svgTemplates}
        isLoggedIn={isLoggedIn}
        initialContact={contact}
        initialLocale={initialLocale}
      />
    </>
  );
};

export { generateMetadata };
export default EnglishHomePage;
