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
          "/en",
          "/pricing",
          "/en/pricing",
          "/plan-bilgi",
          "/privacy",
          "/tos",
          "/api/social/og/image",
          "/api/app-store/",
        ],
        disallow: [
          "/api/",
          "/d/",
          "/booking-successful",
          "/refer",
          "/apps/",
          "/more",
          "/auth/",
          "/getting-started/",
          "/booking/",
          "/settings/",
          "/event-types/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
