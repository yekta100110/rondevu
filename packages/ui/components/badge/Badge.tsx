import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import React from "react";

import classNames from "@rondevu/ui/classNames";

import { Icon } from "../icon";
import type { IconName } from "../icon";

// Monochrome per docs/design-system.md §7: state is told by fill, outline and weight, not hue.
// Colored variant names are kept for API compatibility and map onto neutral equivalents; only error stays red.
export const badgeStyles = cva(
  "inline-flex items-center justify-center gap-x-1 whitespace-nowrap rounded-full border font-medium transition-colors duration-160",
  {
    variants: {
      variant: {
        default: "border-transparent bg-subtle text-emphasis",
        gray: "border-transparent bg-subtle text-emphasis",
        grayWithoutHover: "border-transparent bg-subtle text-default",
        success: "border-default bg-default text-emphasis",
        green: "border-default bg-default text-emphasis",
        blue: "border-default bg-default text-default",
        warning: "border-dashed border-emphasis bg-default text-default",
        orange: "border-dashed border-emphasis bg-default text-default",
        purple: "border-transparent bg-inverted text-inverted",
        red: "border-semantic-error-subtle bg-error text-error",
        error: "border-semantic-error-subtle bg-error text-error",
      },
      size: {
        sm: "h-4 px-1.5 text-[10px] leading-none",
        md: "h-5 px-2 text-xs leading-none",
        lg: "h-6 px-2.5 text-sm leading-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

const dotStyles: Record<NonNullable<VariantProps<typeof badgeStyles>["variant"]>, string> = {
  default: "bg-current",
  gray: "bg-current",
  grayWithoutHover: "bg-current",
  success: "bg-current",
  green: "bg-current",
  blue: "bg-current opacity-60",
  warning: "ring-1 ring-current ring-inset",
  orange: "ring-1 ring-current ring-inset",
  purple: "bg-current",
  red: "bg-current",
  error: "bg-current",
};

type InferredBadgeStyles = VariantProps<typeof badgeStyles>;

type IconOrDot =
  | {
      startIcon?: IconName;
      withDot?: never;
      customDot?: never;
    }
  | { startIcon?: never; withDot?: true; customDot?: never }
  | { startIcon?: never; withDot?: never; customDot?: React.ReactNode };

export type BadgeBaseProps = InferredBadgeStyles & {
  children: React.ReactNode;
  rounded?: boolean;
  customStartIcon?: React.ReactNode;
  customDot?: React.ReactNode;
} & IconOrDot;

export type BadgeProps =
  /**
   * This union type helps TypeScript understand that there's two options for this component:
   * Either it's a div element on which the onClick prop is not allowed, or it's a button element
   * on which the onClick prop is required. This is because the onClick prop is used to determine
   * whether the component should be a button or a div.
   */
  | (BadgeBaseProps & Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> & { onClick?: never })
  | (BadgeBaseProps & Omit<React.HTMLAttributes<HTMLButtonElement>, "onClick"> & { onClick: () => void });

export const Badge = function Badge(props: BadgeProps) {
  const {
    customStartIcon,
    variant,
    className,
    size,
    startIcon,
    withDot,
    children,
    rounded,
    customDot,
    ...passThroughProps
  } = props;
  const isButton = "onClick" in passThroughProps && passThroughProps.onClick !== undefined;
  const StartIcon = startIcon;
  const classes = classNames(
    badgeStyles({ variant, size }),
    rounded && "h-5 w-5 rounded-full p-0",
    className
  );

  const Children = () => (
    <>
      {withDot ? (
        <span
          aria-hidden="true"
          data-testid="go-primitive-dot"
          className={classNames("size-1.5 shrink-0 rounded-full", dotStyles[variant ?? "default"])}
        />
      ) : null}
      {customStartIcon ||
        (StartIcon ? (
          <Icon
            name={StartIcon}
            data-testid="start-icon"
            className="stroke-[3px]"
            style={{ width: 12, height: 12 }}
          />
        ) : null)}
      {children}
    </>
  );

  const Wrapper = isButton ? "button" : "div";

  return React.createElement(Wrapper, { ...passThroughProps, className: classes }, <Children />);
};
