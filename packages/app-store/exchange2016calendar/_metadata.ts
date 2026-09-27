import type { AppMeta } from "@calcom/types/App";

export const metadata = {
  name: "Microsoft Exchange 2016 Calendar",
  description: "For calendars hosted on on-premises Microsoft Exchange 2016 servers",
  installed: true,
  type: "exchange2016_calendar",
  title: "Microsoft Exchange 2016 Calendar",
  variant: "calendar",
  category: "calendar",
  categories: ["calendar"],
  label: "Exchange Calendar",
  logo: "icon.svg",
  publisher: "rOndevu",
  slug: "exchange2016-calendar",
  url: "https://rondevu.org",
  email: "info@rondevu.org",
  dirName: "exchange2016calendar",
  isOAuth: false,
} as AppMeta;

export default metadata;
