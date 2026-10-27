import { timingSafeEqual } from "node:crypto";
import process from "node:process";
import { prisma } from "@calcom/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: Request) {
  const expected = process.env.RONDEVU_N8N_ELIGIBILITY_TOKEN;
  const received = request.headers.get("authorization")?.replace(/^Bearer /, "");
  if (
    !expected ||
    !received ||
    Buffer.byteLength(expected) !== Buffer.byteLength(received) ||
    !timingSafeEqual(Buffer.from(expected), Buffer.from(received))
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const parsed = z
    .object({ phoneNumber: z.string().regex(/^\+[1-9]\d{7,14}$/) })
    .safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const now = new Date();
  await prisma.$transaction([
    prisma.whatsAppPreference.updateMany({
      where: { phoneNumber: parsed.data.phoneNumber },
      data: { revokedAt: now },
    }),
    prisma.whatsAppBookingConsent.updateMany({
      where: { phoneNumber: parsed.data.phoneNumber },
      data: { revokedAt: now },
    }),
  ]);
  return NextResponse.json({ revoked: true });
}
