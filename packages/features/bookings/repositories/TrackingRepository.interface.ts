import type { Tracking } from "@rondevu/prisma/client";

export interface TrackingRepositoryInterface {
  findByBookingUid(bookingUid: string): Promise<Tracking | null>;
}
