import dns from "node:dns/promises";
import http from "node:http";
import https from "node:https";
import { isPrivateIP } from "@calcom/lib/ssrfProtection";
import ipaddr from "ipaddr.js";
import { validateWebhookDestination } from "./validateWebhookDestination";

export async function postWebhookSafely({
  url,
  body,
  headers,
  platform = false,
}: {
  url: string;
  body: string;
  headers: Record<string, string>;
  platform?: boolean;
}): Promise<number> {
  if (!(await validateWebhookDestination(url, platform)))
    throw new Error("Webhook destination is not allowed");
  const target = new URL(url);
  const hostname = target.hostname.replace(/^\[|\]$/g, "");
  let pinned: { address: string; family: 4 | 6 } | undefined;
  if (!platform) {
    const addresses = ipaddr.isValid(hostname)
      ? [{ address: hostname, family: ipaddr.parse(hostname).kind() === "ipv4" ? 4 : 6 }]
      : await dns.lookup(hostname, { all: true });
    if (!addresses.length || addresses.some(({ address }) => isPrivateIP(address))) {
      throw new Error("Webhook destination is not allowed");
    }
    pinned = addresses[0] as { address: string; family: 4 | 6 };
  }
  const transport = target.protocol === "https:" ? https : http;
  return new Promise<number>((resolve, reject) => {
    const pinnedAddress = pinned;
    const request = transport.request(
      target,
      {
        method: "POST",
        headers: { ...headers, "Content-Length": Buffer.byteLength(body).toString() },
        timeout: 10000,
        ...(pinnedAddress
          ? {
              lookup: (
                _hostname: string,
                _options: unknown,
                callback: (error: null, address: string, family: number) => void
              ) => callback(null, pinnedAddress.address, pinnedAddress.family),
            }
          : {}),
      },
      (response) => {
        response.resume();
        response.on("end", () => resolve(response.statusCode ?? 0));
      }
    );
    const deadline = setTimeout(() => request.destroy(new Error("Webhook timeout")), 10000);
    request.on("close", () => clearTimeout(deadline));
    request.on("timeout", () => request.destroy(new Error("Webhook timeout")));
    request.on("error", reject);
    request.end(body);
  });
}
