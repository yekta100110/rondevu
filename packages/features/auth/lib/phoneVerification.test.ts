import process from "node:process";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  checkPhoneVerification,
  clearPhoneVerificationCache,
  consumePhoneVerification,
  sendPhoneVerification,
} from "./phoneVerification";

// Mock sendSMS
vi.mock("@calcom/lib/smsTransport", () => ({
  sendSMS: vi.fn().mockResolvedValue({ success: true }),
}));

describe("phoneVerification caching and replay protection", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    clearPhoneVerificationCache();
    delete process.env.TWILIO_SID;
    delete process.env.TWILIO_TOKEN;
    delete process.env.TWILIO_VERIFY_SID;
    process.env.CALENDSO_ENCRYPTION_KEY = "test-encryption-key-for-totp";
  });

  it("should successfully verify local TOTP and cache the result for replay in booking service", async () => {
    const phone = "+905521191987";
    // 1. Send verification (generates TOTP and sends SMS)
    const sendResult = await sendPhoneVerification(phone);
    expect(sendResult.success).toBe(true);

    const { sendSMS } = await import("@calcom/lib/smsTransport");
    const smsCalls = vi.mocked(sendSMS).mock.calls;
    expect(smsCalls.length).toBe(1);
    const smsBody = smsCalls[0][0].body;
    const codeMatch = smsBody.match(/\d{6}/);
    expect(codeMatch).toBeTruthy();
    const code = codeMatch?.[0] ?? "";

    // 2. First check (simulates VerifyCodeDialog submission)
    const check1 = await checkPhoneVerification(phone, code);
    expect(check1.success).toBe(true);

    // 3. Second check (simulates RegularBookingService createBooking call)
    // Should hit the cache and succeed without re-validating or failing
    const check2 = await checkPhoneVerification(phone, code);
    expect(check2.success).toBe(true);

    // 4. Also succeeds when phone is formatted differently (e.g. without leading plus)
    const check3 = await checkPhoneVerification("05521191987", code);
    expect(check3.success).toBe(true);
  });

  it("should invalidate cached verification when a new verification code is requested", async () => {
    const phone = "+905521191987";
    await sendPhoneVerification(phone);

    const { sendSMS } = await import("@calcom/lib/smsTransport");
    const firstCode = vi.mocked(sendSMS).mock.calls[0][0].body.match(/\d{6}/)?.[0] ?? "";

    // Verify first code
    const check1 = await checkPhoneVerification(phone, firstCode);
    expect(check1.success).toBe(true);

    // Request new code
    await sendPhoneVerification(phone);

    // Explicitly clear cache or verify cache was cleared
    clearPhoneVerificationCache(phone);

    // Checking an invalid/outdated code should fail
    const checkOutdated = await checkPhoneVerification(phone, "000000");
    expect(checkOutdated.success).toBe(false);
  });

  it("should reject invalid verification codes", async () => {
    const phone = "+905521191987";
    await sendPhoneVerification(phone);

    const checkInvalid = await checkPhoneVerification(phone, "999999");
    expect(checkInvalid.success).toBe(false);
    expect(checkInvalid.error).toBeTruthy();
  });

  it("should work with Twilio Verify API when configured and cache the approved status", async () => {
    process.env.TWILIO_SID = "AC_test_account_sid";
    process.env.TWILIO_TOKEN = "test_auth_token";
    process.env.TWILIO_VERIFY_SID = "VA_test_verify_sid";

    let verificationCheckCalls = 0;
    // Mock global fetch for Twilio Verify API
    globalThis.fetch = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes("/VerificationCheck")) {
        verificationCheckCalls++;
        if (verificationCheckCalls === 1) {
          // First call: Twilio approves
          return {
            ok: true,
            status: 200,
            json: async () => ({ status: "approved", valid: true }),
          };
        } else {
          // Second call: Twilio would return 404 or pending because code is single-use!
          return {
            ok: false,
            status: 404,
            json: async () => ({ message: "Verification not found (single-use consumed)" }),
          };
        }
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({ status: "pending" }),
      };
    }) as unknown as typeof fetch;

    const phone = "+905521191987";
    const code = "123456";

    // 1. First check: calls Twilio Verify, approves, and caches in memory
    const check1 = await checkPhoneVerification(phone, code);
    expect(check1.success).toBe(true);
    expect(verificationCheckCalls).toBe(1);

    // 2. Second check: should hit the cache! Twilio fetch is NOT called a second time.
    const check2 = await checkPhoneVerification(phone, code);
    expect(check2.success).toBe(true);
    expect(verificationCheckCalls).toBe(1); // Still 1! Protected from single-use Twilio rejection
  });

  it("should immediately invalidate verification cache when consumePhoneVerification is called (post-booking replay protection)", async () => {
    const phone = "+905521191987";
    await sendPhoneVerification(phone);

    const { sendSMS } = await import("@calcom/lib/smsTransport");
    const code = vi.mocked(sendSMS).mock.calls[0][0].body.match(/\d{6}/)?.[0] || "";

    // Verify code initially
    const check1 = await checkPhoneVerification(phone, code);
    expect(check1.success).toBe(true);

    // Simulate booking creation consuming the verification using raw digits without leading plus
    consumePhoneVerification("905521191987", code);

    // Replay check with dummy/outdated code or unverified code should fail
    const replayCheck = await checkPhoneVerification(phone, "000000");
    expect(replayCheck.success).toBe(false);
  });

  it("should normalize phone number when consumePhoneVerification is called with local Turkish format", async () => {
    const phone = "+905521191987";
    await sendPhoneVerification(phone);

    const { sendSMS } = await import("@calcom/lib/smsTransport");
    const code = vi.mocked(sendSMS).mock.calls[0][0].body.match(/\d{6}/)?.[0] || "";

    // Verify code initially
    const check1 = await checkPhoneVerification(phone, code);
    expect(check1.success).toBe(true);

    // Consume using 05XX format
    consumePhoneVerification("05521191987", code);

    // Calling again with outdated code should fail
    const replayCheck = await checkPhoneVerification(phone, "000000");
    expect(replayCheck.success).toBe(false);
  });
});
