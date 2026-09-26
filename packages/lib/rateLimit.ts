import process from "node:process";
import { type LimitOptions, Ratelimit, type RatelimitResponse } from "@unkey/ratelimit";
import { isIpInBanListString } from "./getIP";
import logger from "./logger";

const log = logger.getSubLogger({ prefix: ["RateLimit"] });

export type { RatelimitResponse };

export type RateLimitHelper = {
  rateLimitingType?:
    | "core"
    | "forcedSlowMode"
    | "common"
    | "api"
    | "ai"
    | "sms"
    | "smsMonth"
    | "instantMeeting";
  identifier: string;
  opts?: LimitOptions;
  /**
   * Using a callback instead of a regular return to provide headers even
   * when the rate limit is reached and an error is thrown.
   **/
  onRateLimiterResponse?: (response: RatelimitResponse) => void;
};

export const API_KEY_RATE_LIMIT = 30;

interface FallbackLimitConfig {
  limit: number;
  windowMs: number;
}

const FALLBACK_CONFIGS: Record<string, FallbackLimitConfig> = {
  core: { limit: 10, windowMs: 60 * 1000 },
  instantMeeting: { limit: 1, windowMs: 10 * 60 * 1000 },
  common: { limit: 200, windowMs: 60 * 1000 },
  forcedSlowMode: { limit: 1, windowMs: 30 * 1000 },
  api: { limit: API_KEY_RATE_LIMIT, windowMs: 60 * 1000 },
  ai: { limit: 20, windowMs: 24 * 60 * 60 * 1000 },
  sms: { limit: 10, windowMs: 60 * 1000 },
  smsMonth: { limit: 250, windowMs: 30 * 24 * 60 * 60 * 1000 },
};

interface MemoryRateLimitRecord {
  timestamps: number[];
}

const memoryRateLimitStore = new Map<string, MemoryRateLimitRecord>();
const MAX_MEMORY_STORE_SIZE = 10000;

function cleanupMemoryRateLimitStore(now: number): void {
  if (memoryRateLimitStore.size < MAX_MEMORY_STORE_SIZE) return;
  memoryRateLimitStore.forEach((record, key) => {
    record.timestamps = record.timestamps.filter((ts: number) => now - ts < 3600 * 1000);
    if (record.timestamps.length === 0) {
      memoryRateLimitStore.delete(key);
    }
  });
}

function memoryRateLimiter({ rateLimitingType = "core", identifier }: RateLimitHelper): RatelimitResponse {
  const now = Date.now();
  cleanupMemoryRateLimitStore(now);

  const effectiveType = isIpInBanListString(identifier) ? "forcedSlowMode" : rateLimitingType;
  const config = FALLBACK_CONFIGS[effectiveType] || { limit: 10, windowMs: 60 * 1000 };
  const key = `${effectiveType}:${identifier}`;
  const record = memoryRateLimitStore.get(key) || { timestamps: [] };

  record.timestamps = record.timestamps.filter((ts) => now - ts < config.windowMs);

  const reset = (record.timestamps[0] || now) + config.windowMs;

  if (record.timestamps.length >= config.limit) {
    return {
      success: false,
      limit: config.limit,
      remaining: 0,
      reset,
    };
  }

  record.timestamps.push(now);
  memoryRateLimitStore.set(key, record);

  return {
    success: true,
    limit: config.limit,
    remaining: config.limit - record.timestamps.length,
    reset,
  };
}

let warned = false;

export function rateLimiter() {
  const { UNKEY_ROOT_KEY } = process.env;

  if (!UNKEY_ROOT_KEY) {
    if (!warned) {
      log.info("UNKEY_ROOT_KEY not found. Using built-in in-memory fallback rate limiter.");
      warned = true;
    }
    return async (helper: RateLimitHelper) => memoryRateLimiter(helper);
  }
  const timeout = {
    fallback: { success: true, limit: 10, remaining: 999, reset: 0 },
    ms: 5000,
  };

  const onError = (err: Error, identifier: string) => {
    log.error("Unkey rate limiter encountered unknown error", {
      error: err.message,
      stack: err.stack,
      identifier,
      timestamp: new Date().toISOString(),
    });
    return { success: true, limit: 10, remaining: 999, reset: 0 };
  };

  const limiter = {
    core: new Ratelimit({
      rootKey: UNKEY_ROOT_KEY,
      namespace: "core",
      limit: 10,
      duration: "60s",
      timeout,
      onError,
    }),
    instantMeeting: new Ratelimit({
      rootKey: UNKEY_ROOT_KEY,
      namespace: "instantMeeting",
      limit: 1,
      duration: "10m",
      timeout,
      onError,
    }),
    common: new Ratelimit({
      rootKey: UNKEY_ROOT_KEY,
      namespace: "common",
      limit: 200,
      duration: "60s",
      timeout,
      onError,
    }),
    forcedSlowMode: new Ratelimit({
      rootKey: UNKEY_ROOT_KEY,
      namespace: "forcedSlowMode",
      limit: 1,
      duration: "30s",
      timeout,
      onError,
    }),
    api: new Ratelimit({
      rootKey: UNKEY_ROOT_KEY,
      namespace: "api",
      limit: API_KEY_RATE_LIMIT,
      duration: "60s",
      timeout,
      onError,
    }),
    ai: new Ratelimit({
      rootKey: UNKEY_ROOT_KEY,
      namespace: "ai",
      limit: 20,
      duration: "1d",
      timeout,
      onError,
    }),
    sms: new Ratelimit({
      rootKey: UNKEY_ROOT_KEY,
      namespace: "sms",
      limit: 50,
      duration: "5m",
      timeout,
      onError,
    }),
    smsMonth: new Ratelimit({
      rootKey: UNKEY_ROOT_KEY,
      namespace: "smsMonth",
      limit: 250,
      duration: "30d",
      timeout,
      onError,
    }),
  };

  async function rateLimit({ rateLimitingType = "core", identifier, opts }: RateLimitHelper) {
    if (isIpInBanListString(identifier)) {
      return await limiter.forcedSlowMode.limit(identifier, opts);
    }

    return await limiter[rateLimitingType].limit(identifier, opts);
  }

  return rateLimit;
}
