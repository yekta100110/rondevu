import { DynamicComponent } from "@rondevu/app-store/_components/DynamicComponent";
import dynamic from "next/dynamic";

export const AppSetupMap = {
  "apple-calendar": dynamic(() => import("@rondevu/web/components/apps/applecalendar/Setup")),
  exchange: dynamic(() => import("@rondevu/web/components/apps/exchangecalendar/Setup")),
  "caldav-calendar": dynamic(() => import("@rondevu/web/components/apps/caldavcalendar/Setup")),
  "ics-feed": dynamic(() => import("@rondevu/web/components/apps/ics-feedcalendar/Setup")),
  stripe: dynamic(() => import("@rondevu/web/components/apps/stripepayment/Setup")),
  paypal: dynamic(() => import("@rondevu/web/components/apps/paypal/Setup")),
  btcpayserver: dynamic(() => import("@rondevu/web/components/apps/btcpayserver/Setup")),
};

export const AppSetupPage = (props: { slug: string }) => {
  return <DynamicComponent<typeof AppSetupMap> componentMap={AppSetupMap} {...props} />;
};

export default AppSetupPage;
