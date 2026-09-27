import type { CalendarEvent, Person } from "@calcom/types/Calendar";
import SMSManager from "../sms-manager";

export default class EventSuccessfullyScheduledSMS extends SMSManager {
  constructor(calEvent: CalendarEvent) {
    super(calEvent);
  }

  getMessage(attendee: Person) {
    const title = this.getCleanTitle(32);
    const dateStr = this.getCompactDate(attendee.timeZone);
    const shortUrl = this.getShortBookingUrl();

    if (attendee.language?.locale && attendee.language.locale.startsWith("en")) {
      return `rOndevu: ${title} confirmed. Date: ${dateStr}. Details/Cancel: ${shortUrl}`;
    }

    return `rOndevu: ${title} randevunuz onaylandi. Tarih: ${dateStr}. Detay/Iptal: ${shortUrl}`;
  }
}
