import { WEBAPP_URL } from "@calcom/lib/constants";
import type { CalendarEvent, Person } from "@calcom/types/Calendar";
import SMSManager from "../sms-manager";

export default class EventReminderSMS extends SMSManager {
  constructor(calEvent: CalendarEvent) {
    super(calEvent);
  }

  getMessage(attendee: Person) {
    const bookingUrl = `${this.calEvent.bookerUrl ?? WEBAPP_URL}/booking/${this.calEvent.uid}`;
    const hostName = this.calEvent.organizer?.name || "Organizatör";
    const eventTitle = typeof this.calEvent.title === "string" ? this.calEvent.title : "Randevu";
    const dateStr = this.getFormattedDate(
      attendee.timeZone || "Europe/Istanbul",
      attendee.language?.locale || "tr"
    );

    if (attendee.language?.locale && attendee.language.locale !== "tr" && attendee.language.translate) {
      try {
        const t = attendee.language.translate;
        const reminderText = t("reminder_booking_sms", {
          name: attendee.name,
          date: dateStr,
          interpolation: { escapeValue: false },
        });
        const urlText = t("you_can_view_booking_details_with_this_url", {
          url: bookingUrl,
          interpolation: { escapeValue: false },
        });
        if (reminderText && !reminderText.includes("reminder_booking_sms")) {
          return `${reminderText}\n\n${urlText}`;
        }
      } catch {
        // Fallback to Turkish default
      }
    }

    return `Sayın ${attendee.name},\n\n${hostName} ile olan "${eventTitle}" randevunuzu (${dateStr}) hatırlatmak isteriz.\n\nRandevu detayları: ${bookingUrl}`;
  }
}
