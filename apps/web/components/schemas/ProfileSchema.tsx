import type {
  BreadcrumbList,
  Graph,
  LocalBusiness,
  Offer,
  OfferCatalog,
  Person,
  ProfessionalService,
  ProfilePage,
  Service,
  Thing,
  WithContext,
} from "schema-dts";

import { APP_NAME, RONDEVU_URL } from "@rondevu/lib/constants";
import { convertFromSmallestToPresentableCurrencyUnit } from "@rondevu/lib/currencyConversions";

type ProfileEntityType = "Person" | "ProfessionalService" | "LocalBusiness";

interface ProfileEventTypeInput {
  id?: number;
  title: string;
  slug: string;
  length?: number | null;
  price?: number | null;
  currency?: string | null;
  description?: string | null;
  descriptionAsSafeHTML?: string | null;
}

interface ProfileSchemaProps {
  allowSEOIndexing?: boolean | null;
  isOutreachDemo?: boolean;
  username?: string | null;
  name: string;
  image?: string | null;
  description?: string | null;
  businessName?: string | null;
  schemaType?: ProfileEntityType;
  eventTypes?: ProfileEventTypeInput[];
}

interface EventTypeServiceSchemaProps {
  allowSEOIndexing?: boolean | null;
  isOutreachDemo?: boolean;
  isHidden?: boolean;
  username?: string | null;
  providerName?: string | null;
  providerImage?: string | null;
  businessName?: string | null;
  schemaType?: ProfileEntityType;
  service: ProfileEventTypeInput;
}

function getBaseUrl(): string {
  return (RONDEVU_URL || "https://rondevu.org").replace(/\/+$/, "");
}

function cleanText(value?: string | null): string | undefined {
  if (!value) return undefined;
  const stripped = value
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return stripped.length > 0 ? stripped : undefined;
}

function buildServiceOffer(
  service: ProfileEventTypeInput,
  serviceUrl: string,
  itemOffered?: Service
): Offer {
  const hasPrice = typeof service.price === "number" && service.price > 0 && Boolean(service.currency);
  if (!hasPrice || !service.currency) {
    return {
      "@type": "Offer",
      url: serviceUrl,
      availability: "https://schema.org/InStock",
      ...(itemOffered ? { itemOffered } : {}),
    };
  }

  return {
    "@type": "Offer",
    url: serviceUrl,
    availability: "https://schema.org/InStock",
    price: convertFromSmallestToPresentableCurrencyUnit(service.price as number, service.currency),
    priceCurrency: service.currency.toUpperCase(),
    ...(itemOffered ? { itemOffered } : {}),
  };
}

function buildOfferCatalog(
  baseUrl: string,
  username: string | null | undefined,
  displayName: string,
  eventTypes: ProfileEventTypeInput[]
): OfferCatalog | undefined {
  if (!eventTypes.length) return undefined;

  const profileUrl = username ? `${baseUrl}/${encodeURIComponent(username)}` : baseUrl;

  return {
    "@type": "OfferCatalog",
    name: `${displayName} - Randevu Hizmetleri`,
    itemListElement: eventTypes.map((eventType) => {
      const serviceUrl = username
        ? `${baseUrl}/${encodeURIComponent(username)}/${encodeURIComponent(eventType.slug)}`
        : profileUrl;
      const serviceDescription = cleanText(eventType.description ?? eventType.descriptionAsSafeHTML);
      const serviceItem: Service = {
        "@type": "Service",
        name: eventType.title,
        url: serviceUrl,
        ...(serviceDescription ? { description: serviceDescription } : {}),
      };

      return buildServiceOffer(eventType, serviceUrl, serviceItem);
    }),
  };
}

function buildProfileMainEntity({
  baseUrl,
  profileUrl,
  username,
  name,
  image,
  description,
  businessName,
  schemaType,
  eventTypes,
}: {
  baseUrl: string;
  profileUrl: string;
  username?: string | null;
  name: string;
  image?: string | null;
  description?: string | null;
  businessName?: string | null;
  schemaType: ProfileEntityType;
  eventTypes: ProfileEventTypeInput[];
}): Person | ProfessionalService | LocalBusiness {
  const displayName =
    schemaType === "Person" ? name : businessName?.trim() || name;
  const offerCatalog = buildOfferCatalog(baseUrl, username, displayName, eventTypes);
  const cleanedDescription = cleanText(description);
  const cleanedImage = image?.trim() || undefined;

  if (schemaType === "ProfessionalService" || schemaType === "LocalBusiness") {
    return {
      "@type": schemaType,
      "@id": `${profileUrl}#business`,
      name: displayName,
      url: profileUrl,
      ...(cleanedImage ? { image: cleanedImage } : {}),
      ...(cleanedDescription ? { description: cleanedDescription } : {}),
      ...(offerCatalog ? { hasOfferCatalog: offerCatalog } : {}),
    };
  }

  return {
    "@type": "Person",
    "@id": `${profileUrl}#person`,
    name: displayName,
    url: profileUrl,
    ...(cleanedImage ? { image: cleanedImage } : {}),
    ...(cleanedDescription ? { description: cleanedDescription } : {}),
    ...(businessName?.trim()
      ? { worksFor: { "@type": "Organization", name: businessName.trim() } }
      : {}),
    ...(offerCatalog ? { hasOfferCatalog: offerCatalog } : {}),
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

function ProfileSchema({
  allowSEOIndexing,
  isOutreachDemo = false,
  username,
  name,
  image,
  description,
  businessName,
  schemaType = "Person",
  eventTypes = [],
}: ProfileSchemaProps) {
  if (allowSEOIndexing !== true || isOutreachDemo) {
    return null;
  }

  const trimmedName = name.trim();
  if (!trimmedName && !username) {
    return null;
  }

  const baseUrl = getBaseUrl();
  const profilePath = username ? `/${encodeURIComponent(username)}` : "";
  const profileUrl = `${baseUrl}${profilePath}`;
  const displayName = trimmedName || username || "";

  const mainEntity = buildProfileMainEntity({
    baseUrl,
    profileUrl,
    username,
    name: displayName,
    image,
    description,
    businessName,
    schemaType,
    eventTypes,
  });

  const profilePage: WithContext<ProfilePage> = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${profileUrl}#profilepage`,
    url: profileUrl,
    name: `${displayName} | ${APP_NAME || "rOndevu"}`,
    mainEntity,
  };

  return <JsonLdScript data={profilePage} />;
}

function buildServiceProvider({
  schemaType,
  profileUrl,
  providerName,
  providerImage,
  businessName,
  username,
}: {
  schemaType: ProfileEntityType;
  profileUrl: string;
  providerName?: string | null;
  providerImage?: string | null;
  businessName?: string | null;
  username?: string | null;
}): {
  effectiveProviderName: string;
  provider: Person | ProfessionalService | LocalBusiness | undefined;
} {
  const effectiveProviderName =
    schemaType === "Person"
      ? providerName?.trim() || businessName?.trim() || username || ""
      : businessName?.trim() || providerName?.trim() || username || "";

  if (!effectiveProviderName) {
    return { effectiveProviderName: "", provider: undefined };
  }

  const cleanedProviderImage = providerImage?.trim() || undefined;
  if (schemaType === "ProfessionalService" || schemaType === "LocalBusiness") {
    return {
      effectiveProviderName,
      provider: {
        "@type": schemaType,
        "@id": `${profileUrl}#business`,
        name: effectiveProviderName,
        url: profileUrl,
        ...(cleanedProviderImage ? { image: cleanedProviderImage } : {}),
      },
    };
  }

  return {
    effectiveProviderName,
    provider: {
      "@type": "Person",
      "@id": `${profileUrl}#person`,
      name: effectiveProviderName,
      url: profileUrl,
      ...(cleanedProviderImage ? { image: cleanedProviderImage } : {}),
    },
  };
}

function EventTypeServiceSchema({
  allowSEOIndexing,
  isOutreachDemo = false,
  isHidden = false,
  username,
  providerName,
  providerImage,
  businessName,
  schemaType = "Person",
  service,
}: EventTypeServiceSchemaProps) {
  if (allowSEOIndexing !== true || isOutreachDemo || isHidden) {
    return null;
  }

  if (!service.title.trim() || !service.slug.trim()) {
    return null;
  }

  const baseUrl = getBaseUrl();
  const encodedUser = username ? encodeURIComponent(username) : "";
  const encodedSlug = encodeURIComponent(service.slug);
  const profileUrl = encodedUser ? `${baseUrl}/${encodedUser}` : baseUrl;
  const serviceUrl = encodedUser ? `${profileUrl}/${encodedSlug}` : `${baseUrl}/${encodedSlug}`;
  const cleanedDescription = cleanText(service.description ?? service.descriptionAsSafeHTML);

  const { effectiveProviderName, provider } = buildServiceProvider({
    schemaType,
    profileUrl,
    providerName,
    providerImage,
    businessName,
    username,
  });

  const serviceNode: Service = {
    "@type": "Service",
    "@id": `${serviceUrl}#service`,
    name: service.title,
    serviceType: service.title,
    url: serviceUrl,
    ...(cleanedDescription ? { description: cleanedDescription } : {}),
    ...(provider ? { provider } : {}),
    offers: buildServiceOffer(service, serviceUrl),
  };

  const breadcrumbItems = encodedUser
    ? [
        {
          "@type": "ListItem" as const,
          position: 1,
          name: effectiveProviderName || username || "",
          item: profileUrl,
        },
        {
          "@type": "ListItem" as const,
          position: 2,
          name: service.title,
          item: serviceUrl,
        },
      ]
    : [
        {
          "@type": "ListItem" as const,
          position: 1,
          name: service.title,
          item: serviceUrl,
        },
      ];

  const breadcrumbNode: BreadcrumbList = {
    "@type": "BreadcrumbList",
    "@id": `${serviceUrl}#breadcrumb`,
    itemListElement: breadcrumbItems,
  };

  const graph: Graph = {
    "@context": "https://schema.org",
    "@graph": [serviceNode, breadcrumbNode],
  };

  return <JsonLdScript data={graph} />;
}

export { ProfileSchema, EventTypeServiceSchema };
export type {
  ProfileEntityType,
  ProfileEventTypeInput,
  ProfileSchemaProps,
  EventTypeServiceSchemaProps,
};
