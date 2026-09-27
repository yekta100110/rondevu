import type { PrismaClient } from "@calcom/prisma";
import { describe, expect, it, vi } from "vitest";
import { areContactsMatching, enrichBookingsWithHistoricalNoShow } from "./enrichHistoricalNoShow";

describe("areContactsMatching", () => {
  it("should match by direct email", () => {
    expect(areContactsMatching({ email: "client@example.com" }, { email: "client@example.com" })).toBe(true);

    expect(areContactsMatching({ email: "Client@Example.COM" }, { email: "client@example.com" })).toBe(true);
  });

  it("should not match synthetic SMS emails as regular emails", () => {
    expect(
      areContactsMatching({ email: "1234567890@sms.rondevu.org" }, { email: "9876543210@sms.rondevu.org" })
    ).toBe(false);
  });

  it("should match by phone numbers with different Turkish formats", () => {
    expect(
      areContactsMatching(
        { email: "any@example.com", phoneNumber: "+905521191987" },
        { email: "other@example.com", phoneNumber: "0552 119 19 87" }
      )
    ).toBe(true);

    expect(
      areContactsMatching(
        { email: "any@example.com", phoneNumber: "5521191987" },
        { email: "other@example.com", phoneNumber: "+90 552 119 1987" }
      )
    ).toBe(true);
  });

  it("should cross-match synthetic SMS email with raw phone number", () => {
    expect(
      areContactsMatching(
        { email: "905521191987@sms.rondevu.org" },
        { email: "unrelated@example.com", phoneNumber: "+90 552 119 19 87" }
      )
    ).toBe(true);

    expect(
      areContactsMatching(
        { email: "unrelated@example.com", phoneNumber: "05521191987" },
        { email: "905521191987@sms.cal.com" }
      )
    ).toBe(true);
  });

  it("should return false for different contacts", () => {
    expect(
      areContactsMatching(
        { email: "alice@example.com", phoneNumber: "+905521111111" },
        { email: "bob@example.com", phoneNumber: "+905522222222" }
      )
    ).toBe(false);
  });
});

describe("enrichBookingsWithHistoricalNoShow", () => {
  const organizerUserId = 42;

  it("should return empty array when bookings array is empty", async () => {
    const mockPrisma = {
      attendee: { findMany: vi.fn() },
    } as unknown as PrismaClient;

    const result = await enrichBookingsWithHistoricalNoShow({
      bookings: [],
      prisma: mockPrisma,
      organizerUserId,
    });

    expect(result).toEqual([]);
    expect(mockPrisma.attendee.findMany).not.toHaveBeenCalled();
  });

  it("should calculate 0 count when no past no-shows exist", async () => {
    const mockPrisma = {
      attendee: {
        findMany: vi.fn().mockResolvedValue([]),
      },
    } as unknown as PrismaClient;

    const bookings = [
      {
        id: 101,
        startTime: new Date("2026-10-01T10:00:00Z").toISOString(),
        attendees: [
          {
            id: 1,
            email: "fresh.client@example.com",
            phoneNumber: "+905521191987",
          },
        ],
      },
    ];

    const result = await enrichBookingsWithHistoricalNoShow({
      bookings,
      prisma: mockPrisma,
      organizerUserId,
    });

    expect(result[0].historicalNoShowCount).toBe(0);
    expect(result[0].attendees[0].historicalNoShowCount).toBe(0);
  });

  it("should calculate 1 count when client missed 1 past appointment matching email", async () => {
    const pastNoShowAttendee = {
      id: 99,
      email: "client@example.com",
      phoneNumber: null,
      bookingId: 10,
      booking: {
        id: 10,
        startTime: new Date("2026-09-01T10:00:00Z"),
      },
    };

    const mockPrisma = {
      attendee: {
        findMany: vi.fn().mockResolvedValue([pastNoShowAttendee]),
      },
    } as unknown as PrismaClient;

    const bookings = [
      {
        id: 102,
        startTime: new Date("2026-10-01T10:00:00Z").toISOString(),
        attendees: [
          {
            id: 2,
            email: "client@example.com",
            phoneNumber: "+905521191987",
          },
        ],
      },
    ];

    const result = await enrichBookingsWithHistoricalNoShow({
      bookings,
      prisma: mockPrisma,
      organizerUserId,
    });

    expect(result[0].historicalNoShowCount).toBe(1);
    expect(result[0].attendees[0].historicalNoShowCount).toBe(1);
  });

  it("should calculate 2 count when client missed 2 distinct past bookings", async () => {
    const pastNoShows = [
      {
        id: 98,
        email: "client@example.com",
        phoneNumber: null,
        bookingId: 10,
        booking: {
          id: 10,
          startTime: new Date("2026-08-01T10:00:00Z"),
        },
      },
      {
        id: 99,
        email: "other@example.com",
        phoneNumber: "+905521191987",
        bookingId: 20,
        booking: {
          id: 20,
          startTime: new Date("2026-09-01T10:00:00Z"),
        },
      },
    ];

    const mockPrisma = {
      attendee: {
        findMany: vi.fn().mockResolvedValue(pastNoShows),
      },
    } as unknown as PrismaClient;

    const bookings = [
      {
        id: 103,
        startTime: new Date("2026-10-01T10:00:00Z").toISOString(),
        attendees: [
          {
            id: 3,
            email: "client@example.com",
            phoneNumber: "0552 119 19 87",
          },
        ],
      },
    ];

    const result = await enrichBookingsWithHistoricalNoShow({
      bookings,
      prisma: mockPrisma,
      organizerUserId,
    });

    expect(result[0].historicalNoShowCount).toBe(2);
    expect(result[0].attendees[0].historicalNoShowCount).toBe(2);
  });

  it("should not count the current booking itself as a historical no-show", async () => {
    const currentBookingNoShow = {
      id: 50,
      email: "client@example.com",
      phoneNumber: null,
      bookingId: 104, // Same booking ID
      booking: {
        id: 104,
        startTime: new Date("2026-09-01T10:00:00Z"),
      },
    };

    const mockPrisma = {
      attendee: {
        findMany: vi.fn().mockResolvedValue([currentBookingNoShow]),
      },
    } as unknown as PrismaClient;

    const bookings = [
      {
        id: 104,
        startTime: new Date("2026-09-01T10:00:00Z").toISOString(),
        attendees: [
          {
            id: 4,
            email: "client@example.com",
            phoneNumber: null,
          },
        ],
      },
    ];

    const result = await enrichBookingsWithHistoricalNoShow({
      bookings,
      prisma: mockPrisma,
      organizerUserId,
    });

    expect(result[0].historicalNoShowCount).toBe(0);
    expect(result[0].attendees[0].historicalNoShowCount).toBe(0);
  });
});
