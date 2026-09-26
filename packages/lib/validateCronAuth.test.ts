import { describe, expect, test, beforeEach, afterEach, vi } from "vitest";
import { validateCronAuth } from "./validateCronAuth";

describe("validateCronAuth", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.CRON_SECRET;
    delete process.env.CRON_API_KEY;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  test("should reject when neither CRON_SECRET nor CRON_API_KEY is configured", () => {
    const request = {
      headers: {
        get: (name: string) => (name.toLowerCase() === "authorization" ? "Bearer undefined" : null),
      },
    };
    expect(validateCronAuth(request)).toBe(false);
  });

  test("should reject Bearer undefined when CRON_SECRET is not configured", () => {
    process.env.CRON_API_KEY = "valid-api-key";
    const request = {
      headers: {
        get: (name: string) => (name.toLowerCase() === "authorization" ? "Bearer undefined" : null),
      },
    };
    expect(validateCronAuth(request)).toBe(false);
  });

  test("should accept valid CRON_SECRET as Bearer token", () => {
    process.env.CRON_SECRET = "super-secret-cron-token";
    const request = {
      headers: {
        get: (name: string) =>
          name.toLowerCase() === "authorization" ? "Bearer super-secret-cron-token" : null,
      },
    };
    expect(validateCronAuth(request)).toBe(true);
  });

  test("should reject invalid Bearer token", () => {
    process.env.CRON_SECRET = "super-secret-cron-token";
    const request = {
      headers: {
        get: (name: string) => (name.toLowerCase() === "authorization" ? "Bearer wrong-token" : null),
      },
    };
    expect(validateCronAuth(request)).toBe(false);
  });

  test("should accept valid CRON_API_KEY in authorization header", () => {
    process.env.CRON_API_KEY = "my-cron-api-key";
    const request = {
      headers: {
        get: (name: string) => (name.toLowerCase() === "authorization" ? "my-cron-api-key" : null),
      },
    };
    expect(validateCronAuth(request)).toBe(true);
  });

  test("should accept valid CRON_API_KEY in query params", () => {
    process.env.CRON_API_KEY = "my-cron-api-key";
    const request = {
      headers: {
        get: () => null,
      },
      nextUrl: {
        searchParams: {
          get: (name: string) => (name === "apiKey" ? "my-cron-api-key" : null),
        },
      },
    };
    expect(validateCronAuth(request)).toBe(true);
  });
});
