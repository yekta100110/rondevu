import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import { APP_NAME } from "@calcom/lib/constants";
import { buildLegacyRequest } from "@lib/buildLegacyCtx";
import { _generateMetadata } from "app/_utils";
import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { HomeView } from "~/home/home-view";

const generateMetadata = async (): Promise<Metadata> => {
  const baseMetadata = await _generateMetadata(
    () => `${APP_NAME} - Herkes İçin Randevu Sistemi`,
    () =>
      "Müsait saatlerinizi belirleyin, kurallarınızı koyun; randevu alma, doğrulama, SMS hatırlatma ve takvim senkronizasyonunu tek merkezden yönetin.",
    true,
    undefined,
    "/"
  );

  return {
    ...baseMetadata,
    keywords: [
      "herkes için randevu sistemi",
      "randevu platformu",
      "online randevu",
      "danışan randevu sistemi",
      "Google Takvim randevu",
      "Google Meet randevu",
      "biyografi randevu linki",
      "randevu güvenliği",
      "komisyonsuz randevu",
      APP_NAME,
    ],
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
  const session = await getServerSession({ req: buildLegacyRequest(await headers(), await cookies()) });
  const isLoggedIn = !!session?.user?.id;

  const publicDir = path.join(process.cwd(), "public", "cal_files");
  const trHtml = fs.readFileSync(path.join(publicDir, "cal-dom-tr.html"), "utf8");
  const enHtml = fs.readFileSync(path.join(publicDir, "cal-dom-en.html"), "utf8");
  const svgTemplates = fs.readFileSync(path.join(publicDir, "svg-templates.html"), "utf8");

  return <HomeView trHtml={trHtml} enHtml={enHtml} svgTemplates={svgTemplates} isLoggedIn={isLoggedIn} />;
};

export { generateMetadata };
export default HomePage;
