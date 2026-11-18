import { EventLimitsTab } from "@rondevu/features/eventtypes/components/tabs/limits/EventLimitsTab";
import type { EventLimitsTabProps } from "@rondevu/features/eventtypes/components/tabs/limits/EventLimitsTab";

const EventLimitsTabPlatformWrapper = (props: EventLimitsTabProps) => {
  return <EventLimitsTab {...props} />;
};

export default EventLimitsTabPlatformWrapper;
