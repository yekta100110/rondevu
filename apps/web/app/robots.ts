import process from "node:process";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const rawBaseUrl = process.env.NEXT_PUBLIC_WEBAPP_URL || "https://rondevu.org";
  const baseUrl = rawBaseUrl.replace(/\/+$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/privacy",
          "/tos",
          "/gizlilik",
          "/gizlilik-politikasi",
          "/kullanim-kosullari",
          "/plan-bilgi",
        ],
        disallow: [
          "/api/",
          "/booking/",
          "/settings/",
          "/event-types/",
          "/apps/",
          "/auth/",
          "/getting-started/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
