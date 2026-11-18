"use client";

import { ShellMainAppDir } from "app/(use-page-wrapper)/(main-nav)/ShellMainAppDir";

import { EventTypesSkeletonLoader } from "@rondevu/web/modules/event-types/components/SkeletonLoader";
import { useLocale } from "@rondevu/lib/hooks/useLocale";

export function EventTypesSkeleton() {
  const { t } = useLocale();
  return (
    <ShellMainAppDir heading={t("event_types_page_title")} subtitle={t("event_types_page_subtitle")}>
      <EventTypesSkeletonLoader />
    </ShellMainAppDir>
  );
}
