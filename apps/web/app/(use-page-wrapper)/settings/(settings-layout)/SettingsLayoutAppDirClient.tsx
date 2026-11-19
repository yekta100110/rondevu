"use client";

import type { TeamFeatures } from "@rondevu/features/flags/config";
import { IS_RONDEVU, WEBAPP_URL } from "@rondevu/lib/constants";
import { getPlaceholderAvatar } from "@rondevu/lib/defaultAvatarImage";
import { getUserAvatarUrl } from "@rondevu/lib/getAvatarUrl";
import { useIsStandalone } from "@rondevu/lib/hooks/useIsStandalone";
import { useLocale } from "@rondevu/lib/hooks/useLocale";
import { IdentityProvider, UserPermissionRole } from "@rondevu/prisma/enums";
import { trpc } from "@rondevu/trpc/react";
import classNames from "@rondevu/ui/classNames";
import { Badge } from "@rondevu/ui/components/badge";
import { Button } from "@rondevu/ui/components/button";
import { ErrorBoundary } from "@rondevu/ui/components/errorBoundary";
import { Icon } from "@rondevu/ui/components/icon";
import type { VerticalTabItemProps } from "@rondevu/ui/components/navigation";
import { VerticalTabItem } from "@rondevu/ui/components/navigation";
import { Skeleton } from "@rondevu/ui/components/skeleton";
import { ArrowLeftIcon } from "@coss/ui/icons";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import type { ComponentProps } from "react";
import React, { useEffect, useMemo, useState } from "react";
import Shell from "~/shell/Shell";

const getTabs = (
  orgBranding: {
    id?: number;
    slug?: string;
    name?: string;
    logoUrl?: string | null;
    fullDomain?: string | null;
  } | null
) => {
  const tabs: VerticalTabItemProps[] = [
    {
      name: "my_account",
      href: "/settings/my-account",
      icon: "user",
      children: [
        {
          name: "profile",
          href: "/settings/my-account/profile",
          trackingMetadata: { section: "my_account", page: "profile" },
        },
        {
          name: "general",
          href: "/settings/my-account/general",
          trackingMetadata: { section: "my_account", page: "general" },
        },
        {
          name: "calendars",
          href: "/settings/my-account/calendars",
          trackingMetadata: { section: "my_account", page: "calendars" },
        },
        {
          name: "conferencing",
          href: "/settings/my-account/conferencing",
          trackingMetadata: { section: "my_account", page: "conferencing" },
        },
        {
          name: "appearance",
          href: "/settings/my-account/appearance",
          trackingMetadata: { section: "my_account", page: "appearance" },
        },
        {
          name: "out_of_office",
          href: "/settings/my-account/out-of-office",
          trackingMetadata: { section: "my_account", page: "out_of_office" },
        },
        {
          name: "push_notifications",
          href: "/settings/my-account/push-notifications",
          trackingMetadata: { section: "my_account", page: "push_notifications" },
        },
        {
          name: "plan_billing",
          href: "/settings/my-account/billing",
          trackingMetadata: { section: "my_account", page: "plan_billing" },
        },
        // TODO
        // { name: "referrals", href: "/settings/my-account/referrals" },
      ],
    },
    {
      name: "security",
      href: "/settings/security",
      icon: "key",
      children: [
        {
          name: "password",
          href: "/settings/security/password",
          trackingMetadata: { section: "security", page: "password" },
        },
        {
          name: "2fa_auth",
          href: "/settings/security/two-factor-auth",
          trackingMetadata: { section: "security", page: "2fa_auth" },
        },
      ],
    },
    {
      name: "developer",
      href: "/settings/developer",
      icon: "terminal",
      children: [
        //
        {
          name: "webhooks",
          href: "/settings/developer/webhooks",
          trackingMetadata: { section: "developer", page: "webhooks" },
        },
        {
          name: "oAuth",
          href: "/settings/developer/oauth",
          trackingMetadata: { section: "developer", page: "oauth_clients" },
        },
        {
          name: "api_keys",
          href: "/settings/developer/api-keys",
          trackingMetadata: { section: "developer", page: "api_keys" },
        },
        {
          name: "api_docs",
          href: "/docs",
          trackingMetadata: { section: "developer", page: "api_docs" },
        },
        // TODO: Add profile level for embeds
        // { name: "embeds", href: "/v2/settings/developer/embeds" },
      ],
    },
    {
      name: "organization",
      href: "/settings/organizations",
      children: [
        {
          name: "profile",
          href: "/settings/organizations/profile",
          trackingMetadata: { section: "organization", page: "profile" },
        },
        {
          name: "general",
          href: "/settings/organizations/general",
          trackingMetadata: { section: "organization", page: "general" },
        },
        {
          name: "guest_notifications",
          href: "/settings/organizations/guest-notifications",
        },
        ...(orgBranding
          ? [
              {
                name: "members",
                href: `${WEBAPP_URL}/settings/organizations/${orgBranding?.slug}/members`,
                isExternalLink: true,
                trackingMetadata: { section: "organization", page: "members" },
              },
            ]
          : []),
        {
          name: "privacy_and_security",
          href: "/settings/organizations/privacy",
          trackingMetadata: { section: "organization", page: "privacy_and_security" },
        },
        {
          name: "SSO",
          href: "/settings/organizations/sso",
          trackingMetadata: { section: "organization", page: "sso" },
        },
        {
          name: "directory_sync",
          href: "/settings/organizations/dsync",
          trackingMetadata: { section: "organization", page: "directory_sync" },
        },
        {
          name: "api_docs",
          href: "/docs",
          trackingMetadata: { section: "organization", page: "api_docs" },
        },
      ],
    },
    {
      name: "admin",
      href: "/settings/admin",
      icon: "lock",
      children: [
        //
        {
          name: "features",
          href: "/settings/admin/flags",
          trackingMetadata: { section: "admin", page: "features" },
        },
        {
          name: "license",
          href: "/auth/setup?step=1",
          trackingMetadata: { section: "admin", page: "license" },
        },
        {
          name: "apps",
          href: "/settings/admin/apps/calendar",
          trackingMetadata: { section: "admin", page: "apps" },
        },
        {
          name: "users",
          href: "/settings/admin/users",
          trackingMetadata: { section: "admin", page: "users" },
        },
        {
          name: "sms_system",
          href: "/settings/admin/sms",
          trackingMetadata: { section: "admin", page: "sms" },
        },
        {
          name: "platform_webhook_deliveries",
          href: "/settings/admin/webhook-deliveries",
          trackingMetadata: { section: "admin", page: "webhook_deliveries" },
        },
        {
          name: "plan_contact",
          href: "/settings/admin/plan-contact",
          trackingMetadata: { section: "admin", page: "plan_contact" },
        },
        {
          name: "lockedSMS",
          href: "/settings/admin/lockedSMS",
          trackingMetadata: { section: "admin", page: "locked_sms" },
        },
        {
          name: "oAuth",
          href: "/settings/admin/oauth",
          trackingMetadata: { section: "admin", page: "oauth" },
        },
        {
          name: "Playground",
          href: "/settings/admin/playground",
          trackingMetadata: { section: "admin", page: "playground" },
        },
      ],
    },
  ];

  for (const tab of tabs) {
    if (tab.name === "admin" && IS_RONDEVU) {
      tab.children?.push({
        name: "create_org",
        href: "/settings/organizations/new",
        trackingMetadata: { section: "admin", page: "create_org" },
      });

      tab.children?.push({
        name: "create_license_key",
        href: "/settings/license-key/new",
        trackingMetadata: { section: "admin", page: "create_license_key" },
      });
    }
  }

  return tabs;
};

// The following keys are assigned to admin only
const adminRequiredKeys = ["admin"];
const organizationRequiredKeys = ["organization"];
const organizationAdminKeys = [
  "privacy",
  "privacy_and_security",
  "SSO",
  "directory_sync",
  "delegation_credential",
];

interface SettingsPermissions {
  canViewRoles?: boolean;
  canViewOrganizationBilling?: boolean;
  canUpdateOrganization?: boolean;
}

const useTabs = ({
  isDelegationCredentialEnabled,
  isPbacEnabled,
  permissions,
}: {
  isDelegationCredentialEnabled: boolean;
  isPbacEnabled: boolean;
  permissions?: SettingsPermissions;
}) => {
  const session = useSession();
  const { data: user } = trpc.viewer.me.get.useQuery({ includePasswordAdded: true });
  const orgBranding = null as { id?: number; slug?: string; name?: string; logoUrl?: string | null } | null;
  const isAdmin = session.data?.user.role === UserPermissionRole.ADMIN;

  const processTabsMemod = useMemo(() => {
    const processedTabs = getTabs(orgBranding).map((tab) => {
      if (tab.href === "/settings/my-account") {
        return {
          ...tab,
          name: user?.name || "my_account",
          icon: undefined,
          avatar: getUserAvatarUrl(user),
        };
      } else if (tab.href === "/settings/organizations") {
        const newArray = (tab?.children ?? []).filter(
          (child) => permissions?.canUpdateOrganization || !organizationAdminKeys.includes(child.name)
        );

        // Add delegation-credential menu item only if feature flag is enabled
        if (isDelegationCredentialEnabled) {
          newArray.push({
            name: "delegation_credential",
            href: "/settings/organizations/delegation-credential",
            trackingMetadata: { section: "organization", page: "delegation_credential" },
          });
        }

        // Add pbac menu item - show opt-in page if not enabled, regular page if enabled
        if (isPbacEnabled) {
          if (permissions?.canViewRoles) {
            newArray.push({
              name: "roles_and_permissions",
              href: "/settings/organizations/roles",
              trackingMetadata: { section: "organization", page: "roles_and_permissions" },
            });
          }

          if (permissions?.canViewOrganizationBilling) {
            newArray.push({
              name: "billing",
              href: "/settings/organizations/billing",
              trackingMetadata: { section: "organization", page: "billing" },
            });
          }
        } else {
          if (permissions?.canUpdateOrganization) {
            newArray.push({
              name: "billing",
              href: "/settings/organizations/billing",
              trackingMetadata: { section: "organization", page: "billing" },
            });
          }
          // Show roles page (modal will appear if PBAC not enabled)
          if (permissions?.canUpdateOrganization) {
            newArray.push({
              name: "roles",
              href: "/settings/organizations/roles",
              isBadged: true, // Show "New" badge,
              trackingMetadata: { section: "organization", page: "roles" },
            });
          }
        }

        return {
          ...tab,
          children: newArray,
          name: orgBranding?.name || "organization",
          avatar: getPlaceholderAvatar(orgBranding?.logoUrl, orgBranding?.name),
        };
      } else if (
        tab.href === "/settings/security" &&
        user?.identityProvider === IdentityProvider.GOOGLE &&
        !user?.twoFactorEnabled &&
        !user?.passwordAdded
      ) {
        const filtered = tab?.children?.filter(
          (childTab) => childTab.href !== "/settings/security/two-factor-auth"
        );
        return { ...tab, children: filtered };
      } else if (tab.href === "/settings/developer") {
        const filtered = tab?.children?.filter(
          (childTab) => permissions?.canUpdateOrganization || childTab.name !== "api_docs"
        );
        return { ...tab, children: filtered };
      }
      return tab;
    });

    // check if name is in adminRequiredKeys
    return processedTabs.filter((tab) => {
      if (organizationRequiredKeys.includes(tab.name)) return !!orgBranding;
      if (tab.name === "other_teams" && !permissions?.canUpdateOrganization) return false;

      if (isAdmin) return true;
      return !adminRequiredKeys.includes(tab.name);
    });
  }, [isAdmin, orgBranding, user, isDelegationCredentialEnabled, isPbacEnabled, permissions]);

  return processTabsMemod;
};

const BackButtonInSidebar = ({ name }: { name: string }) => {
  return (
    <Link
      href="/event-types"
      className="group mt-3 mb-4 todesktop:mt-10 flex h-8 w-full flex-row items-center gap-2 rounded-md px-2 text-muted-foreground text-sm transition-colors duration-150 hover:bg-accent hover:text-foreground"
      data-testid={`vertical-tab-${name}`}>
      <ArrowLeftIcon className="size-4 shrink-0 rtl:rotate-180" />
      <Skeleton title={name} as="p" className="min-h-4 max-w-36 truncate" loadingClassName="ms-3">
        {name}
      </Skeleton>
    </Link>
  );
};

interface SettingsSidebarContainerProps {
  className?: string;
  navigationIsOpenedOnMobile?: boolean;
  bannersHeight?: number;
  teamFeatures?: Record<number, TeamFeatures>;
  permissions?: SettingsPermissions;
}

const SettingsSidebarContainer = ({
  className = "",
  navigationIsOpenedOnMobile,
  bannersHeight,
  teamFeatures,
  permissions,
}: SettingsSidebarContainerProps) => {
  const { t } = useLocale();

  const tabsWithPermissions = useTabs({
    isDelegationCredentialEnabled: false,
    isPbacEnabled: false,
    permissions,
  });

  return (
    <nav
      style={{ maxHeight: `calc(100vh - ${bannersHeight}px)`, top: `${bannersHeight}px` }}
      className={classNames(
        "no-scrollbar fixed top-0 bottom-0 left-0 z-20 flex max-h-screen w-60 flex-col gap-0.5 overflow-x-hidden overflow-y-scroll bg-sidebar px-2 pb-3 text-sidebar-foreground transition-transform duration-300 max-md:z-10 md:sticky md:flex",
        className,
        navigationIsOpenedOnMobile
          ? "translate-x-0 opacity-100"
          : "-translate-x-full opacity-0 md:translate-x-0 md:opacity-100"
      )}
      aria-label={t("settings_navigation")}>
      <BackButtonInSidebar name={t("back")} />
      {tabsWithPermissions.map((tab) => {
        return (
          <React.Fragment key={tab.href}>
            <div className={`${!tab.children?.length ? "mb-3!" : ""}`}>
              <div className="group flex h-8 w-full flex-row items-center px-2 text-muted-foreground text-xs">
                {tab?.icon && (
                  <Icon
                    name={tab.icon}
                    className="size-3.5 shrink-0 ltr:mr-2 rtl:ml-2"
                  />
                )}
                {}
                {!tab.icon && tab?.avatar && (
                  <Image
                    width={16}
                    height={16}
                    className="rounded-full ltr:mr-2 rtl:ml-2"
                    src={tab?.avatar}
                    alt="Organization Logo"
                  />
                )}
                <Skeleton
                  title={tab.name}
                  as="p"
                  className="truncate font-medium text-muted-foreground text-xs leading-5"
                  loadingClassName="ms-3">
                  {t(tab.name)}
                </Skeleton>
              </div>
            </div>
            <div className="flex flex-col gap-0.5">
              {tab.children?.map((child, index) => (
                <div key={child.href} className="flex items-center gap-2">
                  <VerticalTabItem
                    name={t(child.name)}
                    isExternalLink={child.isExternalLink}
                    href={child.href || "/"}
                    trackingMetadata={child.trackingMetadata}
                    textClassNames="text-sidebar-foreground text-sm leading-none"
                    className={classNames(
                      "ml-0 h-8 min-h-8 w-full px-2 py-0 hover:bg-accent hover:text-foreground [&[aria-current='page']]:bg-accent [&[aria-current='page']]:font-medium [&[aria-current='page']]:text-foreground",
                      tab.children && index === tab.children.length - 1 && "mb-3!"
                    )}
                    disableChevron
                  />
                  {child.isBadged && (
                    <Badge variant="gray" className="font-mono text-[11px]">
                      {t("new")}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </React.Fragment>
        );
      })}
    </nav>
  );
};

const MobileSettingsContainer = (props: { onSideContainerOpen?: () => void }) => {
  const { t } = useLocale();
  const router = useRouter();
  const isStandalone = useIsStandalone();

  if (isStandalone) return null;

  return (
    <nav className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-subtle border-b bg-background/80 px-2 backdrop-blur-xl md:hidden">
      <div className="flex items-center space-x-3">
        <Button StartIcon="menu" color="minimal" variant="icon" onClick={props.onSideContainerOpen}>
          <span className="sr-only">{t("show_navigation")}</span>
        </Button>

        <button
          className="flex items-center gap-2 rounded-md px-3 py-1.5 transition-colors hover:bg-accent"
          onClick={() => router.back()}>
          <ArrowLeftIcon className="size-4 text-muted-foreground" />
          <p className="font-semibold text-foreground tracking-tight">{t("settings")}</p>
        </button>
      </div>
    </nav>
  );
};

type SettingsLayoutProps = {
  children: React.ReactNode;
  containerClassName?: string;
  teamFeatures?: Record<number, TeamFeatures>;
  permissions?: SettingsPermissions;
} & ComponentProps<typeof Shell>;

function SettingsLayoutAppDirClient({ children, teamFeatures, permissions, ...rest }: SettingsLayoutProps) {
  const _pathname = usePathname();
  const state = useState(false);
  const [sideContainerOpen, setSideContainerOpen] = state;

  useEffect(() => {
    const closeSideContainer = () => {
      if (window.innerWidth >= 768) {
        setSideContainerOpen(false);
      }
    };

    window.addEventListener("resize", closeSideContainer);
    return () => {
      window.removeEventListener("resize", closeSideContainer);
    };
  }, [setSideContainerOpen]);

  useEffect(() => {
    setSideContainerOpen((prev) => (prev ? false : prev));
  }, [setSideContainerOpen]);

  return (
    <Shell
      flexChildrenContainer
      {...rest}
      SidebarContainer={
        <SidebarContainerElement
          sideContainerOpen={sideContainerOpen}
          setSideContainerOpen={setSideContainerOpen}
          teamFeatures={teamFeatures}
          permissions={permissions}
        />
      }
      drawerState={state}
      MobileNavigationContainer={null}
      TopNavContainer={
        <MobileSettingsContainer onSideContainerOpen={() => setSideContainerOpen(!sideContainerOpen)} />
      }>
      <div className="flex flex-1 *:flex-1">
        <div
          className={classNames("mx-auto w-full max-w-3xl justify-center", rest.containerClassName)}>
          <ErrorBoundary>{children}</ErrorBoundary>
        </div>
      </div>
    </Shell>
  );
}

type SidebarContainerElementProps = {
  sideContainerOpen: boolean;
  bannersHeight?: number;
  setSideContainerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  teamFeatures?: Record<number, TeamFeatures>;
  permissions?: SettingsPermissions;
};

const SidebarContainerElement = ({
  sideContainerOpen,
  bannersHeight,
  setSideContainerOpen,
  teamFeatures,
  permissions,
}: SidebarContainerElementProps) => {
  const { t } = useLocale();
  return (
    <>
      {/* Mobile backdrop */}
      {sideContainerOpen && (
        <button
          onClick={() => setSideContainerOpen(false)}
          className="fixed top-0 left-0 z-10 h-full w-full bg-foreground/20 backdrop-blur-sm md:hidden">
          <span className="sr-only">{t("hide_navigation")}</span>
        </button>
      )}
      <SettingsSidebarContainer
        navigationIsOpenedOnMobile={sideContainerOpen}
        bannersHeight={bannersHeight}
        teamFeatures={teamFeatures}
        permissions={permissions}
      />
    </>
  );
};

export type { SettingsLayoutProps, SettingsPermissions };
export default SettingsLayoutAppDirClient;
