import dayjs from "@calcom/dayjs";
import { piiHasher } from "@calcom/lib/server/PiiHasher";
import { checkSMSRateLimit } from "@calcom/lib/smsLockState";
import { TimeFormat } from "@calcom/lib/timeFormat";
import type { CalendarEvent, Person } from "@calcom/types/Calendar";
import { WEBAPP_URL } from "@calcom/lib/constants";
import { getSMSConfig, sendSMS } from "./sms-transport";

export { sendSMS, getSMSConfig };

const handleSendingSMS = async ({
  reminderPhone,
  organizerUserId,
  message,
}: {
  reminderPhone: string;
  organizerUserId?: number;
  message?: string;
}) => {
  await checkSMSRateLimit({
    identifier: organizerUserId
      ? `handleSendingSMS:org-user-${organizerUserId}`
      : `handleSendingSMS:user-${piiHasher.hash(reminderPhone)}`,
    rateLimitingType: "sms",
  });

  if (message) {
    await sendSMS({ to: reminderPhone, body: message });
  }
};

export default abstract class SMSManager {
  calEvent: CalendarEvent;
  organizerUserId: number | undefined = undefined;

  constructor(calEvent: CalendarEvent) {
    this.calEvent = calEvent;
    this.organizerUserId = this.calEvent?.organizer?.id;
  }

  getFormattedTime(
    timezone: string,
    locale: string,
    time: string,
    format = `dddd, LL | ${TimeFormat.TWELVE_HOUR}`
  ) {
    try {
      const tz = timezone || "Europe/Istanbul";
      return dayjs(time)
        .tz(tz)
        .locale(locale || "tr")
        .format(format);
    } catch {
      return dayjs(time).format();
    }
  }

  getFormattedDate(timezone: string, locale: string): string {
    const tz = timezone || "Europe/Istanbul";
    const loc = locale || "tr";
    return `${this.getFormattedTime(tz, loc, this.calEvent.startTime)} - ${this.getFormattedTime(
      tz,
      loc,
      this.calEvent.endTime
    )} (${tz})`;
  }

  getCompactDate(timezone?: string): string {
    const tz = timezone || "Europe/Istanbul";
    try {
      return dayjs(this.calEvent.startTime).tz(tz).format("DD.MM HH:mm");
    } catch {
      return dayjs(this.calEvent.startTime).format("DD.MM HH:mm");
    }
  }

  getShortBookingUrl(): string {
    const rawUrl = this.calEvent.bookerUrl ?? WEBAPP_URL;
    const cleanDomain = rawUrl.replace(/^https?:\/\//, "").replace(/\/+$/, "");
    return `${cleanDomain}/b/${this.calEvent.uid}`;
  }

  getCleanTitle(maxLength = 32): string {
    const rawTitle = typeof this.calEvent.title === "string" ? this.calEvent.title : "Randevu";
    const trimmed = rawTitle.trim();
    if (trimmed.length <= maxLength) return trimmed;
    return `${trimmed.slice(0, maxLength - 3)}...`;
  }

  abstract getMessage(attendee: Person): string;

  async sendSMSToAttendee(attendee: Person): Promise<unknown> {
    const attendeePhoneNumber = attendee.phoneNumber || this.calEvent.smsReminderNumber;

    if (!attendeePhoneNumber) return;

    return handleSendingSMS({
      reminderPhone: attendeePhoneNumber,
      organizerUserId: this.organizerUserId,
      message: this.getMessage(attendee),
    });
  }

  async sendSMSToAttendees(): Promise<void> {
    const smsToSend: Promise<unknown>[] = [];

    for (const attendee of this.calEvent.attendees) {
      smsToSend.push(this.sendSMSToAttendee(attendee));
    }

    await Promise.all(smsToSend);
  }
}
