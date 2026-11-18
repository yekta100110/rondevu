import { BookingEmailAndSmsTriggerDevTasker } from "@rondevu/features/bookings/lib/tasker/BookingEmailAndSmsTriggerTasker";
import { createContainer } from "@rondevu/features/di/di";

import { moduleLoader as BookingEmailAndSmsTriggerDevTaskerModule } from "./BookingEmailAndSmsTriggerDevTasker.module";

const container = createContainer();

export function getBookingEmailAndSmsTriggerDevTasker(): BookingEmailAndSmsTriggerDevTasker {
  BookingEmailAndSmsTriggerDevTaskerModule.loadModule(container);
  return container.get<BookingEmailAndSmsTriggerDevTasker>(BookingEmailAndSmsTriggerDevTaskerModule.token);
}
