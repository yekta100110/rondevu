import { APP_NAME } from "@calcom/lib/constants";
import { getPlanContactConfig } from "@calcom/lib/planContactConfig";
import { _generateMetadata } from "app/_utils";
import type { Metadata } from "next";
import { PrivacyView } from "~/legal/privacy-view";

export const generateMetadata = async (): Promise<Metadata> => {
  const title = `Gizlilik Politikası ve KVKK Aydınlatma Metni | ${APP_NAME}`;
  const description =
    "rOndevu Gizlilik Politikası ve KVKK aydınlatma metni: hesap, randevu, SMS doğrulama ve teknik verilerin işlenmesi, saklanması ve başvuru haklarınız.";

  const baseMetadata = await _generateMetadata(
    () => title,
    () => description,
    true,
    undefined,
    "/privacy"
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
      locale: "tr_TR",
      type: "website",
    },
  };
};

export default async function PrivacyPage() {
  const initialContact = await getPlanContactConfig();
  return <PrivacyView initialContact={initialContact} />;
}
