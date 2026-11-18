import { getServerSession } from "@rondevu/features/auth/lib/getServerSession";
import { APP_NAME, WEBSITE_URL } from "@rondevu/lib/constants";
import { getPlanContactConfig } from "@rondevu/lib/planContactConfig";
import { HomeSchema } from "@components/schemas/MarketingSchemas";
import { buildLegacyRequest } from "@lib/buildLegacyCtx";
import { _generateMetadata } from "app/_utils";
import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { HomeView } from "~/home/home-view";
import type { Locale } from "~/home/i18n/home-translations";


const SITE_URL = WEBSITE_URL.replace(/\/+$/, "");
const HOME_LANGUAGES = {
  tr: SITE_URL,
  en: `${SITE_URL}/en`,
  "x-default": SITE_URL,
};

const generateMetadata = async (): Promise<Metadata> => {
  const baseMetadata = await _generateMetadata(
    () => `${APP_NAME} - Herkes İçin Randevu Sistemi`,
    () =>
      "Müsait saatlerinizi belirleyin, kurallarınızı koyun; randevu alma, doğrulama, SMS hatırlatma ve takvim senkronizasyonunu tek merkezden yönetin.",
    true,
    SITE_URL,
    "/",
    HOME_LANGUAGES,
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
      title: `${APP_NAME} - Herkes İçin Randevu Sistemi`,
      description:
        "Müsait saatlerinizi belirleyin, kurallarınızı koyun; randevu alma, doğrulama, SMS hatırlatma ve takvim senkronizasyonunu tek merkezden yönetin.",
      locale: "tr_TR",
      type: "website",
    },
  };
};

const HomePage = async () => {
  const requestHeaders = await headers();
  const [session, contact] = await Promise.all([
    getServerSession({ req: buildLegacyRequest(requestHeaders, await cookies()) }),
    getPlanContactConfig(),
  ]);
  const isLoggedIn = !!session?.user?.id;
  const initialLocale: Locale = "tr";

  return (
    <>
      <HomeSchema contact={contact} locale={initialLocale} />
      <HomeView
        isLoggedIn={isLoggedIn}
        initialContact={contact}
        initialLocale={initialLocale}
      />
    </>
  );
};

export { generateMetadata };
export default HomePage;
