import type { CalendarEvent, Person } from "@calcom/types/Calendar";
import SMSManager from "../sms-manager";

export default class EventSuccessfullyReScheduledSMS extends SMSManager {
  constructor(calEvent: CalendarEvent) {
    super(calEvent);
  }

  getMessage(attendee: Person) {
    const title = this.getCleanTitle(32);
    const dateStr = this.getCompactDate(attendee.timeZone);
    const shortUrl = this.getShortBookingUrl();

    if (attendee.language?.locale && attendee.language.locale.startsWith("en")) {
      return `rOndevu: ${title} rescheduled. New Date: ${dateStr}. Details: ${shortUrl}`;
    }

    return `rOndevu: ${title} randevunuz guncellendi. Yeni Tarih: ${dateStr}. Detay: ${shortUrl}`;
  }
}
