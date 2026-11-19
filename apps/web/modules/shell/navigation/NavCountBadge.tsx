"use client";

import { useLocale } from "@rondevu/lib/hooks/useLocale";
import { trpc } from "@rondevu/trpc/react";
import Link from "next/link";

export function UnconfirmedCountBadge() {
  const { t } = useLocale();
  const { data: unconfirmedBookingCount } = trpc.viewer.me.bookingUnconfirmedCount.useQuery();
  if (!unconfirmedBookingCount) return null;
  return (
    <Link
      href="/bookings/unconfirmed"
      title={t("unconfirmed_bookings_tooltip")}
      className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-md px-1 font-mono text-[11px] text-muted-foreground tabular-nums transition-colors hover:text-foreground">
      {unconfirmedBookingCount}
    </Link>
  );
}
