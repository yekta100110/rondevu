import { APP_NAME } from "@calcom/lib/constants";
import { getPlanContactConfig } from "@calcom/lib/planContactConfig";
import { _generateMetadata } from "app/_utils";
import type { Metadata } from "next";
import { TosView } from "~/legal/tos-view";

export const generateMetadata = async (): Promise<Metadata> => {
  const baseMetadata = await _generateMetadata(
    () => `Kullanım Koşulları | ${APP_NAME}`,
    () =>
      "rOndevu Kullanım Koşulları ve Hizmet Şartları. Randevu sistemi kuralları, sorumluluk sınırları ve kabul edilebilir kullanım ilkeleri.",
    true,
    undefined,
    "/tos"
  );

  return {
    ...baseMetadata,
    keywords: [
      "kullanım koşulları",
      "hizmet şartları",
      "terms of service",
      "randevu yazılımı kuralları",
      "anti-spam politikası",
      APP_NAME,
    ],
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      ...baseMetadata.openGraph,
      title: `Kullanım Koşulları | ${APP_NAME}`,
      description:
        "rOndevu Kullanım Koşulları ve Hizmet Şartları. Randevu sistemi kuralları, sorumluluk sınırları ve kabul edilebilir kullanım ilkeleri.",
      locale: "tr_TR",
      type: "website",
    },
  };
};

export default async function TosPage() {
  const initialContact = await getPlanContactConfig();
  return <TosView initialContact={initialContact} />;
}
