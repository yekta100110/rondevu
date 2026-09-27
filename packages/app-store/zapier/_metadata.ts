import type { AppMeta } from "@calcom/types/App";

export const metadata = {
  name: "Zapier",
  description:
    "Workflow automation for everyone. Use the Cal.diy Zapier app to trigger your workflows when a booking is created, rescheduled, or cancelled, or after a meeting ends.",
  installed: true,
  category: "automation",
  categories: ["automation"],
  logo: "icon.svg",
  publisher: "rOndevu",
  slug: "zapier",
  title: "Zapier",
  type: "zapier_automation",
  url: "https://zapier.com/apps/calcom/integrations",
  variant: "automation",
  email: "info@rondevu.org",
  dirName: "zapier",
  isOAuth: false,
} as AppMeta;

export default metadata;
