import dayjs from "@calcom/dayjs";
import isSmsCalEmail from "@calcom/lib/isSmsCalEmail";
import { piiHasher } from "@calcom/lib/server/PiiHasher";
import { checkSMSRateLimit } from "@calcom/lib/smsLockState";
import { TimeFormat } from "@calcom/lib/timeFormat";
import type { CalendarEvent, Person } from "@calcom/types/Calendar";
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

  abstract getMessage(attendee: Person): string;

  async sendSMSToAttendee(attendee: Person): Promise<unknown> {
    let targetPhone =
      attendee.phoneNumber || (this.calEvent as { smsReminderNumber?: string }).smsReminderNumber;

    if (!targetPhone && (this.calEvent as { responses?: Record<string, unknown> }).responses) {
      const resp =
        (this.calEvent as { responses?: Record<string, { value?: unknown } | unknown> }).responses || {};
      const respPhone = resp.attendeePhoneNumber || resp.phone;
      if (typeof respPhone === "object" && respPhone && "value" in respPhone) {
        targetPhone = String(respPhone.value);
      } else if (typeof respPhone === "string") {
        targetPhone = respPhone;
      }
    }

    if (!targetPhone && attendee.email && isSmsCalEmail(attendee.email)) {
      targetPhone = attendee.email.split("@")[0];
    }

    if (!targetPhone || typeof targetPhone !== "string") return;

    try {
      return await handleSendingSMS({
        reminderPhone: targetPhone,
        organizerUserId: this.organizerUserId,
        message: this.getMessage(attendee),
      });
    } catch (smsErr) {
      console.error("[SMSManager] Failed to send SMS to attendee:", smsErr);
    }
  }

  async sendSMSToAttendees(): Promise<void> {
    const smsToSend: Promise<unknown>[] = [];

    for (const attendee of this.calEvent.attendees) {
      smsToSend.push(this.sendSMSToAttendee(attendee));
    }

    await Promise.all(smsToSend);
  }
}
