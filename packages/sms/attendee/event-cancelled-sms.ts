import { WEBAPP_URL } from "@calcom/lib/constants";
import type { CalendarEvent, Person } from "@calcom/types/Calendar";
import SMSManager from "../sms-manager";

export default class EventCancelledSMS extends SMSManager {
  constructor(calEvent: CalendarEvent) {
    super(calEvent);
  }

  getMessage(attendee: Person) {
    const bookingUrl = `${this.calEvent.bookerUrl ?? WEBAPP_URL}/booking/${this.calEvent.uid}`;
    const hostName = this.calEvent.organizer?.name || "Organizatör";
    const eventTitle = typeof this.calEvent.title === "string" ? this.calEvent.title : "Randevu";
    const dateStr = this.getFormattedDate(
      attendee.timeZone || "Europe/Istanbul",
      attendee.language?.locale || "tr"
    );

    return `Sayın ${attendee.name},\n\n${hostName} ile olan "${eventTitle}" randevunuz (${dateStr}) iptal edilmiştir.\n\nRandevu detayları: ${bookingUrl}`;
  }
}
