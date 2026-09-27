import type { CalendarEvent, Person } from "@calcom/types/Calendar";
import SMSManager from "../sms-manager";

export default class EventRequestToRescheduleSMS extends SMSManager {
  constructor(calEvent: CalendarEvent) {
    super(calEvent);
  }

  getMessage(attendee: Person) {
    const title = this.getCleanTitle(30);
    const shortUrl = this.getShortBookingUrl();

    if (attendee.language?.locale && attendee.language.locale.startsWith("en")) {
      return `rOndevu: Reschedule requested for ${title}. Select new time: ${shortUrl}`;
    }

    return `rOndevu: ${title} randevusu icin saat degisikligi talebi var. Secim yapin: ${shortUrl}`;
  }
}
