import { APP_NAME } from "@calcom/lib/constants";
import { getPlanContactConfig } from "@calcom/lib/planContactConfig";
import { PlanBilgiSchema } from "@components/schemas/MarketingSchemas";
import { _generateMetadata } from "app/_utils";
import type { Metadata } from "next";
import { PlanBilgiView } from "~/plan-bilgi/plan-bilgi-view";

export const generateMetadata = async (): Promise<Metadata> => {
  const title = `Hesap Aktivasyonu ve İletişim | ${APP_NAME}`;
  const description =
    "rOndevu hesabınızı hemen aktive edip kişisel randevu linkinizi alın. Kurulum, plan seçimi ve destek için WhatsApp, telefon ya da e-posta ile ulaşın.";

  const baseMetadata = await _generateMetadata(
    () => title,
    () => description,
    true,
    undefined,
    "/plan-bilgi"
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

export default async function PlanBilgiPage() {
  const initialContact = await getPlanContactConfig();
  return (
    <>
      <PlanBilgiSchema contact={initialContact} />
      <PlanBilgiView initialContact={initialContact} />
    </>
  );
}
