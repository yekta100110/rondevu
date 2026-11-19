"use client";

import Link from "next/link";

import { useLocale } from "@rondevu/lib/hooks/useLocale";
import { trpc } from "@rondevu/trpc/react";
import { Badge } from "@rondevu/ui/components/badge";

export default function UnconfirmedBookingBadge() {
  const { t } = useLocale();
  const { data: unconfirmedBookingCount } = trpc.viewer.me.bookingUnconfirmedCount.useQuery();
  if (!unconfirmedBookingCount) return null;
  return (
    <Link href="/bookings/unconfirmed">
      <Badge
        rounded
        title={t("unconfirmed_bookings_tooltip")}
        variant="gray"
        className="cursor-pointer font-mono tnum hover:bg-emphasis">
        {unconfirmedBookingCount}
      </Badge>
    </Link>
  );
}
