import { createHmac } from "node:crypto";
import process from "node:process";
import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import { decryptReplayBody } from "@calcom/features/webhooks/lib/encryptReplayBody";
import { postWebhookSafely } from "@calcom/features/webhooks/lib/postWebhookSafely";
import { validateWebhookDestination } from "@calcom/features/webhooks/lib/validateWebhookDestination";
import { prisma } from "@calcom/prisma";
import { buildLegacyRequest } from "@lib/buildLegacyCtx";
import { isSameOriginRequest } from "@lib/server/isSameOriginRequest";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

async function isAdmin() {
  const session = await getServerSession({ req: buildLegacyRequest(await headers(), await cookies()) });
  return session?.user.role === "ADMIN";
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const deliveries = await prisma.webhookDelivery.findMany({
    where: { webhook: { platform: true } },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      eventId: true,
      status: true,
      attempts: true,
      lastHttpCode: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return NextResponse.json({ deliveries }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request) || !(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const parsed = z.object({ id: z.string().uuid() }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const delivery = await prisma.webhookDelivery.findUnique({
    where: { id: parsed.data.id },
    select: {
      id: true,
      eventId: true,
      status: true,
      bodyEncrypted: true,
      webhook: { select: { platform: true, active: true, subscriberUrl: true, secret: true, version: true } },
    },
  });
  if (
    !delivery?.webhook.platform ||
    !delivery.webhook.active ||
    !delivery.bodyEncrypted ||
    !delivery.webhook.secret ||
    process.env.RONDEVU_PLATFORM_WEBHOOK_ENABLE !== "1" ||
    !process.env.RONDEVU_N8N_INGRESS_KEY ||
    !(await validateWebhookDestination(delivery.webhook.subscriberUrl, true))
  ) {
    return NextResponse.json({ error: "Delivery unavailable" }, { status: 400 });
  }
  const claimed = await prisma.webhookDelivery.updateMany({
    where: {
      id: delivery.id,
      OR: [
        { status: "FAILED" },
        { status: "PROCESSING", updatedAt: { lt: new Date(Date.now() - 15 * 60 * 1000) } },
      ],
    },
    data: { status: "PROCESSING" },
  });
  if (!claimed.count) return NextResponse.json({ error: "Delivery is not retryable" }, { status: 409 });

  let status = 0;
  try {
    const original = JSON.parse(decryptReplayBody(delivery.bodyEncrypted)) as Record<string, unknown>;
    const sentAt = new Date().toISOString();
    const body = JSON.stringify({ ...original, createdAt: sentAt });
    status = await postWebhookSafely({
      url: delivery.webhook.subscriberUrl,
      body,
      platform: true,
      headers: {
        "Content-Type": "application/json",
        "X-Cal-Signature-256": createHmac("sha256", delivery.webhook.secret).update(body).digest("hex"),
        "X-Cal-Webhook-Version": delivery.webhook.version,
        "X-Rondevu-Event-Id": delivery.eventId,
        "X-Rondevu-Timestamp": sentAt,
        "X-Rondevu-Ingress-Key": process.env.RONDEVU_N8N_INGRESS_KEY,
      },
    });
  } catch {
    status = 0;
  }
  const success = status >= 200 && status < 300;
  await prisma.webhookDelivery.update({
    where: { id: delivery.id },
    data: {
      status: success ? "SUCCESS" : "FAILED",
      attempts: { increment: 1 },
      lastHttpCode: status || null,
      bodyEncrypted: success ? null : delivery.bodyEncrypted,
    },
  });
  return NextResponse.json({ ok: success, status }, { status: success ? 200 : 502 });
}
