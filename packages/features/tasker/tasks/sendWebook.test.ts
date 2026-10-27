import { afterEach, describe, expect, it, vi } from "vitest";

const { findUnique, sendPayload } = vi.hoisted(() => ({ findUnique: vi.fn(), sendPayload: vi.fn() }));

vi.mock("@calcom/prisma", () => ({ prisma: { webhook: { findUnique } } }));
vi.mock("@calcom/features/webhooks/lib/sendPayload", () => ({ default: sendPayload }));

import { sendWebhook } from "./sendWebook";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe("scheduled platform webhooks", () => {
  const scheduled = JSON.stringify({
    secretKey: "old-secret",
    triggerEvent: "BOOKING_CREATED",
    createdAt: new Date().toISOString(),
    webhook: {
      id: "webhook-1",
      subscriberUrl: "https://old.example/webhook",
      appId: null,
      payloadTemplate: null,
      version: "2021-10-20",
    },
    data: { uid: "booking-1" },
  });

  it("does not send a snapshot after the platform webhook is deactivated", async () => {
    vi.stubEnv("RONDEVU_PLATFORM_WEBHOOK_ENABLE", "1");
    findUnique.mockResolvedValue({ active: false, platform: true, secret: "new-secret" });
    await sendWebhook(scheduled);
    expect(sendPayload).not.toHaveBeenCalled();
  });
});
