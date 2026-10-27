import { timingSafeEqual } from "node:crypto";
import process from "node:process";
import { prisma } from "@calcom/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const inputSchema = z.object({
  bookingUid: z.string().min(1).max(255),
  triggerEvent: z.enum(["BOOKING_CREATED", "BOOKING_REQUESTED", "BOOKING_CANCELLED", "BOOKING_RESCHEDULED"]),
});

function authorized(request: Request) {
  const expected = process.env.RONDEVU_N8N_ELIGIBILITY_TOKEN;
  const received = request.headers.get("authorization")?.replace(/^Bearer /, "");
  if (!expected || !received) return false;
  const expectedBytes = Buffer.from(expected);
  const receivedBytes = Buffer.from(received);
  return expectedBytes.length === receivedBytes.length && timingSafeEqual(expectedBytes, receivedBytes);
}

export async function POST(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = inputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const booking = await prisma.booking.findUnique({
    where: { uid: parsed.data.bookingUid },
    select: {
      uid: true,
      title: true,
      startTime: true,
      endTime: true,
      status: true,
      user: {
        select: {
          name: true,
          whatsappPreference: {
            select: { phoneNumber: true, optedInAt: true, revokedAt: true, noticeVersion: true },
          },
        },
      },
      attendees: {
        select: { name: true, phoneNumber: true },
      },
      whatsappConsent: {
        select: { phoneNumber: true, optedInAt: true, revokedAt: true, noticeVersion: true },
      },
    },
  });
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const recipients: { role: "host" | "guest"; phoneNumber: string; name: string }[] = [];
  const host = booking.user?.whatsappPreference;
  if (
    host?.phoneNumber &&
    host.optedInAt &&
    !host.revokedAt &&
    host.noticeVersion === "whatsapp-booking-v1"
  ) {
    recipients.push({ role: "host", phoneNumber: host.phoneNumber, name: booking.user?.name ?? "" });
  }
  const guest = booking.whatsappConsent;
  if (
    guest?.phoneNumber &&
    guest.optedInAt &&
    !guest.revokedAt &&
    guest.noticeVersion === "whatsapp-booking-v1" &&
    !recipients.some((recipient) => recipient.phoneNumber === guest.phoneNumber)
  ) {
    const attendee =
      booking.attendees.find((item) => item.phoneNumber === guest.phoneNumber) ?? booking.attendees[0];
    recipients.push({ role: "guest", phoneNumber: guest.phoneNumber, name: attendee?.name ?? "" });
  }
  return NextResponse.json(
    {
      bookingUid: booking.uid,
      triggerEvent: parsed.data.triggerEvent,
      title: booking.title,
      startTime: booking.startTime,
      endTime: booking.endTime,
      status: booking.status,
      recipients,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
