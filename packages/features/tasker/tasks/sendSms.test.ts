import { beforeEach, describe, expect, it, vi } from "vitest";

const { findUnique, sendSMS, sendReminder } = vi.hoisted(() => ({
  findUnique: vi.fn(),
  sendSMS: vi.fn(),
  sendReminder: vi.fn(),
}));

vi.mock("@calcom/prisma", () => ({ prisma: { booking: { findUnique } } }));
vi.mock("@calcom/lib/smsTransport", () => ({ sendSMS }));
vi.mock("@calcom/sms/attendee/event-reminder-sms", () => ({
  default: class {
    sendSMSToAttendees = sendReminder;
  },
}));

import { sendSms } from "./sendSms";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("queued SMS reminders", () => {
  it("does not send an overdue reminder after the booking has started", async () => {
    findUnique.mockResolvedValue({
      uid: "old-booking",
      status: "ACCEPTED",
      startTime: new Date("2026-09-28T05:00:00.000Z"),
    });

    await sendSms(JSON.stringify({ bookingUid: "old-booking" }));

    expect(sendSMS).not.toHaveBeenCalled();
    expect(sendReminder).not.toHaveBeenCalled();
  });
});
