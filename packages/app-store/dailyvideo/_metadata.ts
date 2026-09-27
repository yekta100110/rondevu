import process from "node:process";
import type { AppMeta } from "@calcom/types/App";

export const metadata = {
  name: "rOndevu Video",
  description:
    "rOndevu Video is the in-house web-based video conferencing platform powered by Daily.co, which is minimalistic and lightweight, but has most of the features you need.",
  installed: !!process.env.DAILY_API_KEY,
  type: "daily_video",
  variant: "conferencing",
  url: "https://daily.co",
  categories: ["conferencing"],
  logo: "icon.svg",
  publisher: "rOndevu",
  category: "conferencing",
  slug: "daily-video",
  title: "rOndevu Video",
  isGlobal: true,
  email: "info@rondevu.org",
  appData: {
    location: {
      linkType: "dynamic",
      type: "integrations:daily",
      label: "rOndevu Video",
    },
  },
  key: { apikey: process.env.DAILY_API_KEY },
  dirName: "dailyvideo",
  isOAuth: false,
} as AppMeta;

export default metadata;
