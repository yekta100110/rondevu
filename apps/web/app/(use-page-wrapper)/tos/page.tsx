import { APP_NAME } from "@calcom/lib/constants";
import { getPlanContactConfig } from "@calcom/lib/planContactConfig";
import { _generateMetadata } from "app/_utils";
import type { Metadata } from "next";
import { TosView } from "~/legal/tos-view";

export const generateMetadata = async (): Promise<Metadata> => {
  const title = `Kullanım Koşulları | ${APP_NAME}`;
  const description =
    "rOndevu Kullanım Koşulları: randevu ve abonelik akışı, takvim ve SMS entegrasyonları, sorumluluk sınırları ile kabul edilebilir kullanım ilkeleri.";

  const baseMetadata = await _generateMetadata(
    () => title,
    () => description,
    true,
    undefined,
    "/tos"
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

export default async function TosPage() {
  const initialContact = await getPlanContactConfig();
  return <TosView initialContact={initialContact} />;
}
