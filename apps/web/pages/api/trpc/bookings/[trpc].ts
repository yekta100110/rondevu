import { createNextApiHandler } from "@rondevu/trpc/server/createNextApiHandler";
import { bookingsRouter } from "@rondevu/trpc/server/routers/viewer/bookings/_router";

export default createNextApiHandler(bookingsRouter);
