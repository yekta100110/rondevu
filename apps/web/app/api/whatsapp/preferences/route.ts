import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import { prisma } from "@calcom/prisma";
import { buildLegacyRequest } from "@lib/buildLegacyCtx";
import { isSameOriginRequest } from "@lib/server/isSameOriginRequest";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

const noticeVersion = "whatsapp-booking-v1";
const preferenceSchema = z.discriminatedUnion("enabled", [
  z.object({ enabled: z.literal(true), phoneNumber: z.string().regex(/^\+[1-9]\d{7,14}$/) }),
  z.object({ enabled: z.literal(false) }),
]);

async function currentUserId() {
  const session = await getServerSession({ req: buildLegacyRequest(await headers(), await cookies()) });
  return session?.user.id;
}

export async function GET() {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const preference = await prisma.whatsAppPreference.findUnique({
    where: { userId },
    select: { phoneNumber: true, optedInAt: true, revokedAt: true },
  });
  return NextResponse.json({
    enabled: Boolean(preference?.optedInAt && !preference.revokedAt),
    phoneNumber: preference?.phoneNumber ?? "",
  });
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = preferenceSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid preference" }, { status: 400 });
  const existing = await prisma.whatsAppPreference.findUnique({
    where: { userId },
    select: { phoneNumber: true },
  });
  if (!parsed.data.enabled && !existing) return NextResponse.json({ enabled: false });
  await prisma.whatsAppPreference.upsert({
    where: { userId },
    create: {
      userId,
      phoneNumber: parsed.data.enabled ? parsed.data.phoneNumber : (existing?.phoneNumber ?? ""),
      optedInAt: parsed.data.enabled ? new Date() : null,
      noticeVersion: parsed.data.enabled ? noticeVersion : null,
      revokedAt: parsed.data.enabled ? null : new Date(),
    },
    update: parsed.data.enabled
      ? { phoneNumber: parsed.data.phoneNumber, optedInAt: new Date(), noticeVersion, revokedAt: null }
      : { revokedAt: new Date() },
  });
  return NextResponse.json({ enabled: parsed.data.enabled });
}
