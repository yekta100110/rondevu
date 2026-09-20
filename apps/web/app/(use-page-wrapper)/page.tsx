import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import { APP_NAME } from "@calcom/lib/constants";
import { buildLegacyRequest } from "@lib/buildLegacyCtx";
import { _generateMetadata } from "app/_utils";
import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { HomeView } from "~/home/home-view";

const generateMetadata = async (): Promise<Metadata> => {
  const baseMetadata = await _generateMetadata(
    () => `${APP_NAME} - Bireysel Uzmanlar İçin Randevu Altyapısı`,
    () =>
      "Müsait saatlerinizi paylaşın, randevuyu danışanınız alsın. Takviminizi bağlayın, linkinizi biyografinize ekleyin; Google Takvim ve Meet ile otomatik eşleşsin.",
    true,
    undefined,
    "/"
  );

  return {
    ...baseMetadata,
    keywords: [
      "bireysel uzmanlar için randevu",
      "randevu altyapısı",
      "online randevu",
      "danışan randevu sistemi",
      "Google Takvim randevu",
      "Google Meet randevu",
      "biyografi randevu linki",
      "no-show koruması",
      "komisyonsuz randevu",
      APP_NAME,
    ],
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      ...baseMetadata.openGraph,
      title: `${APP_NAME} - Bireysel Uzmanlar İçin Randevu Altyapısı`,
      description:
        "Müsait saatlerinizi paylaşın, randevuyu danışanınız alsın. Takviminizi bağlayın, linkinizi biyografinize ekleyin.",
      locale: "tr_TR",
      type: "website",
    },
  };
};

const HomePage = async () => {
  const session = await getServerSession({ req: buildLegacyRequest(await headers(), await cookies()) });
  const isLoggedIn = !!session?.user?.id;

  return <HomeView isLoggedIn={isLoggedIn} />;
};

export { generateMetadata };
export default HomePage;
