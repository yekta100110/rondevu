import { describe, expect, it } from "vitest";
import { normalizePhoneNumber } from "./normalizePhoneNumber";

describe("normalizePhoneNumber", () => {
  it("handles empty or falsy inputs", () => {
    expect(normalizePhoneNumber("")).toBe("");
    expect(normalizePhoneNumber("   ")).toBe("");
    expect(normalizePhoneNumber("abc")).toBe("");
  });

  it("handles already formatted E.164 strings with spaces or dashes", () => {
    expect(normalizePhoneNumber("+90 552 119 19 87", "twilio")).toBe("+905521191987");
    expect(normalizePhoneNumber("+1 (555) 123-4567", "twilio")).toBe("+15551234567");
    expect(normalizePhoneNumber("+44 20 7946 0958", "twilio")).toBe("+442079460958");
  });

  it("normalizes Turkish phone numbers without leading plus", () => {
    // 10 digits without leading 0
    expect(normalizePhoneNumber("552 119 19 87", "twilio")).toBe("+905521191987");
    expect(normalizePhoneNumber("5521191987", "twilio")).toBe("+905521191987");
    // 11 digits with leading 0
    expect(normalizePhoneNumber("0552 119 19 87", "twilio")).toBe("+905521191987");
    expect(normalizePhoneNumber("05521191987", "twilio")).toBe("+905521191987");
    // 12 digits with 90 prefix
    expect(normalizePhoneNumber("905521191987", "twilio")).toBe("+905521191987");
    expect(normalizePhoneNumber("90 552 119 19 87", "twilio")).toBe("+905521191987");
  });

  it("normalizes international numbers starting with 00", () => {
    expect(normalizePhoneNumber("00905521191987", "twilio")).toBe("+905521191987");
    expect(normalizePhoneNumber("0015551234567", "twilio")).toBe("+15551234567");
  });

  it("normalizes for netgsm provider correctly", () => {
    expect(normalizePhoneNumber("05521191987", "netgsm")).toBe("5521191987");
    expect(normalizePhoneNumber("905521191987", "netgsm")).toBe("5521191987");
  });
});
