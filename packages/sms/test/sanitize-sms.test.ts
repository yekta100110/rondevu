import { sanitizeSmsText } from "@calcom/lib/smsTransport";
import type { CalendarEvent, Person } from "@calcom/types/Calendar";
import { describe, expect, test } from "vitest";

import EventCancelledSMS from "../attendee/event-cancelled-sms";
import EventReminderSMS from "../attendee/event-reminder-sms";
import EventSuccessfullyReScheduledSMS from "../attendee/event-rescheduled-sms";
import EventSuccessfullyScheduledSMS from "../attendee/event-scheduled-sms";

describe("sanitizeSmsText (GSM 7-bit ASCII Transliteration)", () => {
  test("transliterates Turkish special characters to ASCII equivalents", () => {
    const raw = "Çağatay, Ilgım, Şebnem ve Özgür ile Ülkü görüşmesi yapıldı.";
    const sanitized = sanitizeSmsText(raw);

    expect(sanitized).toBe("Cagatay, Ilgim, Sebnem ve Ozgur ile Ulku gorusmesi yapildi.");
    // Confirm strictly ASCII
    for (let i = 0; i < sanitized.length; i++) {
      expect(sanitized.charCodeAt(i)).toBeLessThanOrEqual(127);
    }
  });

  test("handles uppercase and lowercase Turkish characters accurately", () => {
    const raw = "çÇ ğĞ ıİ öÖ şŞ üÜ âÂ îÎ ûÛ";
    const sanitized = sanitizeSmsText(raw);

    expect(sanitized).toBe("cC gG iI oO sS uU aA iI uU");
  });

  test("normalizes typographical quotes, dashes, ellipsis, and non-breaking spaces", () => {
    const raw = "“rOndevu” – ‘Danışmanlık’… Tarih:\u00A027.09";
    const sanitized = sanitizeSmsText(raw);

    expect(sanitized).toBe('"rOndevu" - \'Danismanlik\'... Tarih: 27.09');
  });

  test("collapses multiple consecutive whitespaces and trims", () => {
    const raw = "   rOndevu:    Danismanlik   randevunuz     onaylandi.   ";
    const sanitized = sanitizeSmsText(raw);

    expect(sanitized).toBe("rOndevu: Danismanlik randevunuz onaylandi.");
  });

  test("handles empty or null-like inputs safely", () => {
    expect(sanitizeSmsText("")).toBe("");
    // @ts-expect-error test undefined
    expect(sanitizeSmsText(undefined)).toBe("");
  });
});

describe("Transactional SMS Templates (Strict <= 160 Characters / 1 Segment)", () => {
  const mockAttendee: Person = {
    name: "Ahmet Yılmaz",
    email: "ahmet@example.com",
    phoneNumber: "+905551234567",
    timeZone: "Europe/Istanbul",
    language: { translate: ((k: string) => k) as any, locale: "tr" },
  };

  const createMockCalEvent = (title: string, uid = "cm123abc456def789ghi012j"): CalendarEvent => ({
    type: "30-min",
    title,
    startTime: "2026-10-15T11:30:00.000Z",
    endTime: "2026-10-15T12:00:00.000Z",
    organizer: {
      id: 1,
      name: "Dr. Mehmet Özkan",
      email: "mehmet@rondevu.org",
      timeZone: "Europe/Istanbul",
      language: { translate: ((k: string) => k) as any, locale: "tr" },
    },
    attendees: [mockAttendee],
    uid,
    bookerUrl: "https://rondevu.org",
  });

  test("Confirmation SMS: strictly <= 160 chars and GSM 7-bit compliant", () => {
    const calEvent = createMockCalEvent("Klinik Danışmanlık ve Sağlık Görüşmesi");
    const sms = new EventSuccessfullyScheduledSMS(calEvent);
    const rawMessage = sms.getMessage(mockAttendee);
    const sanitized = sanitizeSmsText(rawMessage);

    expect(sanitized.length).toBeLessThanOrEqual(160);
    expect(sanitized).toContain("rOndevu:");
    expect(sanitized).toContain("randevunuz onaylandi");
    expect(sanitized).toContain("Tarih: 15.10 14:30");
    expect(sanitized).toContain("Detay/Iptal: rondevu.org/b/cm123abc456def789ghi012j");
    expect(sanitized).not.toContain("https://");

    // All characters must be standard ASCII (GSM 7-bit safe)
    for (let i = 0; i < sanitized.length; i++) {
      expect(sanitized.charCodeAt(i)).toBeLessThanOrEqual(127);
    }
  });

  test("Reminder SMS: strictly <= 160 chars and GSM 7-bit compliant", () => {
    const calEvent = createMockCalEvent("Girişimcilik Danışmanlığı");
    const sms = new EventReminderSMS(calEvent);
    const rawMessage = sms.getMessage(mockAttendee);
    const sanitized = sanitizeSmsText(rawMessage);

    expect(sanitized.length).toBeLessThanOrEqual(160);
    expect(sanitized).toContain("rOndevu Hatirlatma:");
    expect(sanitized).toContain("randevunuz yaklasiyor");
    expect(sanitized).toContain("Tarih: 15.10 14:30");
    expect(sanitized).toContain("Detay: rondevu.org/b/cm123abc456def789ghi012j");
    expect(sanitized).not.toContain("https://");

    for (let i = 0; i < sanitized.length; i++) {
      expect(sanitized.charCodeAt(i)).toBeLessThanOrEqual(127);
    }
  });

  test("Cancellation SMS: strictly <= 160 chars and GSM 7-bit compliant", () => {
    const calEvent = createMockCalEvent("Finansal Planlama Değerlendirmesi");
    const sms = new EventCancelledSMS(calEvent);
    const rawMessage = sms.getMessage(mockAttendee);
    const sanitized = sanitizeSmsText(rawMessage);

    expect(sanitized.length).toBeLessThanOrEqual(160);
    expect(sanitized).toContain("rOndevu:");
    expect(sanitized).toContain("randevunuz iptal edildi");
    expect(sanitized).toContain("Tarih: 15.10 14:30");
    expect(sanitized).toContain("Detay: rondevu.org/b/cm123abc456def789ghi012j");
    expect(sanitized).not.toContain("https://");

    for (let i = 0; i < sanitized.length; i++) {
      expect(sanitized.charCodeAt(i)).toBeLessThanOrEqual(127);
    }
  });

  test("Reschedule SMS: strictly <= 160 chars and GSM 7-bit compliant", () => {
    const calEvent = createMockCalEvent("Strateji ve Büyüme Toplantısı");
    const sms = new EventSuccessfullyReScheduledSMS(calEvent);
    const rawMessage = sms.getMessage(mockAttendee);
    const sanitized = sanitizeSmsText(rawMessage);

    expect(sanitized.length).toBeLessThanOrEqual(160);
    expect(sanitized).toContain("rOndevu:");
    expect(sanitized).toContain("randevunuz guncellendi");
    expect(sanitized).toContain("Yeni Tarih: 15.10 14:30");
    expect(sanitized).toContain("Detay: rondevu.org/b/cm123abc456def789ghi012j");
    expect(sanitized).not.toContain("https://");

    for (let i = 0; i < sanitized.length; i++) {
      expect(sanitized.charCodeAt(i)).toBeLessThanOrEqual(127);
    }
  });

  test("Extreme long event title is truncated and still strictly <= 160 chars", () => {
    const longTitle = "Çok Uzun Başlıklı Bir Danışmanlık ve Kapsamlı Yönetim ve Süreç İnceleme Toplantısı";
    const calEvent = createMockCalEvent(longTitle);
    const sms = new EventSuccessfullyScheduledSMS(calEvent);
    const rawMessage = sms.getMessage(mockAttendee);
    const sanitized = sanitizeSmsText(rawMessage);

    expect(sanitized.length).toBeLessThanOrEqual(160);
    expect(sanitized).toContain("...");
  });
});
