import { describe, expect, it } from "vitest";
import { isPhoneConfirmationEvent } from "./isPhoneConfirmationEvent";

describe("isPhoneConfirmationEvent", () => {
  it("should return false when bookingFields is null or undefined", () => {
    expect(isPhoneConfirmationEvent(null)).toBe(false);
    expect(isPhoneConfirmationEvent(undefined)).toBe(false);
    expect(isPhoneConfirmationEvent([])).toBe(false);
  });

  it("should return false for default email booking", () => {
    const fields = [
      { name: "name", required: true, hidden: false },
      { name: "email", required: true, hidden: false },
      { name: "attendeePhoneNumber", required: false, hidden: true },
    ];
    expect(isPhoneConfirmationEvent(fields)).toBe(false);
  });

  it("should return true when attendeePhoneNumber is required and email is hidden", () => {
    const fields = [
      { name: "name", required: true, hidden: false },
      { name: "email", required: false, hidden: true },
      { name: "attendeePhoneNumber", required: true, hidden: false },
    ];
    expect(isPhoneConfirmationEvent(fields)).toBe(true);
  });

  it("should return true when phone is required and email is not required", () => {
    const fields = [
      { name: "name", required: true, hidden: false },
      { name: "email", required: false, hidden: false },
      { name: "phone", required: true, hidden: false },
    ];
    expect(isPhoneConfirmationEvent(fields)).toBe(true);
  });

  it("should return false when attendeePhoneNumber is hidden", () => {
    const fields = [
      { name: "email", required: false, hidden: true },
      { name: "attendeePhoneNumber", required: true, hidden: true },
    ];
    expect(isPhoneConfirmationEvent(fields)).toBe(false);
  });

  // Defect 3 scenarios:
  it("should return true when BOTH email and phone are visible/required and confirmationOption is phone", () => {
    const fields = [
      { name: "name", required: true, hidden: false },
      { name: "email", required: true, hidden: false },
      { name: "attendeePhoneNumber", required: true, hidden: false },
    ];
    const metadata = { confirmationOption: "phone" };
    expect(isPhoneConfirmationEvent(fields, metadata)).toBe(true);
  });

  it("should return true when event object has metadata.verificationOption = phone", () => {
    const event = {
      bookingFields: [
        { name: "name", required: true, hidden: false },
        { name: "email", required: true, hidden: false },
        { name: "attendeePhoneNumber", required: true, hidden: false },
      ],
      metadata: { verificationOption: "phone" },
    };
    expect(isPhoneConfirmationEvent(event)).toBe(true);
  });

  it("should return true when metadata has requiresPhoneVerification = true", () => {
    const fields = [
      { name: "name", required: true, hidden: false },
      { name: "email", required: true, hidden: false },
      { name: "attendeePhoneNumber", required: true, hidden: false },
    ];
    expect(isPhoneConfirmationEvent(fields, { requiresPhoneVerification: true })).toBe(true);
  });

  it("should return false when metadata explicitly sets confirmationOption to email even if phone is required", () => {
    const fields = [
      { name: "name", required: true, hidden: false },
      { name: "email", required: true, hidden: false },
      { name: "attendeePhoneNumber", required: true, hidden: false },
    ];
    const metadata = { confirmationOption: "email" };
    expect(isPhoneConfirmationEvent(fields, metadata)).toBe(false);
  });

  it("should return true when phoneField has verify: true flag", () => {
    const fields = [
      { name: "name", required: true, hidden: false },
      { name: "email", required: true, hidden: false },
      { name: "attendeePhoneNumber", required: true, hidden: false, verify: true },
    ];
    expect(isPhoneConfirmationEvent(fields)).toBe(true);
  });
});
