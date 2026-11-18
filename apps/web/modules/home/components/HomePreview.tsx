import { CheckCheck, Clock } from "lucide-react";
import type { HomeContent } from "../home-content";

interface HomePreviewProps {
  content: HomeContent["preview"];
}

export function HomePreview({ content }: HomePreviewProps) {
  return (
    <figure className="relative w-full" aria-label={content.caption}>
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_320px] md:items-end">
        <div className="overflow-hidden rounded-xl border border-default bg-default shadow-elevation-low">
          <div className="flex h-12 items-center justify-between border-b border-subtle px-5">
            <div className="flex items-center gap-2 text-sm font-medium text-emphasis">
              <span className="size-2 rounded-full bg-semantic-success-emphasis" aria-hidden="true" />
              {content.todayLabel}
            </div>
            <span className="text-sm text-subtle">{content.dateLabel}</span>
          </div>
          <ul>
            {content.rows.map((row) => (
              <li
                key={row.time}
                className="grid h-16 grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-4 border-b border-subtle px-5 last:border-b-0">
                <span className="text-sm tabular-nums text-subtle">{row.time}</span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-emphasis">{row.name}</p>
                  <p className="truncate text-sm text-subtle">{row.service}</p>
                </div>
                {row.status === "confirmed" ? (
                  <span className="inline-flex h-7 items-center gap-1.5 rounded-md bg-semantic-success-subtle px-2 text-xs font-medium text-semantic-success">
                    <CheckCheck className="size-4" strokeWidth={1.5} aria-hidden="true" />
                    <span className="hidden sm:inline">{content.statusConfirmed}</span>
                  </span>
                ) : (
                  <span className="inline-flex h-7 items-center gap-1.5 rounded-md bg-semantic-attention-subtle px-2 text-xs font-medium text-semantic-attention">
                    <Clock className="size-4" strokeWidth={1.5} aria-hidden="true" />
                    <span className="hidden sm:inline">{content.statusPending}</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-default bg-muted p-3 md:mb-6">
          <div className="mb-3 flex items-center gap-2 px-1 text-sm font-medium text-emphasis">
            <span
              className="flex size-6 items-center justify-center rounded-full bg-emphasis text-xs text-subtle"
              aria-hidden="true">
              {content.chatTitle.charAt(0)}
            </span>
            {content.chatTitle}
          </div>
          <div className="rounded-lg rounded-tl-sm bg-[#d9fdd3] px-3 py-2 text-sm leading-5 text-[#111b21] dark:bg-[#144d37] dark:text-[#e9edef]">
            <p>{content.chatMessage}</p>
            <p className="mt-1 text-right text-xs tabular-nums text-[#667781] dark:text-[#8696a0]">
              {content.chatTime}
            </p>
          </div>
          <div className="mt-2 ml-auto w-fit max-w-[80%] rounded-lg rounded-tr-sm bg-default px-3 py-2 text-sm leading-5 text-emphasis shadow-elevation-low">
            {content.chatReply}
          </div>
        </div>
      </div>
      <figcaption className="mt-4 text-center text-xs text-muted">{content.caption}</figcaption>
    </figure>
  );
}
