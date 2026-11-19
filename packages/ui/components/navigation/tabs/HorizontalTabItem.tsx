import { motion } from "framer-motion";
import Link from "next/link";

import { useLocale } from "@rondevu/lib/hooks/useLocale";
import { useUrlMatchesCurrentUrl } from "@rondevu/lib/hooks/useUrlMatchesCurrentUrl";
import classNames from "@rondevu/ui/classNames";

import { Avatar } from "../../avatar";
import { Icon } from "../../icon";
import type { IconName } from "../../icon";

export type HorizontalTabItemProps = {
  name: string;
  disabled?: boolean;
  className?: string;
  target?: string;
  href: string;
  linkShallow?: boolean;
  linkScroll?: boolean;
  icon?: IconName;
  avatar?: string;
  onClick?: (name: string) => void;
  isActive?: boolean;
  "data-testid"?: string;
  matchFullPath?: boolean;
};

const HorizontalTabItem = function ({
  name,
  href,
  linkShallow,
  linkScroll,
  avatar,
  matchFullPath,
  ...props
}: HorizontalTabItemProps) {
  const isCurrent = useUrlMatchesCurrentUrl(href, matchFullPath) || props?.isActive;
  const { t } = useLocale();

  return (
    <Link
      onClick={(e) => {
        if (props.onClick) {
          e.preventDefault();
          props.onClick(name);
        }
      }}
      key={name}
      href={href}
      shallow={linkShallow}
      scroll={linkScroll}
      aria-disabled={props.disabled ? "true" : undefined}
      className={classNames(
        isCurrent ? "text-emphasis" : "text-subtle hover:text-emphasis",
        "relative inline-flex h-8 items-center justify-center whitespace-nowrap rounded-md px-2.5 text-sm font-medium leading-none outline-none transition-colors duration-160 focus-visible:ring-3 focus-visible:ring-ring/50 md:mb-0",
        props.disabled && "pointer-events-none opacity-30!",
        props.className
      )}
      target={props.target ? props.target : undefined}
      data-testid={`horizontal-tab-${props["data-testid"]}`}
      aria-current={isCurrent ? "page" : undefined}>
      {isCurrent && (
        <motion.span
          layoutId="horizontal-tab-pill"
          aria-hidden="true"
          className="absolute inset-0 rounded-md bg-subtle"
          transition={{ type: "spring", stiffness: 500, damping: 38 }}
        />
      )}
      <span className="relative inline-flex items-center">
      {props.icon && (
        <Icon
          name={props.icon}
          className={classNames("-ml-0.5 me-2 hidden h-4 w-4 text-inherit sm:inline-block")}
          aria-hidden="true"
        />
      )}
      {avatar && <Avatar size="xs" imageSrc={avatar} alt="avatar" className="-ml-0.5 me-1" />} {t(name)}
      </span>
    </Link>
  );
};

export default HorizontalTabItem;
