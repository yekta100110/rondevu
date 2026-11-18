import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { type TFunction } from "i18next";
import { cookies, headers } from "next/headers";

import { getLocale } from "@rondevu/features/auth/lib/getLocale";
import type { AppImageProps, MeetingImageProps } from "@rondevu/lib/OgImages";
import { constructAppImage, constructGenericImage, constructMeetingImage } from "@rondevu/lib/OgImages";
import { IS_CALCOM, WEBAPP_URL, APP_NAME, SEO_IMG_OGIMG, CAL_URL } from "@rondevu/lib/constants";
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
  const canonical = buildCanonical({ path: _pathname, origin: origin ?? CAL_URL });
  const t = locale
    ? await getTranslation(locale === "en_US" ? "en" : "tr", "common")
    : await getTranslate();

  const title = getTitle(t);
  const description = getDescription(t);
  const titleSuffix = `| ${APP_NAME}`;
  const displayedTitle = title.includes(titleSuffix) || hideBranding ? title : `${title} ${titleSuffix}`;
  const metadataBase = new URL(IS_CALCOM ? getRondevuUrl() : WEBAPP_URL);

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
  const canonical = buildCanonical({ path: _pathname, origin: origin ?? CAL_URL });
  const titleSuffix = `| ${APP_NAME}`;
  const displayedTitle = title.includes(titleSuffix) || hideBranding ? title : `${title} ${titleSuffix}`;
  const metadataBase = new URL(IS_CALCOM ? getRondevuUrl() : WEBAPP_URL);

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

const getFramerBody = (markup: string): string => {
  const openingBody = /<body[^>]*>/i.exec(markup);
  const closingBody = markup.lastIndexOf("</body>");
  if (!openingBody || closingBody < 0) return markup;
  return markup.slice(openingBody.index + openingBody[0].length, closingBody);
};

export const filterUsedSvgTemplates = (svgContent: string, domHtml: string): string => {
  const usedIds = new Set<string>();
  for (const match of domHtml.matchAll(/href="#([^"]+)"/g)) {
    if (match[1]) usedIds.add(match[1]);
  }
  if (usedIds.size === 0) return "";
  const matchedSvgs: string[] = [];
  for (const match of svgContent.matchAll(/<svg\b[^>]*\bid="([^"]+)"[^>]*>[\s\S]*?<\/svg>/g)) {
    if (match[1] && usedIds.has(match[1])) {
      matchedSvgs.push(match[0]);
    }
  }
  if (matchedSvgs.length === 0) return "";
  return `<div id="svg-templates" style="position: absolute; overflow: hidden; bottom: 0; left: 0; width: 0; height: 0; z-index: 0; contain: strict" aria-hidden="true">${matchedSvgs.join("")}</div>`;
};

export const loadCalMarketingAssets = (
  domFilename: string,
  options?: { extractBody?: boolean }
): { html: string; svgTemplates: string } => {
  const publicDir = path.join(process.cwd(), "public", "cal_files");
  const rawHtml = fs.readFileSync(path.join(publicDir, domFilename), "utf8");
  const html = options?.extractBody ? getFramerBody(rawHtml) : rawHtml;
  const rawSvgTemplates = fs.readFileSync(path.join(publicDir, "svg-templates.html"), "utf8");
  const svgTemplates = filterUsedSvgTemplates(rawSvgTemplates, html);
  return { html, svgTemplates };
};
