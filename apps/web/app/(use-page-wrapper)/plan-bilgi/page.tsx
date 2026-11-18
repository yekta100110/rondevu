import { APP_NAME, WEBSITE_URL } from "@rondevu/lib/constants";
import { getPlanContactConfig } from "@rondevu/lib/planContactConfig";
import { PlanBilgiSchema } from "@components/schemas/MarketingSchemas";
import { _generateMetadata } from "app/_utils";
import type { Metadata } from "next";
import type { Locale } from "~/home/i18n/home-translations";
import { PlanBilgiView } from "~/plan-bilgi/plan-bilgi-view";

const SITE_URL = WEBSITE_URL.replace(/\/+$/, "");

interface PlanBilgiPageProps {
  searchParams?: Promise<{ lang?: string; plan?: string }>;
}

function resolvePlan(rawPlan?: string): "monthly" | "yearly" | null {
  if (rawPlan === "monthly" || rawPlan === "yearly") return rawPlan;
  return null;
}

export const generateMetadata = async ({ searchParams }: PlanBilgiPageProps = {}): Promise<Metadata> => {
  const resolvedParams = searchParams ? await searchParams : undefined;
  const locale: Locale = resolvedParams?.lang === "en" ? "en" : "tr";
  const isEn = locale === "en";

  const title = isEn
    ? `Account Activation and Contact | ${APP_NAME}`
    : `Hesap Aktivasyonu ve İletişim | ${APP_NAME}`;
  const description = isEn
    ? "Activate your rOndevu account and receive your personal booking link. Reach out via WhatsApp, phone, or email for fast setup, plan selection, and support."
    : "rOndevu hesabınızı hemen aktive edip kişisel randevu linkinizi alın. Kurulum, plan seçimi ve destek için WhatsApp, telefon ya da e-posta ile ulaşın.";

  const canonicalPath = isEn ? "/plan-bilgi?lang=en" : "/plan-bilgi";
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;
  const languages = {
    tr: `${SITE_URL}/plan-bilgi`,
    en: `${SITE_URL}/plan-bilgi?lang=en`,
    "x-default": `${SITE_URL}/plan-bilgi`,
  };

  const baseMetadata = await _generateMetadata(
    () => title,
    () => description,
    true,
    SITE_URL,
    canonicalPath,
    languages,
    isEn ? "en_US" : "tr_TR"
  );

  return {
    ...baseMetadata,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      ...baseMetadata.openGraph,
      title,
      description,
      url: canonicalUrl,
      locale: isEn ? "en_US" : "tr_TR",
      type: "website",
    },
  };
};

export default async function PlanBilgiPage({ searchParams }: PlanBilgiPageProps = {}) {
  const resolvedParams = searchParams ? await searchParams : undefined;
  const locale: Locale = resolvedParams?.lang === "en" ? "en" : "tr";
  const plan = resolvePlan(resolvedParams?.plan);
  const initialContact = await getPlanContactConfig();

  return (
    <>
      <PlanBilgiSchema contact={initialContact} locale={locale} plan={plan} />
      <PlanBilgiView initialContact={initialContact} initialLocale={locale} />
    </>
  );
}
