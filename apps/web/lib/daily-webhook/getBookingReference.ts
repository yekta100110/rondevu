import { BookingReferenceRepository } from "@rondevu/features/bookingReference/repositories/BookingReferenceRepository";
import { HttpError } from "@rondevu/lib/http-error";
import logger from "@rondevu/lib/logger";
import { safeStringify } from "@rondevu/lib/safeStringify";

const log = logger.getSubLogger({ prefix: ["daily-video-webhook-handler"] });

export const getBookingReference = async (roomName: string) => {
  const bookingReference = await BookingReferenceRepository.findDailyVideoReferenceByRoomName({ roomName });

  if (!bookingReference || !bookingReference.bookingId) {
    log.error(
      "bookingReference not found error:",
      safeStringify({
        bookingReference,
        roomName,
      })
    );

    throw new HttpError({ message: "Booking reference not found", statusCode: 200 });
  }

  return bookingReference;
};
