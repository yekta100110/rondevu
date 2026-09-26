import { APP_NAME } from "@calcom/lib/constants";
import { getPlanContactConfig } from "@calcom/lib/planContactConfig";
import { _generateMetadata } from "app/_utils";
import type { Metadata } from "next";
import { PrivacyView } from "~/legal/privacy-view";

export const generateMetadata = async (): Promise<Metadata> => {
  const baseMetadata = await _generateMetadata(
    () => `Gizlilik Politikası | ${APP_NAME}`,
    () =>
      "rOndevu Gizlilik Politikası ve KVKK Aydınlatma Metni. Kişisel verilerin işlenmesi, Twilio/Cloudflare alt işleyenleri ve kullanıcı hakları.",
    true,
    undefined,
    "/privacy"
  );

  return {
    ...baseMetadata,
    keywords: [
      "gizlilik politikası",
      "kvkk aydınlatma metni",
      "veri güvenliği",
      "rOndevu gizlilik",
      "subprocessors",
      APP_NAME,
    ],
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      ...baseMetadata.openGraph,
      title: `Gizlilik Politikası | ${APP_NAME}`,
      description:
        "rOndevu Gizlilik Politikası ve KVKK Aydınlatma Metni. Kişisel verilerin işlenmesi, Twilio/Cloudflare alt işleyenleri ve kullanıcı hakları.",
      locale: "tr_TR",
      type: "website",
    },
  };
};

export default async function PrivacyPage() {
  const initialContact = await getPlanContactConfig();
  return <PrivacyView initialContact={initialContact} />;
}
