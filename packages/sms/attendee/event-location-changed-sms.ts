import type { CalendarEvent, Person } from "@calcom/types/Calendar";
import SMSManager from "../sms-manager";

export default class EventLocationChangedSMS extends SMSManager {
  constructor(calEvent: CalendarEvent) {
    super(calEvent);
  }

  getMessage(attendee: Person) {
    const title = this.getCleanTitle(35);
    const dateStr = this.getCompactDate(attendee.timeZone);
    const shortUrl = this.getShortBookingUrl();

    if (attendee.language?.locale && attendee.language.locale.startsWith("en")) {
      return `rOndevu: ${title} location changed. Date: ${dateStr}. Details: ${shortUrl}`;
    }

    return `rOndevu: ${title} randevu konumu degisti. Tarih: ${dateStr}. Detay: ${shortUrl}`;
  }
}
