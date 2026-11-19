import React from "react";

import { SkeletonText } from "@rondevu/ui/components/skeleton";

function SkeletonLoader() {
  return (
    <ul className="divide-y divide-subtle overflow-hidden rounded-xl border border-subtle bg-background motion-safe:animate-pulse">
      <SkeletonHeader />
      <SkeletonItem />
      <SkeletonItem />
      <SkeletonItem />

      <SkeletonHeader />
      <SkeletonItem />
      <SkeletonItem />
    </ul>
  );
}

export default SkeletonLoader;

function SkeletonHeader() {
  return (
    <li className="flex items-center bg-muted/50 px-4 py-2.5 sm:px-6">
      <SkeletonText className="h-3 w-16" />
    </li>
  );
}

function SkeletonItem() {
  return (
    <li className="group flex w-full items-start justify-between px-4 py-4 sm:px-6">
      {/* Left side - Date and time info */}
      <div className="flex min-w-0 shrink-0 flex-col gap-2 pr-4">
        <SkeletonText className="h-4 w-24" />
        <SkeletonText className="h-4 w-28" />
        <div className="mt-1 flex items-center gap-2">
          <SkeletonText className="h-4 w-4 rounded" />
          <SkeletonText className="h-3 w-20" />
        </div>
        {/* Badges */}
        <div className="mt-3 flex gap-2">
          <SkeletonText className="h-5 w-14 rounded-md" />
        </div>
      </div>

      {/* Right side - Event details */}
      <div className="flex min-w-0 flex-1 flex-col stack-y-2">
        {/* Event title */}
        <SkeletonText className="h-5 w-36" />
        {/* Event description */}
        <SkeletonText className="h-4 w-full max-w-48" />
        {/* Attendees */}
        <SkeletonText className="h-4 w-full max-w-56" />
      </div>

      {/* Action buttons - only visible on larger screens */}
      <div className="ml-4 hidden shrink-0 gap-2 sm:flex">
        <SkeletonText className="h-5 w-16 rounded-md" />
        <SkeletonText className="h-8 w-8 rounded-md" />
      </div>
    </li>
  );
}
