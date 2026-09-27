import type { CalendarEvent, Person } from "@calcom/types/Calendar";
import SMSManager from "../sms-manager";

export default class EventCancelledSMS extends SMSManager {
  constructor(calEvent: CalendarEvent) {
    super(calEvent);
  }

  getMessage(attendee: Person) {
    const title = this.getCleanTitle(35);
    const dateStr = this.getCompactDate(attendee.timeZone);
    const shortUrl = this.getShortBookingUrl();

    if (attendee.language?.locale && attendee.language.locale.startsWith("en")) {
      return `rOndevu: ${title} cancelled. Date: ${dateStr}. Details: ${shortUrl}`;
    }

    return `rOndevu: ${title} randevunuz iptal edildi. Tarih: ${dateStr}. Detay: ${shortUrl}`;
  }
}
