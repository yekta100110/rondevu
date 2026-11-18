import dayjs from "@rondevu/dayjs";
import { useBookerStoreContext } from "@rondevu/features/bookings/Booker/BookerStoreProvider";
import { useOverlayCalendarStore } from "@rondevu/features/bookings/Booker/components/OverlayCalendar/store";
import { useAvailableTimeSlots } from "@rondevu/features/bookings/Booker/hooks/useAvailableTimeSlots";
import { useBookerTime } from "@rondevu/features/bookings/Booker/hooks/useBookerTime";
import { getQueryParam } from "@rondevu/features/bookings/Booker/utils/query-param";
import type { BookerEvent } from "@rondevu/features/bookings/types";
import type { CalendarEvent } from "@rondevu/features/calendars/weeklyview/types/events";
import { useLocale } from "@rondevu/lib/hooks/useLocale";
import { localStorage } from "@rondevu/lib/webstorage";
import { Calendar } from "@rondevu/web/modules/calendars/weeklyview/components/Calendar";
import type { useScheduleForEventReturnType } from "@rondevu/web/modules/schedules/hooks/useEvent";
import { useEffect, useMemo } from "react";

export const LargeCalendar = ({
  extraDays,
  schedule,
  isLoading,
  event,
}: {
  extraDays: number;
  schedule?: useScheduleForEventReturnType["data"];
  isLoading: boolean;
  event: {
    data?: Pick<BookerEvent, "length"> | null;
  };
}) => {
  const { t } = useLocale();
  const selectedDate = useBookerStoreContext((state) => state.selectedDate);
  const setSelectedTimeslot = useBookerStoreContext((state) => state.setSelectedTimeslot);
  const selectedEventDuration = useBookerStoreContext((state) => state.selectedDuration);
  const overlayEvents = useOverlayCalendarStore((state) => state.overlayBusyDates);
  const displayOverlay =
    getQueryParam("overlayCalendar") === "true" || localStorage?.getItem("overlayCalendarSwitchDefault");
  const { timezone } = useBookerTime();

  const eventDuration = selectedEventDuration || event?.data?.length || 30;

  const availableSlots = useAvailableTimeSlots({ schedule, eventDuration });

  const startDate = selectedDate ? dayjs(selectedDate).toDate() : dayjs().toDate();
  const endDate = dayjs(startDate)
    .add(extraDays - 1, "day")
    .toDate();

  // HACK: force rerender when overlay events change
  // Sine we dont use react router here we need to force rerender (ATOM SUPPORT)
  useEffect(() => {}, [displayOverlay]);

  const overlayEventsForDate = useMemo(() => {
    if (!overlayEvents || !displayOverlay) return [];
    return overlayEvents.map((event, id) => {
      return {
        id,
        start: dayjs(event.start).toDate(),
        end: dayjs(event.end).toDate(),
        title: event.title || t("busy_time.busy"),
        options: {
          status: "ACCEPTED",
          borderOnly: true,
        },
      } as CalendarEvent;
    });
  }, [overlayEvents, displayOverlay, t]);

  return (
    <div className="h-full [--calendar-dates-sticky-offset:66px]">
      <Calendar
        isPending={isLoading}
        availableTimeslots={availableSlots}
        startHour={0}
        endHour={23}
        events={overlayEventsForDate}
        startDate={startDate}
        endDate={endDate}
        onEmptyCellClick={(date) => setSelectedTimeslot(date.toISOString())}
        gridCellsPerHour={60 / eventDuration}
        hoverEventDuration={eventDuration}
        hideHeader
        timezone={timezone}
      />
    </div>
  );
};
