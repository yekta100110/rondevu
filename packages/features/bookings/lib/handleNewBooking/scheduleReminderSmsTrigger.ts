import dayjs from "@calcom/dayjs";
import tasker from "@calcom/features/tasker";
import logger from "@calcom/lib/logger";

const log = logger.getSubLogger({ prefix: ["[scheduleReminderSmsTrigger]"] });

export const scheduleReminderSmsTrigger = async (booking: {
  id: number;
  uid: string;
  startTime: Date | string;
}): Promise<void> => {
  try {
    const bookingStart = dayjs(booking.startTime);
    const now = dayjs();

    // Default: 24 hours prior to appointment start time
    let reminderDate = bookingStart.subtract(24, "hour");

    // If 24h prior has already passed (e.g. appointment booked within 24h), try 2 hours prior
    if (reminderDate.isBefore(now)) {
      reminderDate = bookingStart.subtract(2, "hour");
    }

    // Only schedule if the calculated reminder date is in the future
    if (reminderDate.isAfter(now)) {
      await tasker.create(
        "sendSms",
        JSON.stringify({
          bookingId: booking.id,
          bookingUid: booking.uid,
          type: "BOOKING_REMINDER",
        }),
        {
          scheduledAt: reminderDate.toDate(),
          referenceUid: booking.uid,
        }
      );
      log.info(`Scheduled reminder SMS for booking ${booking.uid} at ${reminderDate.toISOString()}`);
    }
  } catch (err) {
    log.error(`Failed to schedule reminder SMS for booking ${booking.uid}`, err);
  }
};
