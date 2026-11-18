import { schemaTask } from "@trigger.dev/sdk";

import { bookingNotificationsTaskConfig } from "./config";
import { bookingNotificationTaskSchema } from "./schema";

export const reschedule = schemaTask({
  id: "booking.send.reschedule.notifications",
  ...bookingNotificationsTaskConfig,
  schema: bookingNotificationTaskSchema,
  run: async (payload) => {
    const { TriggerDevLogger } = await import("@rondevu/lib/triggerDevLogger");
    const { BookingEmailSmsHandler } = await import("@rondevu/features/bookings/lib/BookingEmailSmsHandler");
    const { BookingRepository } = await import("@rondevu/features/bookings/repositories/BookingRepository");
    const { prisma } = await import("@rondevu/prisma");
    const { BookingEmailAndSmsTaskService } = await import("../../BookingEmailAndSmsTaskService");

    const triggerDevLogger = new TriggerDevLogger();
    const emailsAndSmsHandler = new BookingEmailSmsHandler({ logger: triggerDevLogger });
    const bookingRepo = new BookingRepository(prisma);
    const bookingTaskService = new BookingEmailAndSmsTaskService({
      logger: triggerDevLogger,
      bookingRepository: bookingRepo,
      emailsAndSmsHandler: emailsAndSmsHandler,
    });
    await bookingTaskService.reschedule(payload);
  },
});
