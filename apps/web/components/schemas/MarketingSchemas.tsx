import type {
  BreadcrumbList,
  FAQPage,
  Graph,
  Offer,
  Organization,
  SoftwareApplication,
  Thing,
  WebPage,
  WebSite,
  WithContext,
} from "schema-dts";

import { APP_NAME, CAL_URL } from "@calcom/lib/constants";

interface MarketingContactInfo {
  phone?: string;
  email?: string;
  whatsapp?: string;
}

interface MarketingSchemaProps {
  locale?: "tr" | "en";
  contact?: MarketingContactInfo;
}

interface PlanBilgiSchemaProps extends MarketingSchemaProps {
  plan?: "monthly" | "yearly" | null;
}

interface FaqItem {
  q: string;
  a: string;
}

const DEFAULT_SUPPORT_PHONE = "0552 119 19 87";
const DEFAULT_SUPPORT_EMAIL = "destek@rondevu.org";
const PLACEHOLDER_PHONE_DIGITS = new Set(["08500000000", "908500000000"]);

const HOME_FAQ_TR: readonly FaqItem[] = [
  {
    q: "Acil bir durumda veya izne çıktığımda randevuları nasıl yönetirim?",
    a: "İzin modunu açtığınızda o günkü randevularınız iptal edilir ve danışanlarınıza açıklama mesajınız WhatsApp, SMS veya e-posta ile otomatik iletilir.",
  },
  {
    q: "Kendi web sitemin adresini (ör. doktorayse.com) bağlayabilir miyim?",
    a: "Evet, kendi alan adınızı sisteme bağlayabilir ve randevu sayfanızı kendi adresiniz üzerinden kesintisiz kullanabilirsiniz.",
  },
  {
    q: "Danışanların SMS doğrulaması yapması neden gerekli?",
    a: "Randevu öncesi telefona 6 haneli kod gönderilerek sahte veya hatalı numaralarla takviminizin doldurulması önlenir.",
  },
  {
    q: "Google Takvim, Apple Calendar veya Outlook bağlantısı nasıl çalışıyor?",
    a: "Google Takvim, Apple Calendar veya Outlook takviminizdeki herhangi bir meşguliyet rOndevu'da o saati otomatik kapatır; yeni alınan randevular da takviminize ve Google Meet, Zoom, Microsoft Teams veya rOndevu Video bağlantılarınıza işlenir.",
  },
  {
    q: "Randevu başına komisyon veya gizli ek bir ücret var mı?",
    a: "Hayır, randevu başına komisyon veya gizli ücret yoktur. Özel alan adı (CNAME), WhatsApp, SMS ve e-posta bildirimleri ile tüm özellikler her iki pakette de tam olarak açıktır.",
  },
  {
    q: "Sistemi kullanmak ve kurulum yapmak için teknik bilgi gerekiyor mu?",
    a: "Hayır, profiliniz dakikalar içinde hazır hale gelir. Takvim eşitleme, WhatsApp/SMS bildirimleri ve özel alan adı kurulumunda ekibimiz doğrudan destek sağlar.",
  },
];

const HOME_FAQ_EN: readonly FaqItem[] = [
  {
    q: "How do I handle emergencies or vacations?",
    a: "Turning on time-off mode pauses your schedule, closes available slots, and automatically notifies affected clients via WhatsApp, SMS, or email.",
  },
  {
    q: "Can I connect my own custom domain (e.g. drsmith.com)?",
    a: "Yes, you can easily map your custom domain and run your booking page under your personal brand.",
  },
  {
    q: "Why is SMS verification required for bookers?",
    a: "A 6-digit code is sent to the client's phone before confirmation, preventing fake submissions and empty slots.",
  },
  {
    q: "How do calendar and video integrations work?",
    a: "Any personal event in your Google, Apple, or Outlook Calendar instantly blocks that time in rOndevu, while new bookings sync automatically with Google Meet, Zoom, Microsoft Teams, or rOndevu Video links.",
  },
  {
    q: "Is there any commission or per-booking fee?",
    a: "No, there are no per-booking commissions or hidden fees. All features—including Custom Domain (CNAME), WhatsApp, SMS, and email notifications, SMS OTP verification, and calendar sync—are included equally in both our monthly and yearly plans.",
  },
  {
    q: "Do I need technical skills to set up and use rOndevu?",
    a: "Not at all. Your profile is ready in minutes, and our team assists you directly with calendar sync, WhatsApp/SMS notifications, and custom domain setup.",
  },
];

function getBaseUrl(): string {
  return (CAL_URL || "https://rondevu.org").replace(/\/+$/, "");
}

function normalizeTelephone(rawPhone?: string): string {
  const candidate = rawPhone?.trim();
  const digitsOnly = candidate ? candidate.replace(/\D/g, "") : "";
  const effectivePhone =
    candidate && digitsOnly && !PLACEHOLDER_PHONE_DIGITS.has(digitsOnly) ? candidate : DEFAULT_SUPPORT_PHONE;

  const cleaned = effectivePhone.replace(/[^\d+]/g, "");
  if (cleaned.startsWith("+")) {
    return cleaned;
  }
  if (cleaned.startsWith("90") && cleaned.length === 12) {
    return `+${cleaned}`;
  }
  if (cleaned.startsWith("0") && cleaned.length === 11) {
    return `+90${cleaned.slice(1)}`;
  }
  if (cleaned.length === 10) {
    return `+90${cleaned}`;
  }
  return cleaned;
}

function resolveContact(contact?: MarketingContactInfo): { email: string; telephone: string } {
  const email = contact?.email?.trim() || DEFAULT_SUPPORT_EMAIL;
  const telephone = normalizeTelephone(contact?.phone);
  return { email, telephone };
}

function buildOrganizationNode(baseUrl: string, contact?: MarketingContactInfo): Organization {
  const { email, telephone } = resolveContact(contact);
  return {
    "@type": "Organization",
    "@id": `${baseUrl}/#org`,
    name: APP_NAME || "rOndevu",
    alternateName: "Rondevu",
    url: baseUrl,
    logo: {
      "@type": "ImageObject",
      url: `${baseUrl}/android-chrome-512x512.png`,
    },
    email,
    telephone,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      telephone,
      email,
      availableLanguage: ["Turkish", "English"],
      areaServed: "TR",
    },
  };
}

function buildPlanOffers(baseUrl: string, isEn: boolean, plan?: "monthly" | "yearly" | null): Offer[] {
  const planBaseUrl = isEn ? `${baseUrl}/plan-bilgi?lang=en` : `${baseUrl}/plan-bilgi`;
  const planSep = isEn ? "&" : "?";

  const monthlyOffer: Offer = {
    "@type": "Offer",
    name: isEn ? "Monthly Plan" : "Aylık Plan",
    description: isEn
      ? "Flexible monthly plan with unlimited appointments and all core features."
      : "Taahhütsüz aylık kullanım; sınırsız randevu ve tüm özelliklere tam erişim.",
    price: 990,
    priceCurrency: "TRY",
    availability: "https://schema.org/InStock",
    url: `${planBaseUrl}${planSep}plan=monthly`,
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: 990,
      priceCurrency: "TRY",
      billingIncrement: 1,
      unitCode: "MON",
    },
  };

  const yearlyOffer: Offer = {
    "@type": "Offer",
    name: isEn ? "Yearly Plan" : "Yıllık Plan",
    description: isEn
      ? "Annual plan with 2 months free and 12-month fixed price guarantee."
      : "2 ay hediye ve 12 ay sabit fiyat garantisi ile tüm özelliklere kesintisiz erişim.",
    price: 9900,
    priceCurrency: "TRY",
    availability: "https://schema.org/InStock",
    url: `${planBaseUrl}${planSep}plan=yearly`,
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: 9900,
      priceCurrency: "TRY",
      billingIncrement: 1,
      unitCode: "ANN",
    },
  };

  if (plan === "monthly") return [monthlyOffer];
  if (plan === "yearly") return [yearlyOffer];
  return [monthlyOffer, yearlyOffer];
}

function buildSoftwareNode(baseUrl: string, isEn: boolean, plan?: "monthly" | "yearly" | null): SoftwareApplication {
  return {
    "@type": "SoftwareApplication",
    "@id": `${baseUrl}/#software`,
    name: APP_NAME || "rOndevu",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: isEn ? `${baseUrl}/en` : baseUrl,
    inLanguage: isEn ? "en-US" : "tr-TR",
    description: isEn
      ? "Online appointment scheduling platform with Google, Apple, and Outlook Calendar sync, Google Meet, Zoom, Microsoft Teams, and rOndevu Video integrations, SMS verification, WhatsApp, SMS, and email notifications/reminders, and custom domain support."
      : "Müsait saatlerinizi belirleyin, kurallarınızı koyun; randevu alma, SMS doğrulama, WhatsApp, SMS ve e-posta bildirimleri/hatırlatmaları ile Google, Apple, Outlook Takvim ve Google Meet, Zoom, Microsoft Teams, rOndevu Video entegrasyonlarını tek merkezden yönetin.",
    featureList: isEn
      ? [
          "Unlimited appointment types and bookings",
          "Google Calendar, Apple Calendar, and Outlook Calendar sync",
          "Google Meet, Zoom, Microsoft Teams, and rOndevu Video integrations",
          "6-digit SMS OTP booker verification",
          "Automated WhatsApp, SMS, and email notifications and reminders",
          "Custom domain mapping",
          "Time-off mode and buffer time management",
        ]
      : [
          "Sınırsız randevu ve hizmet türü",
          "Google Takvim, Apple Calendar ve Outlook Calendar eşitleme",
          "Google Meet, Zoom, Microsoft Teams ve rOndevu Video entegrasyonları",
          "6 haneli SMS / OTP danışan doğrulaması",
          "Otomatik WhatsApp, SMS ve e-posta bildirimleri ve hatırlatıcıları",
          "Özel alan adı bağlama",
          "İzin modu ve mola süresi yönetimi",
        ],
    publisher: { "@id": `${baseUrl}/#org` },
    offers: buildPlanOffers(baseUrl, isEn, plan),
  };
}

function JsonLdScript({ data }: { data: Graph | WithContext<Thing> }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD serialized with < escaped to \u003c
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

function HomeSchema({ locale = "tr", contact }: MarketingSchemaProps) {
  const baseUrl = getBaseUrl();
  const isEn = locale === "en";
  const inLanguage = isEn ? "en-US" : "tr-TR";
  const faqItems = isEn ? HOME_FAQ_EN : HOME_FAQ_TR;

  const organization = buildOrganizationNode(baseUrl, contact);
  const homeUrl = isEn ? `${baseUrl}/en` : baseUrl;
  const website: WebSite = {
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    name: APP_NAME || "rOndevu",
    alternateName: "Rondevu",
    url: homeUrl,
    inLanguage,
    publisher: { "@id": `${baseUrl}/#org` },
  };
  const softwareApplication = buildSoftwareNode(baseUrl, isEn);
  const faqPage: FAQPage = {
    "@type": "FAQPage",
    "@id": `${baseUrl}/#faq`,
    inLanguage,
    mainEntity: faqItems.map((item) => ({
      "@type": "Question" as const,
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: item.a,
      },
    })),
  };

  const graph: Graph = {
    "@context": "https://schema.org",
    "@graph": [organization, website, softwareApplication, faqPage],
  };

  return <JsonLdScript data={graph} />;
}

function PricingSchema({ locale = "tr", contact }: MarketingSchemaProps) {
  const baseUrl = getBaseUrl();
  const isEn = locale === "en";
  const inLanguage = isEn ? "en-US" : "tr-TR";
  const homeUrl = isEn ? `${baseUrl}/en` : baseUrl;
  const pricingUrl = isEn ? `${baseUrl}/en/pricing` : `${baseUrl}/pricing`;
  const breadcrumbId = `${pricingUrl}#breadcrumb`;

  const organization = buildOrganizationNode(baseUrl, contact);
  const softwareApplication = buildSoftwareNode(baseUrl, isEn);
  const breadcrumb: BreadcrumbList = {
    "@type": "BreadcrumbList",
    "@id": breadcrumbId,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: isEn ? "Home" : "Ana Sayfa",
        item: homeUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: isEn ? "Pricing" : "Fiyatlandırma",
        item: pricingUrl,
      },
    ],
  };
  const webPage: WebPage = {
    "@type": "WebPage",
    "@id": `${pricingUrl}#webpage`,
    name: isEn ? `Pricing | ${APP_NAME || "rOndevu"}` : `Fiyatlandırma | ${APP_NAME || "rOndevu"}`,
    description: isEn
      ? "Transparent and simple pricing for rOndevu: flexible monthly and yearly plans with unlimited appointments, SMS verification, WhatsApp/SMS/email notifications, and calendar sync."
      : "rOndevu şeffaf ve net fiyatlandırma: Aylık ve yıllık esnek paketler, sınırsız randevu, SMS doğrulaması, WhatsApp/SMS/e-posta bildirimleri ve takvim senkronizasyonu.",
    url: pricingUrl,
    inLanguage,
    about: { "@id": `${baseUrl}/#software` },
    publisher: { "@id": `${baseUrl}/#org` },
    breadcrumb: { "@id": breadcrumbId },
  };

  const graph: Graph = {
    "@context": "https://schema.org",
    "@graph": [organization, webPage, softwareApplication, breadcrumb],
  };

  return <JsonLdScript data={graph} />;
}

function PlanBilgiSchema({ locale = "tr", contact, plan }: PlanBilgiSchemaProps) {
  const baseUrl = getBaseUrl();
  const isEn = locale === "en";
  const inLanguage = isEn ? "en-US" : "tr-TR";
  const homeUrl = isEn ? `${baseUrl}/en` : baseUrl;
  const pageUrl = isEn ? `${baseUrl}/plan-bilgi?lang=en` : `${baseUrl}/plan-bilgi`;
  const breadcrumbId = `${pageUrl}#breadcrumb`;

  const organization = buildOrganizationNode(baseUrl, contact);
  const softwareApplication = buildSoftwareNode(baseUrl, isEn, plan);
  const breadcrumb: BreadcrumbList = {
    "@type": "BreadcrumbList",
    "@id": breadcrumbId,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: isEn ? "Home" : "Ana Sayfa",
        item: homeUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: isEn ? "Account Activation" : "Hesap Aktivasyonu",
        item: pageUrl,
      },
    ],
  };
  const webPage: WebPage = {
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    name: isEn ? `Account Activation | ${APP_NAME || "rOndevu"}` : `Hesap Aktivasyonu | ${APP_NAME || "rOndevu"}`,
    description: isEn
      ? "Activate your rOndevu account and receive your personal booking link. Reach us directly via WhatsApp, phone, or email for fast onboarding and setup."
      : "rOndevu hesabınızı hemen açıp profil linkinizi teslim edelim. Doğrudan iletişim kanallarından ulaşabilirsiniz.",
    url: pageUrl,
    inLanguage,
    about: { "@id": `${baseUrl}/#software` },
    publisher: { "@id": `${baseUrl}/#org` },
    breadcrumb: { "@id": breadcrumbId },
  };

  const graph: Graph = {
    "@context": "https://schema.org",
    "@graph": [organization, webPage, softwareApplication, breadcrumb],
  };

  return <JsonLdScript data={graph} />;
}

export { HomeSchema, PricingSchema, PlanBilgiSchema };
export type { MarketingContactInfo, MarketingSchemaProps, PlanBilgiSchemaProps };
