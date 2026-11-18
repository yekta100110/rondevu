import { type TFunction } from "i18next";
import { cookies, headers } from "next/headers";

import { getLocale } from "@rondevu/features/auth/lib/getLocale";
import type { AppImageProps, MeetingImageProps } from "@rondevu/lib/OgImages";
import { constructAppImage, constructGenericImage, constructMeetingImage } from "@rondevu/lib/OgImages";
import { IS_RONDEVU, WEBAPP_URL, APP_NAME, SEO_IMG_OGIMG, RONDEVU_URL } from "@rondevu/lib/constants";
import { getRondevuUrl } from "@rondevu/lib/getRondevuUrl";
import { buildCanonical } from "@rondevu/lib/next-seo.config";
import { getTranslation } from "@rondevu/i18n/server";
import { truncateOnWord } from "@rondevu/lib/text";

import { buildLegacyRequest } from "@lib/buildLegacyCtx";

export const getTranslate = async () => {
  const locale = await getLocale(buildLegacyRequest(await headers(), await cookies()));

  return await getTranslation(locale ?? "en", "common");
};

const _generateMetadataWithoutImage = async (
  getTitle: (t: TFunction<string, undefined>) => string,
  getDescription: (t: TFunction<string, undefined>) => string,
  hideBranding?: boolean,
  origin?: string,
  pathname?: string,
  languages?: Record<string, string>,
  locale?: "tr_TR" | "en_US"
) => {
  const _pathname = pathname ?? "";
  const canonical = buildCanonical({ path: _pathname, origin: origin ?? RONDEVU_URL });
  const t = locale
    ? await getTranslation(locale === "en_US" ? "en" : "tr", "common")
    : await getTranslate();

  const title = getTitle(t);
  const description = getDescription(t);
  const titleSuffix = `| ${APP_NAME}`;
  const displayedTitle = title.includes(titleSuffix) || hideBranding ? title : `${title} ${titleSuffix}`;
  const metadataBase = new URL(IS_RONDEVU ? getRondevuUrl() : WEBAPP_URL);

  return {
    title: title.length === 0 ? APP_NAME : displayedTitle,
    description,
    alternates: {
      canonical,
      ...(languages ? { languages } : {}),
    },
    openGraph: {
      description: truncateOnWord(description, 158),
      url: canonical,
      type: "website",
      siteName: APP_NAME,
      title: displayedTitle,
      ...(locale ? { locale } : {}),
    },
    metadataBase,
  };
};

const buildOgImageUrl = (imagePath: string) => {
  const baseUrl = SEO_IMG_OGIMG.replace(/\/+$/, "");
  const normalizedPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${baseUrl}${normalizedPath}`;
};

export const _generateMetadata = async (
  getTitle: (t: TFunction<string, undefined>) => string,
  getDescription: (t: TFunction<string, undefined>) => string,
  hideBranding?: boolean,
  origin?: string,
  pathname?: string,
  languages?: Record<string, string>,
  locale?: "tr_TR" | "en_US"
) => {
  const metadata = await _generateMetadataWithoutImage(
    getTitle,
    getDescription,
    hideBranding,
    origin,
    pathname,
    languages,
    locale
  );
  const image = buildOgImageUrl(
    await constructGenericImage({
      title: metadata.title,
      description: metadata.description,
    })
  );

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      images: [image],
    },
  };
};

export const _generateMetadataForStaticPage = async (
  title: string,
  description: string,
  hideBranding?: boolean,
  origin?: string,
  pathname?: string,
  languages?: Record<string, string>,
  locale?: "tr_TR" | "en_US"
) => {
  const _pathname = pathname ?? "";
  const canonical = buildCanonical({ path: _pathname, origin: origin ?? RONDEVU_URL });
  const titleSuffix = `| ${APP_NAME}`;
  const displayedTitle = title.includes(titleSuffix) || hideBranding ? title : `${title} ${titleSuffix}`;
  const metadataBase = new URL(IS_RONDEVU ? getRondevuUrl() : WEBAPP_URL);

  const metadata = {
    title: title.length === 0 ? APP_NAME : displayedTitle,
    description,
    alternates: {
      canonical,
      ...(languages ? { languages } : {}),
    },
    openGraph: {
      description: truncateOnWord(description, 158),
      url: canonical,
      type: "website",
      siteName: APP_NAME,
      title: displayedTitle,
      ...(locale ? { locale } : {}),
    },
    metadataBase,
  };
  const image = buildOgImageUrl(
    await constructGenericImage({
      title: metadata.title,
      description: metadata.description,
    })
  );

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      images: [image],
    },
  };
};

export const generateMeetingMetadata = async (
  meeting: MeetingImageProps,
  getTitle: (t: TFunction<string, undefined>) => string,
  getDescription: (t: TFunction<string, undefined>) => string,
  hideBranding?: boolean,
  origin?: string,
  pathname?: string
) => {
  const metadata = await _generateMetadataWithoutImage(
    getTitle,
    getDescription,
    hideBranding,
    origin,
    pathname
  );
  const image = buildOgImageUrl(await constructMeetingImage(meeting));

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      images: [image],
    },
  };
};

export const generateAppMetadata = async (
  app: AppImageProps,
  getTitle: (t: TFunction<string, undefined>) => string,
  getDescription: (t: TFunction<string, undefined>) => string,
  hideBranding?: boolean,
  origin?: string,
  pathname?: string
) => {
  const metadata = await _generateMetadataWithoutImage(
    getTitle,
    getDescription,
    hideBranding,
    origin,
    pathname
  );

  const image = buildOgImageUrl(await constructAppImage({ ...app, description: metadata.description }));

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      images: [image],
    },
  };
};
