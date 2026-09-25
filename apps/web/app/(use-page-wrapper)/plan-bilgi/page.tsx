import { APP_NAME } from "@calcom/lib/constants";
import { getPlanContactConfig } from "@calcom/lib/planContactConfig";
import { _generateMetadata } from "app/_utils";
import type { Metadata } from "next";
import { PlanBilgiView } from "~/plan-bilgi/plan-bilgi-view";

export const generateMetadata = async (): Promise<Metadata> => {
  const baseMetadata = await _generateMetadata(
    () => `Hesap Aktivasyonu | ${APP_NAME}`,
    () =>
      "Hesabınızı hemen açıp profil linkinizi teslim edelim. Başlamak veya aklınıza takılanları sormak için doğrudan bize yazabilirsiniz.",
    true,
    undefined,
    "/plan-bilgi"
  );

  return {
    ...baseMetadata,
    keywords: [
      "hesap aktivasyonu",
      "rOndevu aktivasyon",
      "iletişim",
      "danışma",
      "bireysel randevu sistemi",
      APP_NAME,
    ],
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      ...baseMetadata.openGraph,
      title: `Hesap Aktivasyonu | ${APP_NAME}`,
      description:
        "Hesabınızı hemen açıp profil linkinizi teslim edelim. Başlamak veya aklınıza takılanları sormak için doğrudan bize yazabilirsiniz.",
      locale: "tr_TR",
      type: "website",
    },
  };
};

export default async function PlanBilgiPage() {
  const initialContact = await getPlanContactConfig();
  return <PlanBilgiView initialContact={initialContact} />;
}
