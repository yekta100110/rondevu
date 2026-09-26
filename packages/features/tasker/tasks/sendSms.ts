import dayjs from "@calcom/dayjs";
import { getTranslation } from "@calcom/i18n/server";
import logger from "@calcom/lib/logger";
import { sendSMS } from "@calcom/lib/smsTransport";
import { prisma } from "@calcom/prisma";
import { BookingStatus } from "@calcom/prisma/enums";
import EventReminderSMS from "@calcom/sms/attendee/event-reminder-sms";
import type { CalendarEvent, Person } from "@calcom/types/Calendar";

const log = logger.getSubLogger({ prefix: ["[Tasker:sendSms]"] });

interface SendSmsTaskPayload {
  bookingUid?: string;
  bookingId?: number;
  type?: string;
  to?: string;
  body?: string;
}

export const sendSms = async (payload: string, taskId?: string): Promise<void> => {
  log.info(`Processing sendSms task ${taskId || ""}`);

  let parsed: SendSmsTaskPayload;
  try {
    if (typeof payload === "string") {
      parsed = JSON.parse(payload);
    } else {
      parsed = payload;
    }
  } catch (err) {
    log.error("Failed to parse task payload", err);
    throw new Error(`Invalid sendSms payload: ${payload}`);
  }

  // Direct SMS dispatch
  if (parsed.to && parsed.body) {
    const res = await sendSMS({ to: parsed.to, body: parsed.body });
    if (!res.success) {
      throw new Error(res.error || "SMS dispatch failed");
    }
    return;
  }

  // Booking Reminder SMS
  if (parsed.bookingUid) {
    const booking = await prisma.booking.findUnique({
      where: { uid: parsed.bookingUid },
      select: {
        id: true,
        uid: true,
        title: true,
        startTime: true,
        endTime: true,
        status: true,
        smsReminderNumber: true,
        location: true,
        eventType: {
          select: {
            title: true,
            slug: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            timeZone: true,
            locale: true,
          },
        },
        attendees: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            timeZone: true,
            locale: true,
          },
        },
      },
    });

    if (!booking) {
      log.warn(`Booking ${parsed.bookingUid} not found, skipping reminder SMS.`);
      return;
    }

    if (booking.status !== BookingStatus.ACCEPTED) {
      log.info(`Booking ${parsed.bookingUid} is status ${booking.status}, skipping reminder SMS.`);
      return;
    }

    const tOrganizer = await getTranslation(booking.user?.locale || "tr", "common");
    const attendeesPromises = booking.attendees.map(async (attendee) => {
      const tAttendee = await getTranslation(attendee.locale || "tr", "common");
      return {
        name: attendee.name,
        email: attendee.email,
        phoneNumber: attendee.phoneNumber || booking.smsReminderNumber || undefined,
        timeZone: attendee.timeZone,
        language: { translate: tAttendee, locale: attendee.locale || "tr" },
      } as Person;
    });

    const attendees = await Promise.all(attendeesPromises);

    const calEvent: CalendarEvent = {
      type: booking.eventType?.slug || "event",
      title: booking.title || booking.eventType?.title || "Randevu",
      startTime: dayjs(booking.startTime).utc().format(),
      endTime: dayjs(booking.endTime).utc().format(),
      organizer: {
        id: booking.user?.id || 1,
        name: booking.user?.name || "Organizatör",
        email: booking.user?.email || "organizer@example.com",
        timeZone: booking.user?.timeZone || "Europe/Istanbul",
        language: { translate: tOrganizer, locale: booking.user?.locale || "tr" },
      },
      attendees,
      uid: booking.uid,
      smsReminderNumber: booking.smsReminderNumber || undefined,
    };

    const reminderSMS = new EventReminderSMS(calEvent);
    await reminderSMS.sendSMSToAttendees();
    log.info(`Reminder SMS dispatched for booking ${booking.uid}`);
  }
};
