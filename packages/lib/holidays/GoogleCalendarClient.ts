import process from "node:process";
import dayjs from "@calcom/dayjs";
import { GOOGLE_HOLIDAY_CALENDARS } from "./constants";

interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    date?: string;
    dateTime?: string;
  };
  end: {
    date?: string;
    dateTime?: string;
  };
}

interface GoogleCalendarEventsResponse {
  items?: GoogleCalendarEvent[];
  error?: {
    code: number;
    message: string;
  };
}

export interface GoogleCalendarHoliday {
  id: string;
  countryCode: string;
  eventId: string;
  name: string;
  date: Date;
  year: number;
}

function getTurkishOfflineHolidays(year: number): GoogleCalendarHoliday[] {
  const fixedHolidays = [
    { idSuffix: "new_year", name: "Yılbaşı", dateStr: `${year}-01-01` },
    { idSuffix: "childrens_day", name: "Ulusal Egemenlik ve Çocuk Bayramı", dateStr: `${year}-04-23` },
    { idSuffix: "labor_day", name: "Emek ve Dayanışma Günü", dateStr: `${year}-05-01` },
    { idSuffix: "youth_day", name: "Atatürk'ü Anma, Gençlik ve Spor Bayramı", dateStr: `${year}-05-19` },
    { idSuffix: "democracy_day", name: "Demokrasi ve Milli Birlik Günü", dateStr: `${year}-07-15` },
    { idSuffix: "victory_day", name: "Zafer Bayramı", dateStr: `${year}-08-30` },
    { idSuffix: "republic_day", name: "Cumhuriyet Bayramı", dateStr: `${year}-10-29` },
  ];

  const moveableHolidays: Record<number, { idSuffix: string; name: string; dateStr: string }[]> = {
    2025: [
      { idSuffix: "ramadan_1", name: "Ramazan Bayramı 1. Gün", dateStr: "2025-03-30" },
      { idSuffix: "ramadan_2", name: "Ramazan Bayramı 2. Gün", dateStr: "2025-03-31" },
      { idSuffix: "ramadan_3", name: "Ramazan Bayramı 3. Gün", dateStr: "2025-04-01" },
      { idSuffix: "sacrifice_1", name: "Kurban Bayramı 1. Gün", dateStr: "2025-06-06" },
      { idSuffix: "sacrifice_2", name: "Kurban Bayramı 2. Gün", dateStr: "2025-06-07" },
      { idSuffix: "sacrifice_3", name: "Kurban Bayramı 3. Gün", dateStr: "2025-06-08" },
      { idSuffix: "sacrifice_4", name: "Kurban Bayramı 4. Gün", dateStr: "2025-06-09" },
    ],
    2026: [
      { idSuffix: "ramadan_1", name: "Ramazan Bayramı 1. Gün", dateStr: "2026-03-20" },
      { idSuffix: "ramadan_2", name: "Ramazan Bayramı 2. Gün", dateStr: "2026-03-21" },
      { idSuffix: "ramadan_3", name: "Ramazan Bayramı 3. Gün", dateStr: "2026-03-22" },
      { idSuffix: "sacrifice_1", name: "Kurban Bayramı 1. Gün", dateStr: "2026-05-27" },
      { idSuffix: "sacrifice_2", name: "Kurban Bayramı 2. Gün", dateStr: "2026-05-28" },
      { idSuffix: "sacrifice_3", name: "Kurban Bayramı 3. Gün", dateStr: "2026-05-29" },
      { idSuffix: "sacrifice_4", name: "Kurban Bayramı 4. Gün", dateStr: "2026-05-30" },
    ],
    2027: [
      { idSuffix: "ramadan_1", name: "Ramazan Bayramı 1. Gün", dateStr: "2027-03-10" },
      { idSuffix: "ramadan_2", name: "Ramazan Bayramı 2. Gün", dateStr: "2027-03-11" },
      { idSuffix: "ramadan_3", name: "Ramazan Bayramı 3. Gün", dateStr: "2027-03-12" },
      { idSuffix: "sacrifice_1", name: "Kurban Bayramı 1. Gün", dateStr: "2027-05-17" },
      { idSuffix: "sacrifice_2", name: "Kurban Bayramı 2. Gün", dateStr: "2027-05-18" },
      { idSuffix: "sacrifice_3", name: "Kurban Bayramı 3. Gün", dateStr: "2027-05-19" },
      { idSuffix: "sacrifice_4", name: "Kurban Bayramı 4. Gün", dateStr: "2027-05-20" },
    ],
  };

  const list = [...fixedHolidays, ...(moveableHolidays[year] || [])];
  return list.map((item) => ({
    id: `TR_${year}_${item.idSuffix}`,
    countryCode: "TR",
    eventId: `${year}_${item.idSuffix}`,
    name: item.name,
    date: dayjs(item.dateStr).toDate(),
    year,
  }));
}

export class GoogleCalendarClient {
  private apiKey: string;

  constructor(apiKey?: string) {
    const key = apiKey || process.env.GOOGLE_CALENDAR_API_KEY;
    this.apiKey = key || "";
  }

  async fetchHolidays(countryCode: string, year: number): Promise<GoogleCalendarHoliday[]> {
    if (!this.apiKey) {
      if (countryCode === "TR") {
        return getTurkishOfflineHolidays(year);
      }
      return [];
    }

    const calendarConfig = GOOGLE_HOLIDAY_CALENDARS[countryCode];
    if (!calendarConfig) {
      return [];
    }

    try {
      const calendarId = encodeURIComponent(calendarConfig.calendarId);

      const timeMin = dayjs(`${year}-01-01`).startOf("day").toISOString();
      const timeMax = dayjs(`${year}-12-31`).endOf("day").toISOString();

      const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${this.apiKey}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;

      const response = await fetch(url);
      const data: GoogleCalendarEventsResponse = await response.json();

      if (data.error) {
        console.warn(`Google Calendar API error for ${countryCode}:`, data.error.message);
        if (countryCode === "TR") {
          return getTurkishOfflineHolidays(year);
        }
        return [];
      }

      if (!data.items) {
        return [];
      }

      return data.items.map((event) => {
        const dateStr = event.start.date || event.start.dateTime?.split("T")[0];
        const date = dateStr ? dayjs(dateStr).toDate() : new Date();

        return {
          id: `${countryCode}_${event.id}`,
          countryCode,
          eventId: event.id,
          name: event.summary,
          date,
          year,
        };
      });
    } catch (err) {
      console.warn(`Google Calendar fetch error for ${countryCode}:`, err);
      if (countryCode === "TR") {
        return getTurkishOfflineHolidays(year);
      }
      return [];
    }
  }
}

let defaultClient: GoogleCalendarClient | null = null;

export function getGoogleCalendarClient(): GoogleCalendarClient {
  if (!defaultClient) {
    defaultClient = new GoogleCalendarClient();
  }
  return defaultClient;
}
