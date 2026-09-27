import type { CalendarEvent, Person } from "@calcom/types/Calendar";
import SMSManager from "../sms-manager";

export default class EventDeclinedSMS extends SMSManager {
  constructor(calEvent: CalendarEvent) {
    super(calEvent);
  }

  getMessage(attendee: Person) {
    const title = this.getCleanTitle(35);
    const dateStr = this.getCompactDate(attendee.timeZone);

    if (attendee.language?.locale && attendee.language.locale.startsWith("en")) {
      return `rOndevu: ${title} request was declined. Date: ${dateStr}.`;
    }

    return `rOndevu: ${title} randevu talebiniz onaylanamadi. Tarih: ${dateStr}.`;
  }
}
