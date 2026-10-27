import { afterEach, describe, expect, it, vi } from "vitest";
import { validateWebhookDestination } from "./validateWebhookDestination";

afterEach(() => vi.unstubAllEnvs());

describe("validateWebhookDestination", () => {
  it("rejects private and loopback destinations for personal webhooks", async () => {
    expect(await validateWebhookDestination("http://127.0.0.1:5678/webhook/test")).toBe(false);
    expect(await validateWebhookDestination("https://10.0.0.4/webhook/test")).toBe(false);
    expect(await validateWebhookDestination("https://localhost/webhook/test")).toBe(false);
    expect(await validateWebhookDestination("https://user:pass@example.com/webhook/test")).toBe(false);
  });

  it("accepts only the configured platform URL", async () => {
    vi.stubEnv("PLATFORM_N8N_WEBHOOK_URL", "http://n8n:5678/webhook/rondevu");
    vi.stubEnv("PLATFORM_N8N_ALLOW_PRIVATE_HTTP", "1");
    expect(await validateWebhookDestination("http://n8n:5678/webhook/rondevu", true)).toBe(true);
    expect(await validateWebhookDestination("http://n8n:5678/webhook/other", true)).toBe(false);
    expect(await validateWebhookDestination("http://n8n:5678/webhook/rondevu#fragment", true)).toBe(false);
    expect(await validateWebhookDestination("http://n8n:5678/webhook/rondevu", false)).toBe(false);
  });
});
