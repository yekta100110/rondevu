import type { CalendarEvent, Person } from "@calcom/types/Calendar";
import SMSManager from "../sms-manager";

export default class AwaitingPaymentSMS extends SMSManager {
  constructor(calEvent: CalendarEvent) {
    super(calEvent);
  }

  getMessage(attendee: Person) {
    const title = this.getCleanTitle(30);
    const dateStr = this.getCompactDate(attendee.timeZone);
    const shortUrl = this.getShortBookingUrl();

    if (attendee.language?.locale && attendee.language.locale.startsWith("en")) {
      return `rOndevu: ${title} awaiting payment. Date: ${dateStr}. Complete payment: ${shortUrl}`;
    }

    return `rOndevu: ${title} randevusu icin odeme bekleniyor. Tarih: ${dateStr}. Odemek icin: ${shortUrl}`;
  }
}
