import { useLocale } from "@rondevu/lib/hooks/useLocale";
import useMediaQuery from "@rondevu/lib/hooks/useMediaQuery";
import { sessionStorage } from "@rondevu/lib/webstorage";
import classNames from "@rondevu/ui/classNames";
import { Badge } from "@rondevu/ui/components/badge";
import type { IconName } from "@rondevu/ui/components/icon";
import { Icon } from "@rondevu/ui/components/icon";
import { SkeletonText } from "@rondevu/ui/components/skeleton";
import { Tooltip } from "@rondevu/ui/components/tooltip";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";
import type React from "react";
import { Fragment, useEffect, useState } from "react";
import { useShouldDisplayNavigationItem } from "./useShouldDisplayNavigationItem";

const usePersistedExpansionState = (itemName: string) => {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(`nav-expansion-${itemName}`);
    if (stored !== null) {
      setIsExpanded(JSON.parse(stored));
    }
  }, [itemName]);

  const setPersistedExpansion = (expanded: boolean) => {
    setIsExpanded(expanded);
    sessionStorage.setItem(`nav-expansion-${itemName}`, JSON.stringify(expanded));
  };

  return [isExpanded, setPersistedExpansion] as const;
};

const trackNavigationClick = (itemName: string, parentItemName?: string) => {
  posthog.capture("navigation_item_clicked", {
    item_name: itemName,
    parent_name: parentItemName,
  });
};

export type NavigationItemType = {
  name: string;
  href: string;
  isLoading?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  target?: HTMLAnchorElement["target"];
  badge?: React.ReactNode;
  icon?: IconName;
  child?: NavigationItemType[];
  pro?: true;
  onlyMobile?: boolean;
  onlyDesktop?: boolean;
  moreOnMobile?: boolean;
  isCurrent?: ({
    item,
    isChild,
    pathname,
  }: {
    item: Pick<NavigationItemType, "href">;
    isChild?: boolean;
    pathname: string | null;
  }) => boolean;
};

export const NAV_ITEM_BASE =
  "group relative flex h-8 items-center gap-2 rounded-md px-2 text-sm text-sidebar-foreground transition-colors duration-150 md:justify-center lg:justify-start";
export const NAV_ITEM_HOVER = "hover:bg-accent hover:text-foreground";
export const NAV_ITEM_ACTIVE =
  "[&[aria-current='page']]:bg-accent [&[aria-current='page']]:font-medium [&[aria-current='page']]:text-foreground";

const defaultIsCurrent: NavigationItemType["isCurrent"] = ({ isChild, item, pathname }) => {
  return isChild ? item.href === pathname : item.href ? (pathname?.startsWith(item.href) ?? false) : false;
};

export const NavigationItem: React.FC<{
  index?: number;
  item: NavigationItemType;
  isChild?: boolean;
}> = (props) => {
  const { item, isChild } = props;
  const { t, isLocaleReady } = useLocale();
  const pathname = usePathname();
  const isCurrent: NavigationItemType["isCurrent"] = item.isCurrent || defaultIsCurrent;
  const current = isCurrent({ isChild: !!isChild, item, pathname });
  const shouldDisplayNavigationItem = useShouldDisplayNavigationItem(props.item);
  const [isExpanded, setIsExpanded] = usePersistedExpansionState(item.name);

  const isTablet = useMediaQuery("(max-width: 1024px)");
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  if (!shouldDisplayNavigationItem) return null;

  const hasChildren = item.child && item.child.length > 0;
  const hasActiveChild =
    hasChildren && item.child?.some((child) => isCurrent({ isChild: true, item: child, pathname }));
  const shouldShowChildren = isExpanded || hasActiveChild || isCurrent({ pathname, isChild, item });
  const shouldShowChevron = hasChildren && !hasActiveChild;
  const isParentNavigationItem = hasChildren && !isChild;

  return (
    <Fragment>
      {isParentNavigationItem ? (
        <Tooltip
          side="right"
          open={isTooltipOpen}
          content={
            hasChildren ? (
              <div className="stack-y-1 pointer-events-auto flex flex-col p-1">
                <span className="px-2 text-muted-foreground text-xs font-medium">
                  {t(item.name)}
                </span>
                <div className="flex flex-col gap-1">
                  {item.child?.map((childItem) => {
                    const childIsCurrent =
                      typeof childItem.isCurrent === "function"
                        ? childItem.isCurrent({
                            isChild: true,
                            item: childItem,
                            pathname,
                          })
                        : defaultIsCurrent({
                            isChild: true,
                            item: childItem,
                            pathname,
                          });
                    return (
                      <Link
                        key={childItem.name}
                        href={childItem.href}
                        aria-current={childIsCurrent ? "page" : undefined}
                        onClick={() => {
                          setIsTooltipOpen(false);
                          trackNavigationClick(childItem.name, item.name);
                        }}
                        className={classNames(
                          "group relative block rounded-md px-3 py-1 text-sm transition-colors duration-150",
                          childIsCurrent
                            ? "bg-accent font-medium text-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        )}>
                        {t(childItem.name)}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : (
              t(item.name)
            )
          }
          className="lg:hidden">
          <button
            data-test-id={item.name}
            aria-label={t(item.name)}
            aria-expanded={isExpanded}
            aria-current={current ? "page" : undefined}
            onClick={() => {
              if (isTablet && hasChildren) {
                setIsTooltipOpen(!isTooltipOpen);
              } else {
                setIsExpanded(!isExpanded);
              }
            }}
            className={classNames(
              NAV_ITEM_BASE,
              "w-full [&[aria-current='page']]:font-medium [&[aria-current='page']]:text-foreground",
              isLocaleReady ? NAV_ITEM_HOVER : ""
            )}>
            {item.icon && (
              <div className="relative">
                <Icon
                  name={item.isLoading ? "rotate-cw" : item.icon}
                  className={classNames("size-4 shrink-0", item.isLoading && "animate-spin")}
                  aria-hidden="true"
                />
                {shouldShowChevron && (
                  <Icon
                    name={isExpanded ? "chevron-up" : "chevron-down"}
                    className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full bg-sidebar p-0.5 lg:hidden"
                  />
                )}
              </div>
            )}
            {isLocaleReady ? (
              <span
                className="hidden w-full items-center justify-between gap-2 truncate lg:flex"
                data-testid={`${item.name}-test`}>
                {t(item.name)}
                {item.badge && item.badge}
              </span>
            ) : (
              <SkeletonText className="h-[20px] w-full" />
            )}
            {shouldShowChevron && (
              <Icon
                name={isExpanded ? "chevron-up" : "chevron-down"}
                className="ml-auto hidden size-3.5 text-muted-foreground lg:block"
              />
            )}
          </button>
        </Tooltip>
      ) : (
        <Tooltip side="right" content={t(item.name)} className="lg:hidden">
          <Link
            data-test-id={item.name}
            onClick={() => trackNavigationClick(item.name)}
            href={item.href}
            aria-label={t(item.name)}
            target={item.target}
            className={classNames(
              NAV_ITEM_BASE,
              item.child ? "" : NAV_ITEM_ACTIVE,
              isChild && "hidden pl-8 lg:flex",
              isLocaleReady ? NAV_ITEM_HOVER : ""
            )}
            aria-current={current ? "page" : undefined}>
            {item.icon && (
              <Icon
                name={item.isLoading ? "rotate-cw" : item.icon}
                className={classNames("size-4 shrink-0", item.isLoading && "animate-spin")}
                aria-hidden="true"
                aria-current={current ? "page" : undefined}
              />
            )}
            {isLocaleReady ? (
              <span
                className="hidden w-full items-center justify-between gap-2 truncate lg:flex"
                data-testid={`${item.name}-test`}>
                {t(item.name)}
                {item.badge && item.badge}
              </span>
            ) : (
              <SkeletonText className="h-[20px] w-full" />
            )}
          </Link>
        </Tooltip>
      )}
      {hasChildren && (
        <div
          className={classNames(
            "grid transition-all duration-300 ease-in-out",
            shouldShowChildren ? "grid-rows-[1fr] opacity-100 visible" : "grid-rows-[0fr] opacity-0 invisible"
          )}
          aria-hidden={!shouldShowChildren}>
          <div className="mt-0.5 flex flex-col gap-0.5 overflow-hidden">
            {item.child?.map((item, index) => (
              <NavigationItem index={index} key={item.name} item={item} isChild />
            ))}
          </div>
        </div>
      )}
    </Fragment>
  );
};

export const MobileNavigationItem: React.FC<{
  item: NavigationItemType;
  isChild?: boolean;
}> = (props) => {
  const { item, isChild } = props;
  const pathname = usePathname();
  const { t, isLocaleReady } = useLocale();
  const isCurrent: NavigationItemType["isCurrent"] = item.isCurrent || defaultIsCurrent;
  const current = isCurrent({ isChild: !!isChild, item, pathname });
  const shouldDisplayNavigationItem = useShouldDisplayNavigationItem(props.item);

  if (!shouldDisplayNavigationItem) return null;
  return (
    <Link
      key={item.name}
      href={item.href}
      target={item.target}
      className="relative my-1.5 min-w-0 flex-1 rounded-md px-1 py-1.5 text-center text-[11px] text-muted-foreground transition-colors duration-150 hover:text-foreground focus:z-10 [&[aria-current='page']]:font-medium [&[aria-current='page']]:text-foreground"
      aria-current={current ? "page" : undefined}>
      {current && (
        <motion.span
          layoutId="mobile-nav-active"
          className="absolute inset-0 rounded-md bg-accent"
          transition={{ type: "spring", stiffness: 500, damping: 38 }}
          aria-hidden="true"
        />
      )}
      <span className="relative block">
        {item.badge && <span className="absolute -top-1 right-0">{item.badge}</span>}
        {item.icon && (
          <Icon name={item.icon} className="mx-auto mb-1 block size-5 shrink-0" aria-hidden="true" />
        )}
        {isLocaleReady ? <span className="block truncate">{t(item.name)}</span> : <SkeletonText />}
      </span>
    </Link>
  );
};

export const MobileNavigationMoreItem: React.FC<{
  item: NavigationItemType;
  isChild?: boolean;
}> = (props) => {
  const { item } = props;
  const { t, isLocaleReady } = useLocale();
  const shouldDisplayNavigationItem = useShouldDisplayNavigationItem(props.item);
  const [isExpanded, setIsExpanded] = usePersistedExpansionState(item.name);

  if (!shouldDisplayNavigationItem) return null;

  const hasChildren = item.child && item.child.length > 0;
  const isActionItem = !item.href && item.onClick;

  const itemContent = (
    <>
      <span className="flex items-center font-medium text-foreground">
        {item.icon && (
          <Icon name={item.icon} className="h-5 w-5 shrink-0 ltr:mr-3 rtl:ml-3" aria-hidden="true" />
        )}
        {isLocaleReady ? t(item.name) : <SkeletonText />}
      </span>
      {!isActionItem && <Icon name="arrow-right" className="size-4 text-muted-foreground" />}
    </>
  );

  return (
    <li className="border-subtle border-b transition-colors last:border-b-0" key={item.name}>
      {hasChildren ? (
        <>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="hover:bg-accent flex w-full items-center justify-between p-5 text-left transition">
            <span className="flex items-center font-medium text-foreground">
              {item.icon && (
                <Icon name={item.icon} className="h-5 w-5 shrink-0 ltr:mr-3 rtl:ml-3" aria-hidden="true" />
              )}
              {isLocaleReady ? t(item.name) : <SkeletonText />}
            </span>
            <Icon name={isExpanded ? "chevron-up" : "chevron-down"} className="size-4 text-muted-foreground" />
          </button>
          <div
            className={classNames(
              "grid transition-all duration-300 ease-in-out",
              isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            )}>
            <div className="overflow-hidden">
              {item.child && (
                <ul className="bg-subtle">
                  {item.child.map((childItem) => (
                    <li key={childItem.name} className="border-subtle border-t">
                      <Link
                        href={childItem.href}
                        className="hover:bg-muted flex items-center p-4 pl-12 transition">
                        <span className="text-default font-medium">
                          {isLocaleReady ? t(childItem.name) : <SkeletonText />}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      ) : isActionItem ? (
        <button
          onClick={item.onClick}
          className="hover:bg-accent flex w-full items-center justify-between p-5 text-left transition">
          {itemContent}
        </button>
      ) : (
        <Link
          href={item.href}
          target={item.target}
          className="hover:bg-accent flex items-center justify-between p-5 transition">
          {itemContent}
        </Link>
      )}
    </li>
  );
};
