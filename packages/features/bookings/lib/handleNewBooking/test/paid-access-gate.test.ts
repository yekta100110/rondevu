import prismaMock from "@rondevu/testing/lib/__mocks__/prisma";
import {
  createBookingScenario,
  getBooker,
  getGoogleCalendarCredential,
  getOrganizer,
  getScenarioData,
  mockCalendarToHaveNoBusySlots,
  TestData,
} from "@rondevu/testing/lib/bookingScenario/bookingScenario";
import { BookingStatus } from "@rondevu/prisma/enums";
import { getMockRequestDataForBooking } from "@rondevu/testing/lib/bookingScenario/getMockRequestDataForBooking";
import { setupAndTeardown } from "@rondevu/testing/lib/bookingScenario/setupAndTeardown";
import { test } from "@rondevu/testing/lib/fixtures/fixtures";
import { describe, expect, vi } from "vitest";
import { getNewBookingHandler } from "./getNewBookingHandler";

vi.mock("@rondevu/features/auth/lib/verifyCodeUnAuthenticated", () => ({
  verifyCodeUnAuthenticated: vi.fn(),
}));

async function setUpOrganizerEvent() {
  const organizer = getOrganizer({
    name: "Organizer",
    email: "organizer@example.com",
    id: 101,
    schedules: [TestData.schedules.IstWorkHours],
    credentials: [getGoogleCalendarCredential()],
    selectedCalendars: [TestData.selectedCalendars.google],
  });
  await createBookingScenario(
    getScenarioData({
      eventTypes: [{ id: 1, slotInterval: 30, length: 30, users: [{ id: 101 }] }],
      organizer,
      apps: [TestData.apps["google-calendar"]],
    })
  );
  await mockCalendarToHaveNoBusySlots("googlecalendar", {});
  const booker = getBooker({ email: "booker@example.com", name: "Booker" });
  return getMockRequestDataForBooking({
    data: {
      eventTypeId: 1,
      responses: { email: booker.email, name: booker.name, location: { optionValue: "", value: "Ofis" } },
    },
  });
}

describe("New bookings require the organizer's paid access", () => {
  setupAndTeardown();

  test("refuses a new booking when the organizer has no access", async () => {
    const bookingData = await setUpOrganizerEvent();
    await prismaMock.billingManualAccess.deleteMany({ where: { userId: 101 } });

    await expect(getNewBookingHandler()({ bookingData })).rejects.toThrow("organizer_not_accepting_bookings");
    expect(await prismaMock.booking.count()).toBe(0);
  });

  test("accepts the booking while the organizer has access", async () => {
    const bookingData = await setUpOrganizerEvent();

    const booking = await getNewBookingHandler()({ bookingData });
    expect(booking).toEqual(expect.objectContaining({ status: BookingStatus.ACCEPTED }));
  });
});
