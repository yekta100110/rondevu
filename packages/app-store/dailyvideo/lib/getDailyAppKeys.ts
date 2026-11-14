import { z } from "zod";

import getAppKeysFromSlug from "../../_utils/getAppKeysFromSlug";

const dailyAppKeysSchema = z.object({
  api_key: z.string(),
  scale_plan: z.string().default("false"),
});

export const getDailyAppKeys = async () => {
  let appKeys: Record<string, unknown> = {};
  try {
    appKeys = await getAppKeysFromSlug("daily-video");
  } catch {
    // Fallback to environment variables if DB lookup fails
  }

  const parsed = dailyAppKeysSchema.safeParse(appKeys);
  if (parsed.success && parsed.data.api_key) {
    return parsed.data;
  }

  if (process.env.DAILY_API_KEY) {
    return dailyAppKeysSchema.parse({
      api_key: process.env.DAILY_API_KEY,
      ...(process.env.DAILY_SCALE_PLAN ? { scale_plan: process.env.DAILY_SCALE_PLAN } : {}),
    });
  }

  return dailyAppKeysSchema.parse(appKeys);
};
