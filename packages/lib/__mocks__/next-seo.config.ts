vi.mock("@rondevu/lib/next-seo.config", () => ({
  default: {
    headSeo: {
      siteName: "rOndevu",
    },
    defaultNextSeo: {
      title: "rOndevu",
      description: "Scheduling infrastructure for everyone.",
    },
  },
  seoConfig: {
    headSeo: {
      siteName: "rOndevu",
    },
  },
  buildSeoMeta: vi.fn().mockReturnValue({}),
}));
