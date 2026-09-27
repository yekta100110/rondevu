import type { CalendarEvent, Person } from "@calcom/types/Calendar";
import SMSManager from "../sms-manager";

export default class EventRequestSMS extends SMSManager {
  constructor(calEvent: CalendarEvent) {
    super(calEvent);
  }

  getMessage(attendee: Person) {
    const title = this.getCleanTitle(30);
    const dateStr = this.getCompactDate(attendee.timeZone);
    const shortUrl = this.getShortBookingUrl();

    if (attendee.language?.locale && attendee.language.locale.startsWith("en")) {
      return `rOndevu: ${title} request received. Awaiting confirmation. Date: ${dateStr}. Details: ${shortUrl}`;
    }

    return `rOndevu: ${title} randevu talebi alindi. Onay bekleniyor. Tarih: ${dateStr}. Detay: ${shortUrl}`;
  }
}
