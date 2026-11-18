import type { EventRecurringTabProps } from "@rondevu/features/eventtypes/components/tabs/recurring/EventRecurringTab";
import { EventRecurringTab } from "@rondevu/features/eventtypes/components/tabs/recurring/EventRecurringTab";

const EventRecurringTabPlatformWrapper = (props: EventRecurringTabProps) => {
  return <EventRecurringTab {...props} />;
};

export default EventRecurringTabPlatformWrapper;
