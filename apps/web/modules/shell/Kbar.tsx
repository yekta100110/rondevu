import { useSession } from "next-auth/react";

import { appStoreMetadata } from "@rondevu/app-store/appStoreMetaData";
import dayjs from "@rondevu/dayjs";
import { useLocale } from "@rondevu/lib/hooks/useLocale";
import { isMac } from "@rondevu/lib/isMac";
import { trpc } from "@rondevu/trpc/react";
import classNames from "@rondevu/ui/classNames";
import { Tooltip } from "@rondevu/ui/components/tooltip";
import { Kbd } from "@coss/ui/components/kbd";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CommandIcon,
  CornerDownLeftIcon,
  ExternalLinkIcon,
  SearchIcon,
} from "@coss/ui/icons";
import type { Action } from "kbar";
import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarResults,
  KBarSearch,
  useKBar,
  useMatches,
  useRegisterActions,
} from "kbar";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useMemo } from "react";

type ShortcutArrayType = {
  shortcuts?: string[];
};

type ActionConfig = {
  id: string;
  name: string;
  section?: string;
  shortcut?: string[];
  keywords: string;
  href: string;
};

type AppAction = {
  id: string;
  name: string;
  section: string;
  keywords: string;
};

const getApps: AppAction[] = Object.values(appStoreMetadata).map(({ name, slug }) => ({
  id: slug,
  name,
  section: "Installable Apps",
  keywords: `app ${name}`,
}));

const KBAR_ACTION_CONFIGS: ActionConfig[] = [
  {
    id: "event-types",
    name: "event_types_page_title",
    section: "event_types_page_title",
    shortcut: ["e", "t"],
    keywords: "event types",
    href: "/event-types",
  },
  {
    id: "app-store",
    name: "app_store",
    section: "apps",
    shortcut: ["a", "s"],
    keywords: "app store",
    href: "/apps",
  },
  {
    id: "upcoming-bookings",
    name: "upcoming",
    section: "bookings",
    shortcut: ["u", "b"],
    keywords: "upcoming bookings",
    href: "/bookings/upcoming",
  },
  {
    id: "recurring-bookings",
    name: "recurring",
    section: "bookings",
    shortcut: ["r", "b"],
    keywords: "recurring bookings",
    href: "/bookings/recurring",
  },
  {
    id: "past-bookings",
    name: "past",
    section: "bookings",
    shortcut: ["p", "b"],
    keywords: "past bookings",
    href: "/bookings/past",
  },
  {
    id: "cancelled-bookings",
    name: "cancelled",
    section: "bookings",
    shortcut: ["c", "b"],
    keywords: "cancelled bookings",
    href: "/bookings/cancelled",
  },
  {
    id: "schedule",
    name: "availability",
    section: "availability",
    shortcut: ["s", "a"],
    keywords: "schedule availability",
    href: "/availability",
  },
  {
    id: "profile",
    name: "profile",
    section: "profile",
    shortcut: ["p", "s"],
    keywords: "setting profile",
    href: "/settings/my-account/profile",
  },
  {
    id: "avatar",
    name: "change_avatar",
    section: "profile",
    shortcut: ["c", "a"],
    keywords: "remove change modify avatar",
    href: "/settings/my-account/profile",
  },
  {
    id: "timezone",
    name: "timezone",
    section: "profile",
    shortcut: ["c", "t"],
    keywords: "change modify timezone",
    href: "/settings/my-account/general",
  },
  {
    id: "brand-color",
    name: "brand_color",
    section: "profile",
    shortcut: ["b", "c"],
    keywords: "change modify brand color",
    href: "/settings/my-account/appearance",
  },
  {
    id: "teams",
    name: "teams",
    shortcut: ["t", "s"],
    keywords: "add manage modify team",
    href: "/settings/teams",
  },
  {
    id: "password",
    name: "change_password",
    section: "security",
    shortcut: ["c", "p"],
    keywords: "change modify password",
    href: "/settings/security/password",
  },
  {
    id: "two-factor",
    name: "two_factor_auth",
    section: "security",
    shortcut: ["t", "f", "a"],
    keywords: "two factor authentication",
    href: "/settings/security/two-factor-auth",
  },
  {
    id: "impersonation",
    name: "user_impersonation_heading",
    section: "security",
    shortcut: ["u", "i"],
    keywords: "user impersonation",
    href: "/settings/security/impersonation",
  },
  {
    id: "license",
    name: "choose_a_license",
    section: "admin",
    shortcut: ["u", "l"],
    keywords: "license",
    href: "/auth/setup?step=1",
  },
  {
    id: "webhooks",
    name: "Webhooks",
    section: "developer",
    shortcut: ["w", "h"],
    keywords: "webhook automation",
    href: "/settings/developer/webhooks",
  },
  {
    id: "api-keys",
    name: "api_keys",
    section: "developer",
    shortcut: ["a", "p", "i"],
    keywords: "api keys",
    href: "/settings/developer/api-keys",
  },
  {
    id: "billing",
    name: "manage_billing",
    section: "billing",
    shortcut: ["m", "b"],
    keywords: "billing view manage",
    href: "/settings/billing",
  },
];

function buildKbarActions(push: (href: string) => void): Action[] {
  const staticActions: Action[] = KBAR_ACTION_CONFIGS.map((config) => ({
    id: config.id,
    name: config.name,
    section: config.section,
    shortcut: config.shortcut,
    keywords: config.keywords,
    perform: () => push(config.href),
  }));

  const appStoreActions: Action[] = getApps.map((item) => ({
    ...item,
    perform: () => push(`/apps/${item.id}`),
  }));

  return [...staticActions, ...appStoreActions];
}

function useEventTypesAction(): void {
  const router = useRouter();
  const { data } = trpc.viewer.eventTypes.getEventTypesFromGroup.useInfiniteQuery(
    {
      limit: 100,
      group: { teamId: null, parentId: null },
    },
    {
      refetchOnWindowFocus: false,
      staleTime: 1 * 60 * 60 * 1000,
      getNextPageParam: (lastPage: { nextCursor?: number | null }) => lastPage.nextCursor,
    }
  );

  const eventTypeActions: Action[] =
    data?.pages?.flatMap((page) => {
      return (
        page?.eventTypes?.map((item) => ({
          id: `event-type-${item.id}`,
          name: item.title,
          section: "event_types_page_title",
          keywords: "event types",
          perform: () => router.push(`/event-types/${item.id}`),
        })) ?? []
      );
    }) ?? [];

  let actions: Action[] = [];
  if (eventTypeActions.length > 0) {
    actions = eventTypeActions;
  }

  useRegisterActions(actions, [data]);
}

function useUpcomingBookingsAction(): void {
  const router = useRouter();
  const session = useSession();
  const userId = session.data?.user.id;

  const { data } = trpc.viewer.bookings.get.useQuery(
    {
      filters: {
        status: "upcoming",
        afterStartDate: dayjs().startOf("day").toISOString(),
        userIds: userId ? [userId] : undefined,
      },
      limit: 100,
    },
    {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      enabled: !!userId,
    }
  );

  const bookingActions: Action[] = useMemo(() => {
    if (!data?.bookings) return [];

    return data.bookings.map((booking) => {
      const startTime = dayjs(booking.startTime);
      const formattedDate = startTime.format("MMM D");
      const formattedTime = startTime.format("h:mm A");
      const attendeeNames = (booking.attendees ?? []).map((a) => a.name).join(" ");

      return {
        id: `booking-${booking.uid}`,
        name: `${booking.title} - ${formattedDate} ${formattedTime}`,
        section: { name: "upcoming", priority: 1 },
        keywords: `booking ${booking.title} ${attendeeNames}`,
        perform: () => router.push(`/booking/${booking.uid}`),
      };
    });
  }, [data?.bookings, router]);

  useRegisterActions(bookingActions, [bookingActions]);
}

const KBarRoot = ({ children }: { children: ReactNode }): JSX.Element => {
  const router = useRouter();
  const actions = useMemo(() => buildKbarActions(router.push), [router.push]);

  return <KBarProvider actions={actions}>{children}</KBarProvider>;
};

function CommandKey(): JSX.Element {
  if (isMac) {
    return <CommandIcon className="h-3 w-3" />;
  }
  return <>CTRL</>;
}

const KBarContent = (): JSX.Element => {
  const { t } = useLocale();

  return (
    <KBarPortal>
      <KBarPositioner className="overflow-scroll">
        <KBarAnimator className="z-10 w-full max-w-(--breakpoint-sm) overflow-hidden rounded-md bg-default shadow-lg">
          <div className="flex items-center justify-center border-subtle border-b">
            <SearchIcon className="mx-3 h-4 w-4 text-default" />
            <KBarSearch
              defaultPlaceholder={t("kbar_search_placeholder")}
              className="w-full rounded-sm border-0 bg-default px-0 py-2.5 text-default placeholder:text-subtle focus:ring-0 focus-visible:outline-none"
            />
          </div>
          <RenderResults />
          <div className="hidden items-center space-x-1 border-subtle border-t px-2 py-1.5 text-subtle text-xs sm:flex">
            <ArrowUpIcon className="h-4 w-4" />
            <ArrowDownIcon className="h-4 w-4" /> <span className="pr-2">{t("navigate")}</span>
            <CornerDownLeftIcon className="h-4 w-4" />
            <span className="pr-2">{t("open")}</span>
            <CommandKey />
            <span className="pr-1">+ K </span>
            <span className="pr-2">{t("close")}</span>
          </div>
        </KBarAnimator>
        <div className="fixed inset-0 z-1 bg-inverted/70" />
      </KBarPositioner>
    </KBarPortal>
  );
};

function getTooltipContent(): string {
  if (isMac) {
    return "⌘ + K";
  }
  return "CTRL + K";
}

const KBarTrigger = (): JSX.Element | null => {
  const { query } = useKBar();
  const { t } = useLocale();

  if (!query) {
    return null;
  }

  return (
    <Tooltip side="bottom" content={getTooltipContent()}>
      <button
        type="button"
        aria-label={t("search")}
        onClick={query.toggle}
        className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground">
        <SearchIcon className="size-4 shrink-0" />
      </button>
    </Tooltip>
  );
};

const KBarSearchField = ({ className }: { className?: string }): JSX.Element | null => {
  const { query } = useKBar();
  const { t } = useLocale();

  if (!query) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={query.toggle}
      className={classNames(
        "flex h-9 w-full max-w-sm items-center gap-2 rounded-md border border-subtle bg-background px-3 text-muted-foreground text-sm transition-colors duration-150 hover:border-foreground/30",
        className
      )}>
      <SearchIcon className="size-4 shrink-0" />
      <span className="truncate">{t("shell_search_placeholder")}</span>
      <span className="ml-auto hidden items-center gap-1 sm:inline-flex">
        <Kbd>{isMac ? "⌘" : "Ctrl"}</Kbd>
        <Kbd>K</Kbd>
      </span>
    </button>
  );
};

function DisplayShortcuts(item: ShortcutArrayType): JSX.Element {
  const shortcuts = item.shortcuts;

  return (
    <span className="space-x-1">
      {shortcuts?.map((shortcut) => {
        return (
          <kbd
            key={shortcut}
            className="rounded-sm border bg-default px-2 py-1 text-emphasis transition hover:bg-subtle">
            {shortcut}
          </kbd>
        );
      })}
    </span>
  );
}

type RenderItemProps = {
  item: string | Action;
  active: boolean;
};

function renderResultItem(item: string | Action, active: boolean, t: (key: string) => string): JSX.Element {
  if (typeof item === "string") {
    return <div className="bg-default p-4 font-bold text-emphasis text-xs uppercase">{t(item)}</div>;
  }

  let background = "var(--rondevu-bg-default)";
  let borderLeft = "2px solid transparent";
  if (active) {
    background = "var(--rondevu-bg-subtle)";
    borderLeft = "2px solid var(--rondevu-border)";
  }

  return (
    <div
      style={{ background, borderLeft, color: "var(--rondevu-text)" }}
      className="flex items-center justify-between px-4 py-2.5 text-sm transition hover:cursor-pointer">
      <span>{t(item.name)}</span>
      <DisplayShortcuts shortcuts={item.shortcut} />
    </div>
  );
}

function NoResultsFound({ searchQuery }: { searchQuery: string }): JSX.Element {
  const { t } = useLocale();
  const helpUrl = `https://rondevu.org/docs?search=${encodeURIComponent(searchQuery)}`;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Enter") {
        window.open(helpUrl, "_blank", "noopener,noreferrer");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [helpUrl]);

  return (
    <div className="px-4 py-6 text-center">
      <p className="mb-3 text-sm text-subtle">{t("kbar_no_results_found")}</p>
      <a
        href={helpUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 text-emphasis text-sm transition hover:text-default">
        <ExternalLinkIcon className="h-4 w-4" />
        {t("kbar_search_help_desk_prefix")} <span className="underline">&quot;{searchQuery}&quot;</span>{" "}
        {t("kbar_search_help_desk_suffix")}
      </a>
    </div>
  );
}

function RenderResults(): JSX.Element {
  const { results } = useMatches();
  const { searchQuery } = useKBar((state) => ({ searchQuery: state.searchQuery }));
  const { t } = useLocale();

  useEventTypesAction();
  useUpcomingBookingsAction();

  if (results.length === 0 && searchQuery.trim().length > 0) {
    return <NoResultsFound searchQuery={searchQuery} />;
  }

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }: RenderItemProps): JSX.Element => renderResultItem(item, active, t)}
    />
  );
}

export { KBarRoot, KBarContent, KBarTrigger, KBarSearchField };
