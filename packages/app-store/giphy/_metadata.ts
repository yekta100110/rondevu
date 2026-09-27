import type { AppMeta } from "@calcom/types/App";

export const metadata = {
  name: "Giphy",
  description:
    "GIPHY is your top source for the best & newest GIFs & Animated Stickers online. Find everything from funny GIFs, reaction GIFs, unique GIFs and more.",
  installed: true,
  categories: ["other"],
  logo: "icon.svg",
  publisher: "rOndevu",
  slug: "giphy",
  title: "Giphy",
  type: "giphy_other",
  url: "https://rondevu.org/apps/giphy",
  variant: "other",
  extendsFeature: "EventType",
  email: "info@rondevu.org",
  dirName: "giphy",
  isOAuth: false,
} as AppMeta;

export default metadata;
