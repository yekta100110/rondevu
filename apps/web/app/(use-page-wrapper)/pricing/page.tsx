import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import { APP_NAME } from "@calcom/lib/constants";
import { getPlanContactConfig } from "@calcom/lib/planContactConfig";
import { buildLegacyRequest } from "@lib/buildLegacyCtx";
import { _generateMetadata } from "app/_utils";
import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { PricingView } from "~/pricing/pricing-view";

const generateMetadata = async (): Promise<Metadata> => {
  const baseMetadata = await _generateMetadata(
    () => `Fiyatlandırma - ${APP_NAME}`,
    () =>
      "rOndevu şeffaf ve net fiyatlandırma: Aylık ve yıllık esnek paketler, sınırsız randevu, SMS doğrulaması ve takvim senkronizasyonu.",
    true,
    undefined,
    "/pricing"
  );

  return {
    ...baseMetadata,
    keywords: [
      "randevu sistemi fiyatları",
      "online randevu ücreti",
      "komisyonsuz randevu",
      "aylık randevu paketi",
      "yıllık randevu paketi",
      APP_NAME,
    ],
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      ...baseMetadata.openGraph,
      title: `Fiyatlandırma - ${APP_NAME}`,
      description:
        "rOndevu şeffaf ve net fiyatlandırma: Aylık ve yıllık esnek paketler, sınırsız randevu, SMS doğrulaması ve takvim senkronizasyonu.",
      locale: "tr_TR",
      type: "website",
    },
  };
};

const PricingPage = async () => {
  const session = await getServerSession({ req: buildLegacyRequest(await headers(), await cookies()) });
  const isLoggedIn = !!session?.user?.id;
  const initialContact = await getPlanContactConfig();

  const publicDir = path.join(process.cwd(), "public", "cal_files");
  const trHtml = fs.readFileSync(path.join(publicDir, "pricing-dom-tr.html"), "utf8");
  const enHtml = fs.readFileSync(path.join(publicDir, "pricing-dom-en.html"), "utf8");
  const svgTemplates = fs.readFileSync(path.join(publicDir, "svg-templates.html"), "utf8");

  return (
    <PricingView
      trHtml={trHtml}
      enHtml={enHtml}
      svgTemplates={svgTemplates}
      isLoggedIn={isLoggedIn}
      initialContact={initialContact}
    />
  );
};

export { generateMetadata };
export default PricingPage;
