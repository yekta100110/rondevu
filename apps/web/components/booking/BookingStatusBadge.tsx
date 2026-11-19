import { useLocale } from "@rondevu/lib/hooks/useLocale";
import classNames from "@rondevu/ui/classNames";

export type BookingDisplayStatus = "confirmed" | "completed" | "pending" | "cancelled" | "rejected";

const LABEL_KEYS: Record<BookingDisplayStatus, string> = {
  confirmed: "booking_status_confirmed",
  completed: "completed",
  pending: "pending",
  cancelled: "cancelled",
  rejected: "rejected",
};

export function getBookingDisplayStatus({
  isPending,
  isCancelled,
  isRejected,
  isBookingInPast,
}: {
  isPending: boolean;
  isCancelled: boolean;
  isRejected: boolean;
  isBookingInPast: boolean;
}): BookingDisplayStatus {
  if (isRejected) return "rejected";
  if (isCancelled) return "cancelled";
  if (isPending) return "pending";
  if (isBookingInPast) return "completed";
  return "confirmed";
}

/** Monochrome status per docs/design-system.md §7: filled dot, hollow ring or struck-through text. */
export function BookingStatusBadge({
  status,
  className,
}: {
  status: BookingDisplayStatus;
  className?: string;
}) {
  const { t } = useLocale();
  const isStruck = status === "cancelled" || status === "rejected";
  return (
    <span
      data-testid={`booking-status-${status}`}
      className={classNames(
        "inline-flex h-5 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border border-subtle px-1.5 font-mono font-normal text-[11px] text-foreground",
        (isStruck || status === "completed") && "text-muted-foreground",
        isStruck && "line-through",
        className
      )}>
      <span
        aria-hidden="true"
        className={classNames(
          "size-1.5 shrink-0 rounded-full",
          status === "confirmed" && "bg-foreground",
          status === "completed" && "bg-muted-foreground",
          status === "pending" && "ring-1 ring-foreground ring-inset",
          isStruck && "bg-muted-foreground/50"
        )}
      />
      {t(LABEL_KEYS[status])}
    </span>
  );
}
