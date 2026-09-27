import type { CalendarEvent, Person } from "@calcom/types/Calendar";
import SMSManager from "../sms-manager";

export default class CancelledSeatSMS extends SMSManager {
  constructor(calEvent: CalendarEvent) {
    super(calEvent);
  }

  getMessage(attendee: Person) {
    const title = this.getCleanTitle(30);
    const dateStr = this.getCompactDate(attendee.timeZone);
    const shortUrl = this.getShortBookingUrl();

    if (attendee.language?.locale && attendee.language.locale.startsWith("en")) {
      return `rOndevu: Your seat for ${title} was cancelled. Date: ${dateStr}. Details: ${shortUrl}`;
    }

    return `rOndevu: ${title} randevusundaki kaydiniz iptal edildi. Tarih: ${dateStr}. Detay: ${shortUrl}`;
  }
}
