import { createNextApiHandler } from "@rondevu/trpc/server/createNextApiHandler";
import { timezonesRouter } from "@rondevu/trpc/server/routers/publicViewer/timezones/_router";

export default createNextApiHandler(timezonesRouter, true);
