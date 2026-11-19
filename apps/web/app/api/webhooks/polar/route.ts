import { getPolarWebhookService } from "@rondevu/features/billing-polar/di/PolarWebhookService.container";
import logger from "@rondevu/lib/logger";
import { NextResponse } from "next/server";

const log = logger.getSubLogger({ prefix: ["[api/webhooks/polar]"] });

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  // The signature covers the exact bytes Polar sent, so the body must not be parsed before verification.
  const body = await request.text();
  const headers = {
    "webhook-id": request.headers.get("webhook-id") ?? "",
    "webhook-timestamp": request.headers.get("webhook-timestamp") ?? "",
    "webhook-signature": request.headers.get("webhook-signature") ?? "",
  };

  try {
    const result = await getPolarWebhookService().handle(body, headers);
    return NextResponse.json(
      { received: result.status === 202, outcome: result.outcome },
      { status: result.status }
    );
  } catch (error) {
    // A 5xx makes Polar retry the delivery; the event is only recorded as processed after success.
    log.error("Polar webhook processing failed", error instanceof Error ? error.message : String(error));
    return NextResponse.json({ received: false }, { status: 500 });
  }
}
