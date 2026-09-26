import { describe, expect, test, beforeEach, afterEach } from "vitest";
import { rateLimiter } from "./rateLimit";

describe("rateLimiter in-memory fallback", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.UNKEY_ROOT_KEY;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  test("should allow requests within limit and throttle when exceeded", async () => {
    const limiter = rateLimiter();
    const testIdentifier = `test-user-${Date.now()}`;

    // 'sms' limit is 10
    for (let i = 0; i < 10; i++) {
      const res = await limiter({
        rateLimitingType: "sms",
        identifier: testIdentifier,
      });
      expect(res.success).toBe(true);
      expect(res.remaining).toBe(9 - i);
    }

    // 11th request should be throttled
    const blockedRes = await limiter({
      rateLimitingType: "sms",
      identifier: testIdentifier,
    });
    expect(blockedRes.success).toBe(false);
    expect(blockedRes.remaining).toBe(0);
  });
});
