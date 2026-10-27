import { afterEach, describe, expect, it, vi } from "vitest";
import { decryptReplayBody, encryptReplayBody } from "./encryptReplayBody";

afterEach(() => vi.unstubAllEnvs());

describe("encrypted platform replay body", () => {
  it("round-trips and detects tampering", () => {
    vi.stubEnv("RONDEVU_WEBHOOK_REPLAY_KEY", Buffer.alloc(32, 7).toString("base64"));
    const encrypted = encryptReplayBody('{"bookingUid":"private"}');
    expect(encrypted).not.toContain("private");
    expect(decryptReplayBody(encrypted)).toBe('{"bookingUid":"private"}');
    const tampered = Buffer.from(encrypted, "base64");
    tampered[tampered.length - 1] ^= 1;
    expect(() => decryptReplayBody(tampered.toString("base64"))).toThrow();
  });
});
