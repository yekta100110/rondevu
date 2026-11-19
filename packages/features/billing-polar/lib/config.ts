import process from "node:process";
import type { BillingPlanKey, PolarBillingConfig } from "./types";

const emptyToNull = (value: string | undefined) => (value && value.trim() !== "" ? value.trim() : null);

export function readPolarBillingConfig(env: NodeJS.ProcessEnv = process.env): PolarBillingConfig {
  return {
    accessToken: emptyToNull(env.POLAR_ACCESS_TOKEN),
    webhookSecret: emptyToNull(env.POLAR_WEBHOOK_SECRET),
    // Defaulting to sandbox keeps a half-configured environment from charging real cards.
    server: env.POLAR_SERVER === "production" ? "production" : "sandbox",
    products: {
      MONTHLY: emptyToNull(env.POLAR_PRODUCT_MONTHLY),
      YEARLY: emptyToNull(env.POLAR_PRODUCT_YEARLY),
    },
  };
}

export function planForProduct(config: PolarBillingConfig, productId: string): BillingPlanKey | null {
  if (productId === config.products.MONTHLY) return "MONTHLY";
  if (productId === config.products.YEARLY) return "YEARLY";
  return null;
}
