import type { CalendarEvent, Person } from "@calcom/types/Calendar";
import SMSManager from "../sms-manager";

export default class EventReminderSMS extends SMSManager {
  constructor(calEvent: CalendarEvent) {
    super(calEvent);
  }

  getMessage(attendee: Person) {
    const title = this.getCleanTitle(30);
    const dateStr = this.getCompactDate(attendee.timeZone);
    const shortUrl = this.getShortBookingUrl();

    if (attendee.language?.locale && attendee.language.locale.startsWith("en")) {
      return `rOndevu Reminder: ${title} is coming up. Date: ${dateStr}. Details: ${shortUrl}`;
    }

    return `rOndevu Hatirlatma: ${title} randevunuz yaklasiyor. Tarih: ${dateStr}. Detay: ${shortUrl}`;
  }
}
