import { WEBAPP_URL } from "@calcom/lib/constants";
import type { CalendarEvent, Person } from "@calcom/types/Calendar";
import SMSManager from "../sms-manager";

export default class EventSuccessfullyReScheduledSMS extends SMSManager {
  constructor(calEvent: CalendarEvent) {
    super(calEvent);
  }

  getMessage(attendee: Person) {
    const bookerUrl = `${this.calEvent.bookerUrl ?? WEBAPP_URL}/booking/${this.calEvent.uid}`;
    const hostName = this.calEvent.organizer?.name || "Organizatör";
    const eventTitle = typeof this.calEvent.title === "string" ? this.calEvent.title : "Randevu";
    const dateStr = this.getFormattedDate(
      attendee.timeZone || "Europe/Istanbul",
      attendee.language?.locale || "tr"
    );

    if (attendee.language?.locale && attendee.language.locale !== "tr" && attendee.language.translate) {
      try {
        const t = attendee.language.translate;
        const bookerUrlText = t("you_can_view_booking_details_with_this_url", {
          url: bookerUrl,
          interpolation: { escapeValue: false },
        });
        const eventTypeHasBeenRescheduledOnTimeDateText = t("event_type_has_been_rescheduled_on_time_date", {
          title: eventTitle,
          date: dateStr,
          interpolation: { escapeValue: false },
        });
        return `${t("hey_there")} ${attendee.name}, ${eventTypeHasBeenRescheduledOnTimeDateText}\n\n${bookerUrlText}`;
      } catch {
        // Fallback to Turkish default
      }
    }

    return `Sayın ${attendee.name},\n\n${hostName} ile olan "${eventTitle}" randevunuz (${dateStr}) tarihine yeniden planlanmıştır.\n\nRandevu detayları: ${bookerUrl}`;
  }
}
