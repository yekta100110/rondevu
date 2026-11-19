import { ENABLE_PROFILE_SWITCHER, IS_VISUAL_REGRESSION_TESTING, WEBAPP_URL } from "@rondevu/lib/constants";
import { getPlaceholderAvatar } from "@rondevu/lib/defaultAvatarImage";
import { useIsStandalone } from "@rondevu/lib/hooks/useIsStandalone";
import { useLocale } from "@rondevu/lib/hooks/useLocale";
import classNames from "@rondevu/ui/classNames";
import { Avatar } from "@rondevu/ui/components/avatar";
import { Credits } from "@rondevu/ui/components/credits";
import { ButtonOrLink } from "@rondevu/ui/components/dropdown";
import { Icon } from "@rondevu/ui/components/icon";
import { SkeletonText } from "@rondevu/ui/components/skeleton";
import { Tooltip } from "@rondevu/ui/components/tooltip";
import { ArrowLeftIcon, ArrowRightIcon } from "@coss/ui/icons";
import Link from "next/link";
import type { User as UserAuth } from "next-auth";
import { useSession } from "next-auth/react";
import { Wordmark } from "./components/Wordmark";
import { Navigation } from "./navigation/Navigation";
import { NAV_ITEM_ACTIVE, NAV_ITEM_BASE, NAV_ITEM_HOVER } from "./navigation/NavigationItem";
import { useBottomNavItems } from "./useBottomNavItems";
import { ProfileDropdown } from "./user-dropdown/ProfileDropdown";
import { UserDropdown } from "./user-dropdown/UserDropdown";

export type SideBarContainerProps = {
  bannersHeight: number;
};

export type SideBarProps = {
  bannersHeight: number;
  user?: UserAuth | null;
};

export function SideBarContainer({ bannersHeight }: SideBarContainerProps) {
  const { status, data } = useSession();
  const isStandalone = useIsStandalone();

  // Make sure that Sidebar is rendered optimistically so that a refresh of pages when logged in have SideBar from the beginning.
  // This improves the experience of refresh on app store pages(when logged in) which are SSG.
  // Though when logged out, app store pages would temporarily show SideBar until session status is confirmed.
  if (status !== "loading" && status !== "authenticated") return null;
  if (isStandalone) return null;
  return <SideBar bannersHeight={bannersHeight} user={data?.user} />;
}

export function SideBar({ bannersHeight, user }: SideBarProps) {
  const { t, isLocaleReady } = useLocale();

  const publicPageUrl = `${WEBAPP_URL}/${user?.orgAwareUsername}`;

  const bottomNavItems = useBottomNavItems({
    publicPageUrl,
  });

  const sidebarStylingAttributes = {
    maxHeight: `calc(100vh - ${bannersHeight}px)`,
    top: `${bannersHeight}px`,
  };

  return (
    <div className="relative">
      <aside
        style={sidebarStylingAttributes}
        className={classNames(
          "fixed left-0 hidden h-full w-14 flex-col overflow-y-auto overflow-x-hidden bg-sidebar text-sidebar-foreground md:sticky md:flex lg:w-60",
          "max-h-screen"
        )}>
        <div className="flex h-14 shrink-0 items-center px-2 todesktop:[-webkit-app-region:drag] lg:px-4">
          <Link href="/event-types" aria-label="rOndevu" className="mx-auto lg:mx-0">
            <Wordmark className="text-xs lg:text-[22px]" />
          </Link>
          <div className="ml-auto hidden todesktop:flex">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="rounded-md p-1 text-muted-foreground hover:text-foreground">
              <ArrowLeftIcon className="size-4 shrink-0" />
            </button>
            <button
              type="button"
              onClick={() => window.history.forward()}
              className="rounded-md p-1 text-muted-foreground hover:text-foreground">
              <ArrowRightIcon className="size-4 shrink-0" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 px-2 pt-2">
          <Navigation />

          <div className="flex flex-col gap-0.5">
            <p className="hidden h-8 items-center px-2 font-medium text-muted-foreground text-xs lg:flex">
              {t("shell_group_your_page")}
            </p>
            {bottomNavItems.map((item) => (
              <Tooltip side="right" content={t(item.name)} className="lg:hidden" key={item.name}>
                <ButtonOrLink
                  id={item.name}
                  href={item.href || undefined}
                  aria-label={t(item.name)}
                  target={item.target}
                  className={classNames(
                    NAV_ITEM_BASE,
                    NAV_ITEM_ACTIVE,
                    "w-full text-left",
                    isLocaleReady ? NAV_ITEM_HOVER : ""
                  )}
                  onClick={item.onClick}>
                  {!!item.icon && (
                    <Icon
                      name={item.isLoading ? "rotate-cw" : item.icon}
                      className={classNames("size-4 shrink-0", item.isLoading && "animate-spin")}
                      aria-hidden="true"
                    />
                  )}
                  {isLocaleReady ? (
                    <span className="hidden w-full truncate lg:block">{t(item.name)}</span>
                  ) : (
                    <SkeletonText className="h-[20px] w-full" />
                  )}
                </ButtonOrLink>
              </Tooltip>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 p-2">
          {!IS_VISUAL_REGRESSION_TESTING && <Credits />}
          {user?.org ? (
            !ENABLE_PROFILE_SWITCHER ? (
              <div className="flex items-center gap-1">
                <Link
                  href="/settings/organizations/profile"
                  className="flex min-w-0 flex-1 items-center gap-2 rounded-md p-2 text-sm hover:bg-accent">
                  <Avatar
                    alt={`${user.org.name} logo`}
                    imageSrc={getPlaceholderAvatar(user.org.logoUrl, user.org.name)}
                    size="xsm"
                  />
                  <span className="hidden truncate font-medium lg:inline">{user.org.name}</span>
                </Link>
                <div data-testid="user-dropdown-trigger" className="hidden lg:flex">
                  <UserDropdown small />
                </div>
              </div>
            ) : (
              <ProfileDropdown />
            )
          ) : (
            <div data-testid="user-dropdown-trigger" className="todesktop:mt-4 w-full">
              <span className="hidden lg:inline">
                <UserDropdown />
              </span>
              <span className="hidden md:inline lg:hidden">
                <UserDropdown small />
              </span>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
