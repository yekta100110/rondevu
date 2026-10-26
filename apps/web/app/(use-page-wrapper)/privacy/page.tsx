import { APP_NAME } from "@calcom/lib/constants";
import { getPlanContactConfig } from "@calcom/lib/planContactConfig";
import { _generateMetadata } from "app/_utils";
import type { Metadata } from "next";
import { PrivacyView } from "~/legal/privacy-view";

export const generateMetadata = async (): Promise<Metadata> => {
  const baseMetadata = await _generateMetadata(
    () => `Gizlilik Politikası | ${APP_NAME}`,
    () =>
      "rOndevu Gizlilik Politikası. Hesap, randevu ve teknik verilerin kullanımı ile başvuru yolları.",
    true,
    undefined,
    "/privacy"
  );

  return {
    ...baseMetadata,
    keywords: [
      "gizlilik politikası",
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
        "rOndevu Gizlilik Politikası. Hesap, randevu ve teknik verilerin kullanımı ile başvuru yolları.",
      locale: "tr_TR",
      type: "website",
    },
  };
};

export default async function PrivacyPage() {
  const initialContact = await getPlanContactConfig();
  return <PrivacyView initialContact={initialContact} />;
}
