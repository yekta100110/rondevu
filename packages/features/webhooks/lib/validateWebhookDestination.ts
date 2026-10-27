import dns from "node:dns/promises";
import process from "node:process";
import { isBlockedHostname, isPrivateIP } from "@calcom/lib/ssrfProtection";
import ipaddr from "ipaddr.js";

export async function validateWebhookDestination(urlString: string, platform = false): Promise<boolean> {
  let url: URL;
  try {
    url = new URL(urlString);
  } catch {
    return false;
  }
  if (url.username || url.password || url.hash || isBlockedHostname(url.hostname)) return false;
  if (platform) {
    if (!process.env.PLATFORM_N8N_WEBHOOK_URL || process.env.PLATFORM_N8N_WEBHOOK_URL !== urlString) {
      return false;
    }
    return (
      url.protocol === "https:" ||
      (url.protocol === "http:" && process.env.PLATFORM_N8N_ALLOW_PRIVATE_HTTP === "1")
    );
  }
  if (url.protocol !== "https:") {
    return false;
  }
  const hostname = url.hostname.replace(/^\[|\]$/g, "");
  if (ipaddr.isValid(hostname)) return !isPrivateIP(hostname);
  try {
    const addresses = await dns.lookup(hostname, { all: true });
    return addresses.length > 0 && addresses.every(({ address }) => !isPrivateIP(address));
  } catch {
    return false;
  }
}
