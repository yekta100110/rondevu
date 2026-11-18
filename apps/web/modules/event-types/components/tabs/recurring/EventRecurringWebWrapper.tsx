import type { EventRecurringTabProps } from "@rondevu/features/eventtypes/components/tabs/recurring/EventRecurringTab";
import { EventRecurringTab } from "@rondevu/features/eventtypes/components/tabs/recurring/EventRecurringTab";

const EventRecurringWebWrapper = (props: EventRecurringTabProps) => {
  return <EventRecurringTab {...props} />;
};

export default EventRecurringWebWrapper;
