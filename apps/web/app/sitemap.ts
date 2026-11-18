import process from "node:process";
import type { MetadataRoute } from "next";

import prisma from "@rondevu/prisma";

export const revalidate = 3600;

const STATIC_LAST_MODIFIED = new Date("2026-10-26T00:00:00.000Z");

function isOutreachDemoUser(metadata: unknown): boolean {
  if (!metadata) return false;
  if (typeof metadata === "string") {
    try {
      const parsed = JSON.parse(metadata) as Record<string, unknown>;
      return parsed?.isOutreachDemo === true;
    } catch {
      return false;
    }
  }
  if (typeof metadata === "object" && !Array.isArray(metadata)) {
    return (metadata as Record<string, unknown>).isOutreachDemo === true;
  }
  return false;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rawBaseUrl = process.env.NEXT_PUBLIC_WEBAPP_URL || "https://rondevu.org";
  const baseUrl = rawBaseUrl.replace(/\/+$/, "");

  const homeAlternates = {
    languages: {
      tr: baseUrl,
      en: `${baseUrl}/en`,
      "x-default": baseUrl,
    },
  };

  const pricingAlternates = {
    languages: {
      tr: `${baseUrl}/pricing`,
      en: `${baseUrl}/en/pricing`,
      "x-default": `${baseUrl}/pricing`,
    },
  };

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: STATIC_LAST_MODIFIED,
      alternates: homeAlternates,
    },
    {
      url: `${baseUrl}/en`,
      lastModified: STATIC_LAST_MODIFIED,
      alternates: homeAlternates,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: STATIC_LAST_MODIFIED,
      alternates: pricingAlternates,
    },
    {
      url: `${baseUrl}/en/pricing`,
      lastModified: STATIC_LAST_MODIFIED,
      alternates: pricingAlternates,
    },
    {
      url: `${baseUrl}/plan-bilgi`,
      lastModified: STATIC_LAST_MODIFIED,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: STATIC_LAST_MODIFIED,
    },
    {
      url: `${baseUrl}/tos`,
      lastModified: STATIC_LAST_MODIFIED,
    },
  ];

  const userRoutes: MetadataRoute.Sitemap = [];

  if (process.env.DATABASE_URL) {
    try {
      const users = await prisma.user.findMany({
        where: {
          allowSEOIndexing: true,
          locked: false,
          organizationId: null,
          username: { not: null },
        },
        select: {
          username: true,
          metadata: true,
          createdDate: true,
          lastActiveAt: true,
        },
        take: 49000,
      });

      const seenUsernames = new Set<string>();
      for (const user of users) {
        const username = user.username?.trim();
        if (!username || seenUsernames.has(username)) continue;
        if (isOutreachDemoUser(user.metadata)) continue;

        seenUsernames.add(username);
        userRoutes.push({
          url: `${baseUrl}/${encodeURIComponent(username)}`,
          lastModified: user.lastActiveAt ?? user.createdDate,
        });
      }
    } catch (error) {
      console.warn("[sitemap] Falling back to static routes; user query failed:", error);
    }
  }

  return [...staticRoutes, ...userRoutes];
}
