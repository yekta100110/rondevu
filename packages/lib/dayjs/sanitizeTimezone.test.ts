import { describe, expect, it } from "vitest";
import { DEFAULT_APP_TIMEZONE, sanitizeTimezone } from "./index";
import { timeZoneSchema } from "./timeZone.schema";

describe("sanitizeTimezone", () => {
  it("defaults to Europe/Istanbul when given empty or whitespace strings", () => {
    expect(sanitizeTimezone("")).toBe(DEFAULT_APP_TIMEZONE);
    expect(sanitizeTimezone("   ")).toBe(DEFAULT_APP_TIMEZONE);
  });

  it("defaults to Europe/Istanbul when given null or undefined", () => {
    expect(sanitizeTimezone(null)).toBe(DEFAULT_APP_TIMEZONE);
    expect(sanitizeTimezone(undefined)).toBe(DEFAULT_APP_TIMEZONE);
    expect(sanitizeTimezone("undefined")).toBe(DEFAULT_APP_TIMEZONE);
    expect(sanitizeTimezone("null")).toBe(DEFAULT_APP_TIMEZONE);
  });

  it("defaults to Europe/Istanbul when given completely invalid timezone strings", () => {
    expect(sanitizeTimezone("Invalid/Not_A_Real_Tz")).toBe(DEFAULT_APP_TIMEZONE);
    expect(sanitizeTimezone("foo-bar-123")).toBe(DEFAULT_APP_TIMEZONE);
  });

  it("handles +00:00 special case by returning UTC", () => {
    expect(sanitizeTimezone("+00:00")).toBe("UTC");
  });

  it("preserves valid IANA timezone strings", () => {
    expect(sanitizeTimezone("Europe/Istanbul")).toBe("Europe/Istanbul");
    expect(sanitizeTimezone("Europe/London")).toBe("Europe/London");
    expect(sanitizeTimezone("America/New_York")).toBe("America/New_York");
    expect(sanitizeTimezone("Asia/Tokyo")).toBe("Asia/Tokyo");
    expect(sanitizeTimezone("UTC")).toBe("UTC");
  });

  it("supports custom fallback parameter", () => {
    expect(sanitizeTimezone("", "UTC")).toBe("UTC");
    expect(sanitizeTimezone("invalid", "America/Chicago")).toBe("America/Chicago");
  });
});

describe("timeZoneSchema", () => {
  it("transforms empty or invalid timezone inputs to Europe/Istanbul safely", () => {
    expect(timeZoneSchema.parse("")).toBe(DEFAULT_APP_TIMEZONE);
    expect(timeZoneSchema.parse("invalid_tz")).toBe(DEFAULT_APP_TIMEZONE);
  });

  it("transforms +00:00 to UTC", () => {
    expect(timeZoneSchema.parse("+00:00")).toBe("UTC");
  });

  it("preserves valid timezones", () => {
    expect(timeZoneSchema.parse("Europe/Istanbul")).toBe("Europe/Istanbul");
    expect(timeZoneSchema.parse("Europe/Berlin")).toBe("Europe/Berlin");
    expect(timeZoneSchema.parse("America/Los_Angeles")).toBe("America/Los_Angeles");
  });
});
