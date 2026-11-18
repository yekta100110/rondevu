import process from "node:process";
import { BookingRepository } from "@rondevu/features/bookings/repositories/BookingRepository";
import { DefaultAdapterFactory } from "@rondevu/features/calendar-subscription/adapters/AdaptersFactory";
import { CalendarSubscriptionService } from "@rondevu/features/calendar-subscription/lib/CalendarSubscriptionService";
import { CalendarCacheEventRepository } from "@rondevu/features/calendar-subscription/lib/cache/CalendarCacheEventRepository";
import { CalendarCacheEventService } from "@rondevu/features/calendar-subscription/lib/cache/CalendarCacheEventService";
import { CalendarSyncService } from "@rondevu/features/calendar-subscription/lib/sync/CalendarSyncService";
import { getFeatureRepository } from "@rondevu/features/di/containers/FeatureRepository";
import { getTeamFeatureRepository } from "@rondevu/features/di/containers/TeamFeatureRepository";
import { getUserFeatureRepository } from "@rondevu/features/di/containers/UserFeatureRepository";
import { SelectedCalendarRepository } from "@rondevu/features/selectedCalendar/repositories/SelectedCalendarRepository";
import { prisma } from "@rondevu/prisma";
import { defaultResponderForAppDir } from "@rondevu/web/app/api/defaultResponderForAppDir";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { validateCronAuth } from "@rondevu/lib/validateCronAuth";

/**
 * Cron webhook
 * Checks for new calendar subscriptions (rollouts)
 *
 * @param request
 * @returns
 */
async function getHandler(request: NextRequest) {
  if (!validateCronAuth(request)) {
    return NextResponse.json({ message: "Forbiden" }, { status: 403 });
  }

  // instantiate dependencies
  const bookingRepository = new BookingRepository(prisma);
  const calendarSyncService = new CalendarSyncService({
    bookingRepository,
  });
  const calendarCacheEventRepository = new CalendarCacheEventRepository(prisma);
  const calendarCacheEventService = new CalendarCacheEventService({
    calendarCacheEventRepository,
  });

  const calendarSubscriptionService = new CalendarSubscriptionService({
    adapterFactory: new DefaultAdapterFactory(),
    selectedCalendarRepository: new SelectedCalendarRepository(prisma),
    featureRepository: getFeatureRepository(),
    teamFeatureRepository: getTeamFeatureRepository(),
    userFeatureRepository: getUserFeatureRepository(),
    calendarSyncService,
    calendarCacheEventService,
  });

  // are features globally enabled
  const [isCacheEnabled, isSyncEnabled] = await Promise.all([
    calendarSubscriptionService.isCacheEnabled(),
    calendarSubscriptionService.isSyncEnabled(),
  ]);

  if (!isCacheEnabled && !isSyncEnabled) {
    return NextResponse.json({ ok: true });
  }

  try {
    await calendarSubscriptionService.checkForNewSubscriptions();
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export const GET = defaultResponderForAppDir(getHandler);
