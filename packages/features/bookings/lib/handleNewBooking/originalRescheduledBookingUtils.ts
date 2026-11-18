import { BookingRepository } from "@rondevu/features/bookings/repositories/BookingRepository";
import { ErrorCode } from "@rondevu/lib/errorCodes";
import { HttpError } from "@rondevu/lib/http-error";
import prisma from "@rondevu/prisma";
import { BookingStatus } from "@rondevu/prisma/enums";

// TODO: Inject.
export async function getOriginalRescheduledBooking(uid: string, seatsEventType?: boolean) {
  const bookingRepo = new BookingRepository(prisma);
  const originalBooking = await bookingRepo.findOriginalRescheduledBooking(uid, seatsEventType);

  if (!originalBooking) {
    throw new HttpError({ statusCode: 404, message: "Could not find original booking" });
  }

  if (originalBooking.status === BookingStatus.CANCELLED && !originalBooking.rescheduled) {
    throw new HttpError({ statusCode: 400, message: ErrorCode.CancelledBookingsCannotBeRescheduled });
  }

  return originalBooking;
}

export type BookingType = Awaited<ReturnType<typeof getOriginalRescheduledBooking>> | null;
export type OriginalRescheduledBooking = Awaited<ReturnType<typeof getOriginalRescheduledBooking>> | null;
