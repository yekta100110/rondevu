import crypto from "node:crypto";
import process from "node:process";

function safeCompare(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export interface CronAuthRequestLike {
  headers: {
    get: (name: string) => string | null;
  };
  nextUrl?: {
    searchParams: {
      get: (name: string) => string | null;
    };
  };
  url?: string;
}

/**
 * Validates incoming cron requests with timing-safe comparison.
 * Requires either CRON_SECRET or CRON_API_KEY to be set in environment variables.
 * If neither is configured, all requests are strictly rejected.
 */
export function validateCronAuth(request: CronAuthRequestLike): boolean {
  const cronSecret = process.env.CRON_SECRET?.trim();
  const cronApiKey = process.env.CRON_API_KEY?.trim();

  // If neither secret is configured in the environment, reject all requests.
  if (!cronSecret && !cronApiKey) {
    return false;
  }

  const authHeader = request.headers.get("authorization") || "";

  let queryApiKey: string | null = null;
  if ("nextUrl" in request && request.nextUrl?.searchParams) {
    queryApiKey = request.nextUrl.searchParams.get("apiKey");
  } else if ("url" in request && typeof request.url === "string") {
    try {
      const url = new URL(request.url);
      queryApiKey = url.searchParams.get("apiKey");
    } catch {
      // ignore parsing error
    }
  }

  // 1. Validate Bearer token against CRON_SECRET
  if (cronSecret && safeCompare(authHeader, `Bearer ${cronSecret}`)) {
    return true;
  }

  // 2. Validate Authorization header or query param against CRON_API_KEY
  if (cronApiKey) {
    if (safeCompare(authHeader, cronApiKey) || (queryApiKey && safeCompare(queryApiKey, cronApiKey))) {
      return true;
    }
  }

  return false;
}
