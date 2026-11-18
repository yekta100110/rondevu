import process from "node:process";
import { getServerSession } from "@rondevu/features/auth/lib/getServerSession";
import { getRegularBookingService } from "@rondevu/features/bookings/di/RegularBookingService.container";
import { BotDetectionService } from "@rondevu/features/bot-detection";
import { EventTypeRepository } from "@rondevu/features/eventtypes/repositories/eventTypeRepository";
import { FeaturesRepository } from "@rondevu/features/flags/features.repository";
import { checkRateLimitAndThrowError } from "@rondevu/lib/checkRateLimitAndThrowError";
import getIP from "@rondevu/lib/getIP";
import { checkCfTurnstileToken } from "@rondevu/lib/server/checkCfTurnstileToken";
import { defaultResponder } from "@rondevu/lib/server/defaultResponder";
import { piiHasher } from "@rondevu/lib/server/PiiHasher";
import type { TraceContext } from "@rondevu/lib/tracing";
import { prisma } from "@rondevu/prisma";
import { CreationSource } from "@rondevu/prisma/enums";
import type { NextApiRequest } from "next";

async function handler(req: NextApiRequest & { userId?: number; traceContext: TraceContext }) {
  const userIp = getIP(req);

  if (process.env.NEXT_PUBLIC_CLOUDFLARE_USE_TURNSTILE_IN_BOOKER === "1") {
    await checkCfTurnstileToken({
      token: req.body["cfToken"] as string,
      remoteIp: userIp,
    });
  }

  // Check for bot detection using feature flag
  const featuresRepository = new FeaturesRepository(prisma);
  const eventTypeRepository = new EventTypeRepository(prisma);
  const botDetectionService = new BotDetectionService(featuresRepository, eventTypeRepository);

  await botDetectionService.checkBotDetection({
    eventTypeId: req.body.eventTypeId,
    headers: req.headers,
  });

  await checkRateLimitAndThrowError({
    rateLimitingType: "core",
    identifier: `createBooking:${piiHasher.hash(userIp)}`,
  });

  const session = await getServerSession({ req });
  /* To mimic API behavior and comply with types */
  req.body = {
    ...req.body,
    creationSource: CreationSource.WEBAPP,
  };

  const regularBookingService = getRegularBookingService();
  const booking = await regularBookingService.createBooking({
    bookingData: req.body,
    bookingMeta: {
      userId: session?.user?.id || -1,
      hostname: req.headers.host || "",
      forcedSlug: req.headers["x-rondevu-force-slug"] as string | undefined,
      traceContext: req.traceContext,
    },
  });

  return booking;
}

export default defaultResponder(handler, "/api/book/event");
