"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { Dispatch, ReactElement, ReactNode, SetStateAction } from "react";
import type React from "react";
import { cloneElement } from "react";
import { Toaster } from "sonner";

import { useFormbricks } from "@rondevu/web/modules/formbricks/hooks/useFormbricks";
import { useRedirectToLoginIfUnauthenticated } from "@rondevu/web/modules/auth/hooks/useRedirectToLoginIfUnauthenticated";
import { useRedirectToOnboardingIfNeeded } from "@rondevu/web/modules/auth/hooks/useRedirectToOnboardingIfNeeded";

import TimezoneChangeDialog from "@rondevu/web/modules/settings/components/TimezoneChangeDialog";
import { useLocale } from "@rondevu/lib/hooks/useLocale";
import classNames from "@rondevu/ui/classNames";
import { Button } from "@rondevu/ui/components/button";
import { ErrorBoundary } from "@rondevu/ui/components/errorBoundary";
import { SkeletonText } from "@rondevu/ui/components/skeleton";

import { DynamicModals } from "./DynamicModals";
import { KBarContent, KBarRoot } from "./Kbar";
import { SideBarContainer } from "./SideBar";
import { DesktopTopBarContainer, TopNavContainer } from "./TopNav";
import { BannerContainer } from "./banners/LayoutBanner";
import { useBanners } from "./banners/useBanners";
import { MobileNavigationContainer } from "./navigation/Navigation";
import { useAppTheme } from "./useAppTheme";

const Layout = (props: LayoutProps) => {
  const { banners, bannersHeight } = useBanners();

  useFormbricks();

  return (
    <>
      <div>
        <Toaster position="bottom-right" />
      </div>

      <TimezoneChangeDialog />
      <DynamicModals />

      <div className="flex min-h-screen flex-col bg-sidebar">
        {banners && <BannerContainer banners={banners} />}

        <div className="flex flex-1" data-testid="dashboard-shell">
          {props.SidebarContainer ? (
            cloneElement(props.SidebarContainer, { bannersHeight })
          ) : (
            <SideBarContainer bannersHeight={bannersHeight} />
          )}
          <div className="flex w-0 flex-1 flex-col">
            <MainContainer {...props} />
          </div>
        </div>
      </div>
    </>
  );
};

type DrawerState = [isOpen: boolean, setDrawerOpen: Dispatch<SetStateAction<boolean>>];

export type LayoutProps = {
  centered?: boolean;
  title?: string;
  description?: string;
  heading?: ReactNode;
  subtitle?: ReactNode;
  headerClassName?: string;
  children: ReactNode;
  CTA?: ReactNode;
  large?: boolean;
  MobileNavigationContainer?: ReactNode;
  SidebarContainer?: ReactElement;
  TopNavContainer?: ReactNode;
  drawerState?: DrawerState;
  HeadingLeftIcon?: ReactNode;
  backPath?: string | boolean; // renders back button to specified path
  // use when content needs to expand with flex
  flexChildrenContainer?: boolean;
  isPublic?: boolean;
  withoutMain?: boolean;
  // Gives the ability to include actions to the right of the heading
  actions?: JSX.Element;
  beforeCTAactions?: JSX.Element;
  afterHeading?: ReactNode;
  smallHeading?: boolean;
  disableSticky?: boolean;
};

const KBarWrapper = ({ children, withKBar = false }: { withKBar: boolean; children: React.ReactNode }) =>
  withKBar ? (
    <KBarRoot>
      {children}
      <KBarContent />
    </KBarRoot>
  ) : (
    <>{children}</>
  );

const PublicShell = (props: LayoutProps) => {
  const { status } = useSession();
  return (
    <KBarWrapper withKBar={status === "authenticated"}>
      <Layout {...props} />
    </KBarWrapper>
  );
};

export default function Shell(props: LayoutProps) {
  // if a page is unauthed and isPublic is true, the redirect does not happen.
  useRedirectToLoginIfUnauthenticated(props.isPublic);
  useRedirectToOnboardingIfNeeded();
  useAppTheme();

  return !props.isPublic ? (
    <KBarWrapper withKBar>
      <Layout {...props} />
    </KBarWrapper>
  ) : (
    <PublicShell {...props} />
  );
}

export function ShellMain(props: LayoutProps) {
  const router = useRouter();
  const { isLocaleReady } = useLocale();

  return (
    <>
      {(props.heading || !!props.backPath) && (
        <div
          className={classNames(
            "mb-4 flex items-center bg-background md:mb-6",
            !props.disableSticky && "sticky top-0 z-10 md:top-14"
          )}>
          {!!props.backPath && (
            <Button
              variant="icon"
              size="sm"
              color="minimal"
              onClick={() =>
                typeof props.backPath === "string" ? router.push(props.backPath as string) : router.back()
              }
              StartIcon="arrow-left"
              aria-label="Go Back"
              className="rounded-md text-muted-foreground hover:bg-accent hover:text-foreground ltr:mr-2 rtl:ml-2"
              data-testid="go-back-button"
            />
          )}
          {props.heading && (
            <header
              className={classNames(
                props.large ? "py-8" : "py-1",
                "flex w-full max-w-full items-center gap-3 truncate"
              )}>
              {props.HeadingLeftIcon && <div className="ltr:mr-4">{props.HeadingLeftIcon}</div>}
              <div
                className={classNames("min-w-0 flex-1 truncate", props.headerClassName)}>
                {props.heading && (
                  <h1
                    className={classNames(
                      "truncate font-semibold text-foreground tracking-tight",
                      props.smallHeading ? "text-lg" : "text-xl sm:text-2xl"
                    )}>
                    {!isLocaleReady ? <SkeletonText invisible /> : props.heading}
                  </h1>
                )}
                {props.subtitle && (
                  <p className="truncate text-muted-foreground text-sm" data-testid="subtitle">
                    {!isLocaleReady ? <SkeletonText invisible /> : props.subtitle}
                  </p>
                )}
              </div>
              {props.beforeCTAactions}
              {props.CTA && (
                <div
                  className={classNames(
                    props.backPath
                      ? "relative"
                      : "pwa:bottom-[max(7rem,_calc(5rem_+_env(safe-area-inset-bottom)))] fixed bottom-20 z-40 ltr:right-4 rtl:left-4 md:z-auto md:ltr:right-0 md:rtl:left-0",
                    "shrink-0 [-webkit-app-region:no-drag] md:relative md:bottom-auto md:right-auto"
                  )}>
                  {isLocaleReady && props.CTA}
                </div>
              )}
              {props.actions && props.actions}
            </header>
          )}
        </div>
      )}
      {props.afterHeading && <>{props.afterHeading}</>}
      <div className={classNames(props.flexChildrenContainer && "flex flex-1 flex-col")}>
        {props.children}
      </div>
    </>
  );
}

function MainContainer({
  MobileNavigationContainer: MobileNavigationContainerProp = <MobileNavigationContainer />,
  TopNavContainer: TopNavContainerProp = <TopNavContainer />,
  ...props
}: LayoutProps) {
  return (
    <main className="relative z-0 flex min-w-0 flex-1 flex-col bg-background focus:outline-none md:my-2 md:mr-2 md:rounded-xl md:border md:border-subtle md:shadow-sm">
      {/* show top navigation for md and smaller (tablet and phones) */}
      {TopNavContainerProp}
      <DesktopTopBarContainer />
      <div
        className={classNames(
          "flex w-full flex-1 flex-col p-4 md:p-6",
          !props.withoutMain && "mx-auto max-w-6xl"
        )}>
        <ErrorBoundary>
          {!props.withoutMain ? <ShellMain {...props}>{props.children}</ShellMain> : props.children}
        </ErrorBoundary>
        {/* show bottom navigation for md and smaller (tablet and phones) on pages where back button doesn't exist */}
        {!props.backPath ? MobileNavigationContainerProp : null}
      </div>
    </main>
  );
}
