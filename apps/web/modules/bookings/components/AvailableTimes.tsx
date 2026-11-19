// We do not need to worry about importing framer-motion here as it is lazy imported in Booker.

import { getPaymentAppData } from "@rondevu/app-store/_utils/payments/getPaymentAppData";
import { useIsPlatform } from "@rondevu/atoms/hooks/useIsPlatform";
import dayjs from "@rondevu/dayjs";
import type { IOutOfOfficeData } from "@rondevu/features/availability/lib/getUserAvailability";
import { useBookerStoreContext } from "@rondevu/features/bookings/Booker/BookerStoreProvider";
import { useBookerTime } from "@rondevu/features/bookings/Booker/hooks/useBookerTime";
import { bookerPillSpring } from "@rondevu/features/bookings/Booker/utils/motion";
import { getQueryParam } from "@rondevu/features/bookings/Booker/utils/query-param";
import { useCheckOverlapWithOverlay } from "@rondevu/features/bookings/lib/useCheckOverlapWithOverlay";
import type { BookerEvent, Slots } from "@rondevu/features/bookings/types";
import { useLocale } from "@rondevu/lib/hooks/useLocale";
import { localStorage } from "@rondevu/lib/webstorage";
import { BookerLayouts } from "@rondevu/prisma/zod-utils";
import classNames from "@rondevu/ui/classNames";
import { Button } from "@rondevu/ui/components/button";
import { SkeletonText } from "@rondevu/ui/components/skeleton";
import { CalendarX2Icon } from "@coss/ui/icons";
import * as HoverCard from "@radix-ui/react-hover-card";
import { AnimatePresence, m } from "framer-motion";
import { useMemo } from "react";
import type { Slot } from "~/schedules/lib/types";
import type { IUseBookingLoadingStates } from "../hooks/useBookings";
import { OutOfOfficeInSlots } from "./OutOfOfficeInSlots";
import { SeatsAvailabilityText } from "./SeatsAvailabilityText";

type TOnTimeSelect = (
  time: string,
  attendees: number,
  seatsPerTimeSlot?: number | null,
  bookingUid?: string
) => void;

type TOnTentativeTimeSelect = ({
  time,
  attendees,
  seatsPerTimeSlot,
  bookingUid,
}: {
  time: string;
  attendees: number;
  seatsPerTimeSlot?: number | null;
  bookingUid?: string;
}) => void;

export type AvailableTimesProps = {
  slots: Slots[string];
  showTimeFormatToggle?: boolean;
  className?: string;
  // It is called when a slot is selected, but it is not a confirmation and a confirm button will be shown besides it.
  onTentativeTimeSelect?: TOnTentativeTimeSelect;
  unavailableTimeSlots?: string[];
} & Omit<SlotItemProps, "slot">;

type SlotItemProps = {
  slot: Slot;
  seatsPerTimeSlot?: number | null;
  selectedSlots?: string[];
  onTimeSelect?: TOnTimeSelect;
  onTentativeTimeSelect?: TOnTentativeTimeSelect;
  showAvailableSeatsCount?: boolean | null;
  event: {
    data?: Pick<BookerEvent, "length" | "bookingFields" | "price" | "currency" | "metadata"> | null;
  };
  customClassNames?: string;
  confirmStepClassNames?: {
    confirmButton?: string;
  };
  loadingStates?: IUseBookingLoadingStates;
  isVerificationCodeSending?: boolean;
  renderConfirmNotVerifyEmailButtonCond?: boolean;
  skipConfirmStep?: boolean;
  shouldRenderCaptcha?: boolean;
  watchedCfToken?: string;
  unavailableTimeSlots?: string[];
  confirmButtonDisabled?: boolean;
  handleSlotClick?: (slot: Slot, isOverlapping: boolean) => void;
};

const SlotItem = ({
  slot,
  seatsPerTimeSlot,
  selectedSlots,
  onTimeSelect,
  showAvailableSeatsCount,
  event,
  customClassNames,
  loadingStates,
  renderConfirmNotVerifyEmailButtonCond,
  isVerificationCodeSending,
  skipConfirmStep,
  shouldRenderCaptcha,
  watchedCfToken,
  handleSlotClick,
  onTentativeTimeSelect,
  unavailableTimeSlots = [],
  confirmButtonDisabled,
  confirmStepClassNames,
}: SlotItemProps) => {
  const { t } = useLocale();

  const { data: eventData } = event;

  const isPaidEvent = useMemo(() => {
    if (!eventData?.price) return false;
    const paymentAppData = getPaymentAppData(eventData);
    return eventData?.price > 0 && !Number.isNaN(paymentAppData.price) && paymentAppData.price > 0;
  }, [eventData]);

  const overlayCalendarToggled =
    getQueryParam("overlayCalendar") === "true" || localStorage.getItem("overlayCalendarSwitchDefault");

  const { timeFormat, timezone } = useBookerTime();
  const bookingData = useBookerStoreContext((state) => state.bookingData);
  const layout = useBookerStoreContext((state) => state.layout);
  const hasTimeSlots = !!seatsPerTimeSlot;
  const computedDateWithUsersTimezone = dayjs.utc(slot.time).tz(timezone);

  const bookingFull = !!(hasTimeSlots && slot.attendees && slot.attendees >= seatsPerTimeSlot);
  const isHalfFull = slot.attendees && seatsPerTimeSlot && slot.attendees / seatsPerTimeSlot >= 0.5;
  const isNearlyFull = slot.attendees && seatsPerTimeSlot && slot.attendees / seatsPerTimeSlot >= 0.83;
  // Monochrome design: seat pressure is shown by dot density, not by colour.
  const colorClass = isNearlyFull ? "opacity-100" : isHalfFull ? "opacity-60" : "opacity-30";

  const nowDate = dayjs();
  const usersTimezoneDate = nowDate.tz(timezone);

  const offset = (usersTimezoneDate.utcOffset() - nowDate.utcOffset()) / 60;

  const selectedTimeslot = useBookerStoreContext((state) => state.selectedTimeslot);

  const { isOverlapping, overlappingTimeEnd, overlappingTimeStart, overlappingTitle } =
    useCheckOverlapWithOverlay({
      start: computedDateWithUsersTimezone,
      selectedDuration: eventData?.length ?? 0,
      offset,
    });

  const onButtonClick = () => {
    if (handleSlotClick) {
      handleSlotClick(slot, isOverlapping);
    }
    if (onTentativeTimeSelect) {
      onTentativeTimeSelect({
        time: slot.time,
        attendees: slot.attendees || 0,
        seatsPerTimeSlot,
      });
    }
  };

  const isTimeslotUnavailable = unavailableTimeSlots.includes(slot.time);
  const isSelected = !!selectedSlots?.includes(slot.time) || selectedTimeslot === slot.time;
  return (
    <AnimatePresence>
      <div className={classNames("flex gap-2", slot.showConfirmButton && "col-span-full")}>
        <button
          type="button"
          key={slot.time}
          aria-pressed={isSelected}
          disabled={
            bookingFull ||
            !!(slot.bookingUid && slot.bookingUid === bookingData?.uid) ||
            loadingStates?.creatingBooking ||
            loadingStates?.creatingRecurringBooking ||
            isVerificationCodeSending ||
            (skipConfirmStep && !!shouldRenderCaptcha && !watchedCfToken) ||
            isTimeslotUnavailable
          }
          data-testid="time"
          data-disabled={bookingFull}
          data-time={slot.time}
          onClick={onButtonClick}
          className={classNames(
            "relative flex min-h-10 w-full grow flex-col items-center justify-center rounded-md border px-2 py-2 font-mono text-sm tabular-nums transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50",
            isSelected ? "border-brand-default text-brand" : "border-subtle text-emphasis hover:border-emphasis",
            `${customClassNames}`
          )}>
          {isSelected && (
            <m.span
              layoutId="booker-slot-pill"
              aria-hidden
              className="bg-brand-default absolute inset-0 rounded-[5px]"
              transition={bookerPillSpring}
            />
          )}
          <span className="relative flex items-center gap-2">
            {!hasTimeSlots && overlayCalendarToggled && (
              // Filled = clashes with the visitor's own calendar, hollow = free.
              <span
                className={classNames(
                  "inline-block h-2 w-2 rounded-full border border-current",
                  isOverlapping && "bg-current"
                )}
              />
            )}
            {computedDateWithUsersTimezone.format(timeFormat)}
          </span>
          {bookingFull && <p className="relative font-sans text-xs">{t("booking_full")}</p>}
          {hasTimeSlots && !bookingFull && (
            <p className="relative flex items-center font-sans text-xs">
              <span
                className={classNames(colorClass, "mr-1 inline-block h-1.5 w-1.5 rounded-full bg-current")}
                aria-hidden
              />
              <SeatsAvailabilityText
                showExact={!!showAvailableSeatsCount}
                totalSeats={seatsPerTimeSlot}
                bookedSeats={slot.attendees || 0}
              />
            </p>
          )}
        </button>
        {!!slot.showConfirmButton && (
          <HoverCard.Root>
            <HoverCard.Trigger asChild>
              <m.div key={slot.time} initial={{ width: 0 }} animate={{ width: "auto" }} exit={{ width: 0 }}>
                <Button
                  variant={layout === "column_view" ? "icon" : "button"}
                  StartIcon={layout === "column_view" ? "chevron-right" : undefined}
                  type="button"
                  className={confirmStepClassNames?.confirmButton}
                  onClick={() =>
                    onTimeSelect &&
                    onTimeSelect(slot.time, slot?.attendees || 0, seatsPerTimeSlot, slot.bookingUid)
                  }
                  data-testid="skip-confirm-book-button"
                  disabled={
                    isTimeslotUnavailable ||
                    (!!shouldRenderCaptcha && !watchedCfToken) ||
                    loadingStates?.creatingBooking ||
                    loadingStates?.creatingRecurringBooking ||
                    isVerificationCodeSending ||
                    confirmButtonDisabled
                  }
                  color="primary"
                  loading={
                    (selectedTimeslot === slot.time && loadingStates?.creatingBooking) ||
                    loadingStates?.creatingRecurringBooking ||
                    isVerificationCodeSending
                  }>
                  {(() => {
                    if (layout === "column_view") return "";
                    if (isTimeslotUnavailable) return t("timeslot_unavailable_short");
                    if (!renderConfirmNotVerifyEmailButtonCond) return t("verify_email_button");
                    return isPaidEvent ? t("pay_and_book") : t("confirm");
                  })()}
                </Button>
              </m.div>
            </HoverCard.Trigger>
            {isOverlapping && (
              <HoverCard.Portal>
                <HoverCard.Content side="top" align="end" sideOffset={2}>
                  <div className="text-emphasis bg-inverted w-(--booker-timeslots-width) rounded-md p-3">
                    <div className="flex items-center gap-2">
                      <p>{overlappingTitle || t("busy_time.busy")}</p>
                    </div>
                    <p className="text-muted">
                      {overlappingTimeStart} - {overlappingTimeEnd}
                    </p>
                  </div>
                </HoverCard.Content>
              </HoverCard.Portal>
            )}
          </HoverCard.Root>
        )}
      </div>
    </AnimatePresence>
  );
};

export const AvailableTimes = ({
  slots,
  showTimeFormatToggle = true,
  className,
  ...props
}: AvailableTimesProps) => {
  const { t } = useLocale();
  const layout = useBookerStoreContext((state) => state.layout);
  const isColumnView = layout === BookerLayouts.COLUMN_VIEW;

  const oooAllDay = slots.every((slot) => slot.away);
  if (oooAllDay) {
    return <OOOSlot {...slots[0]} />;
  }

  // Display ooo in slots once but after or before slots
  const oooBeforeSlots = slots[0] && slots[0].away;
  const oooAfterSlots = slots[slots.length - 1] && slots[slots.length - 1].away;

  return (
    <div className={classNames("text-default flex flex-col", className)}>
      <div className="h-full pb-4">
        {!slots.length && (
          <div
            data-testId="no-slots-available"
            className="border-subtle flex h-full flex-col items-center rounded-lg border border-dashed p-6">
            <CalendarX2Icon className="text-muted mb-2 h-4 w-4" />
            <p className={classNames("text-muted", showTimeFormatToggle ? "-mt-1 text-lg" : "text-sm")}>
              {t("all_booked_today")}
            </p>
          </div>
        )}
        {oooBeforeSlots && !oooAfterSlots && <OOOSlot {...slots[0]} />}
        <div className={isColumnView ? "flex flex-col gap-2" : "grid grid-cols-3 gap-2"}>
          {slots.map((slot) => {
            if (slot.away) return null;
            return <SlotItem key={slot.time} slot={slot} {...props} />;
          })}
        </div>
        {oooAfterSlots && !oooBeforeSlots && <OOOSlot {...slots[slots.length - 1]} className="pb-0" />}
      </div>
    </div>
  );
};

interface IOOOSlotProps {
  fromUser?: IOutOfOfficeData["anyDate"]["fromUser"];
  toUser?: IOutOfOfficeData["anyDate"]["toUser"];
  reason?: string;
  emoji?: string;
  notes?: string | null;
  showNotePublicly?: boolean;
  time?: string;
  className?: string;
}

const OOOSlot: React.FC<IOOOSlotProps> = (props) => {
  const isPlatform = useIsPlatform();
  const { fromUser, toUser, reason, emoji, notes, showNotePublicly, time, className = "" } = props;

  if (isPlatform) return <></>;
  return (
    <OutOfOfficeInSlots
      fromUser={fromUser}
      toUser={toUser}
      date={dayjs(time).format("YYYY-MM-DD")}
      reason={reason}
      emoji={emoji}
      notes={notes}
      showNotePublicly={showNotePublicly}
      borderDashed
      className={className}
    />
  );
};

export const AvailableTimesSkeleton = () => (
  <div className="flex w-[20%] flex-col only:w-full">
    {/* Random number of elements between 1 and 6. */}
    {Array.from({ length: Math.floor(Math.random() * 6) + 1 }).map((_, i) => (
      <SkeletonText className="mb-4 h-6 w-full" key={i} />
    ))}
  </div>
);
