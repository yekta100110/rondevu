import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { LinkProps } from "next/link";
import Link from "next/link";
import React, { forwardRef } from "react";

import classNames from "@rondevu/ui/classNames";

import { Icon } from "../icon/Icon";
import type { IconName } from "../icon/Icon";
import { Tooltip } from "../tooltip/Tooltip";

type InferredVariantProps = VariantProps<typeof buttonClasses>;

export type ButtonColor = NonNullable<InferredVariantProps["color"]>;
export type ButtonBaseProps = {
  /** Action that happens when the button is clicked */
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  /**Left aligned icon*/
  CustomStartIcon?: React.ReactNode;
  StartIcon?: IconName;
  /**Right aligned icon */
  EndIcon?: IconName;
  shallow?: boolean;
  /**Tool tip used when icon size is set to small */
  tooltip?: string | React.ReactNode;
  tooltipSide?: "top" | "right" | "bottom" | "left";
  tooltipOffset?: number;
  tooltipClassName?: string;
  disabled?: boolean;
  flex?: boolean;
} & Omit<InferredVariantProps, "color"> & {
    color?: ButtonColor;
  };

export type ButtonProps = ButtonBaseProps &
  (
    | (Omit<JSX.IntrinsicElements["a"], "href" | "onClick" | "ref"> & LinkProps)
    | (Omit<JSX.IntrinsicElements["button"], "onClick" | "ref"> & { href?: never })
  );

export const buttonClasses = cva(
  [
    "group relative inline-flex cursor-pointer select-none items-center gap-1.5 whitespace-nowrap rounded-lg border border-transparent bg-clip-padding text-sm font-medium outline-none",
    "transition-[background-color,border-color,color,opacity,scale,rotate] duration-160 ease-[cubic-bezier(0.16,1,0.3,1)]",
    "not-disabled:active:scale-[.97] disabled:cursor-not-allowed disabled:opacity-50",
    "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
  ],
  {
    variants: {
      variant: {
        button: "",
        icon: "flex justify-center",
        fab: "min-w-14 min-h-14 md:min-w-min md:min-h-min rounded-full justify-center md:rounded-lg radix-state-open:rotate-45 md:radix-state-open:rotate-0",
      },
      color: {
        primary: ["bg-brand-default", "text-brand", "not-disabled:hover:bg-brand-default/85"],
        secondary: [
          "bg-default",
          "text-emphasis",
          "border-default",
          "not-disabled:hover:bg-subtle",
          "aria-expanded:bg-subtle",
          "dark:bg-transparent",
        ],
        minimal: [
          "text-subtle",
          "not-disabled:hover:bg-subtle",
          "not-disabled:hover:text-emphasis",
          "aria-expanded:bg-subtle",
          "aria-expanded:text-emphasis",
        ],
        destructive: [
          "border-default",
          "text-error",
          "not-disabled:hover:border-error",
          "not-disabled:hover:bg-error",
          "focus-visible:border-error",
          "focus-visible:ring-destructive/20",
        ],
      },
      size: {
        xs: "h-6 px-2 leading-none text-xs rounded-md",
        sm: "h-7 px-2.5 py-1.5 leading-none text-[0.8125rem] rounded-md" /** For backwards compatibility */,
        base: "px-2.5 py-2 text-sm leading-none",
        lg: "px-3 py-2.5",
      },
      loading: {
        true: "cursor-wait",
      },
    },
    compoundVariants: [
      {
        loading: true,
        color: "primary",
        className: "opacity-60",
      },
      {
        loading: true,
        color: "secondary",
        className: "bg-subtle",
      },
      {
        loading: true,
        color: "minimal",
        className: "bg-subtle",
      },
      {
        loading: true,
        color: "destructive",
        className: "bg-error",
      },
      {
        variant: "icon",
        size: "base",
        className: "h-8 w-8 p-0!",
      },
      {
        variant: "icon",
        size: "xs",
        className: "h-5 w-5 p-1! rounded-md",
      },
      {
        variant: "icon",
        size: "sm",
        className: "h-6 w-6 p-1! rounded-md",
      },
      {
        variant: "icon",
        size: "lg",
        className: "h-9 w-9 p-0!",
      },
      {
        variant: "fab",
        size: "base",
        className: "md:px-4 md:py-2.5",
      },
    ],
    defaultVariants: {
      variant: "button",
      color: "primary",
      size: "base",
    },
  }
);

export const Button = forwardRef<HTMLAnchorElement | HTMLButtonElement, ButtonProps>(function Button(
  props: ButtonProps,
  forwardedRef
) {
  const {
    loading = false,
    color = "primary",
    size,
    variant = "button",
    type = "button",
    tooltipSide = "top",
    tooltipOffset = 4,
    tooltipClassName,
    StartIcon,
    CustomStartIcon,
    EndIcon,
    shallow,
    // attributes propagated from `HTMLAnchorProps` or `HTMLButtonProps`
    ...passThroughProps
  } = props;
  // Buttons are **always** disabled if we're in a `loading` state
  const disabled = props.disabled || loading || false;
  // If pass an `href`-attr is passed it's Link, otherwise it's a `<button />`
  const isLink = typeof props.href !== "undefined";
  const buttonClassName = classNames(buttonClasses({ color, size, loading, variant }), props.className);
  const handleClick = disabled
    ? (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();
      }
    : props.onClick;

  const buttonContent = (
    <>
      {CustomStartIcon ||
        (StartIcon && (
          <>
            {variant === "fab" ? (
              <>
                <Icon name={StartIcon} className="hidden h-4 w-4 shrink-0 stroke-[1.5px]  md:inline-flex" />
                <Icon name="plus" data-testid="plus" className="inline h-6 w-6 shrink-0 md:hidden" />
              </>
            ) : (
              <Icon
                data-name="start-icon"
                name={StartIcon}
                className={classNames(
                  "shrink-0",
                  loading ? "invisible" : "visible",
                  "button-icon",
                  variant === "icon" && "h-4 w-4",
                  variant === "button" && "h-4 w-4 stroke-[1.5px] "
                )}
              />
            )}
          </>
        ))}
      <div
        className={classNames(
          "contents", // This makes the div behave like it doesn't exist in the layout
          loading ? "invisible" : "visible",
          variant === "fab" ? "hidden md:contents" : "")}>
        {props.children}
      </div>
      {loading && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
          <svg
            className={classNames(
              "mx-4 h-4 w-4 animate-spin text-current"
            )}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}
      {EndIcon && (
        <>
          {variant === "fab" ? (
            <>
              <Icon name={EndIcon} className="hidden h-4 w-4 shrink-0 stroke-[1.5px] md:inline-flex" />
              <Icon name="plus" data-testid="plus" className="inline h-6 w-6 shrink-0 md:hidden" />
            </>
          ) : (
            <Icon
              name={EndIcon}
              className={classNames(
                "shrink-0",
                loading ? "invisible" : "visible",
                (EndIcon === "arrow-right" || EndIcon === "chevron-right") &&
                  "transition-transform duration-160 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5",
                variant === "icon" && "h-4 w-4",
                variant === "button" && "h-4 w-4 stroke-[1.5px] "
              )}
            />
          )}
        </>
      )}
    </>
  );

  // Render Link or button separately to avoid type conflicts
  // Link manages its own anchor element, so we don't pass ref to it
  if (isLink) {
    return (
      <Link
        {...(passThroughProps as Omit<JSX.IntrinsicElements["a"], "href" | "onClick" | "ref"> & LinkProps)}
        shallow={shallow && shallow}
        className={buttonClassName}
        onClick={handleClick}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <Wrapper
      data-testid="wrapper"
      tooltip={props.tooltip}
      tooltipSide={tooltipSide}
      tooltipOffset={tooltipOffset}
      tooltipClassName={tooltipClassName}>
      <button
        {...(passThroughProps as Omit<JSX.IntrinsicElements["button"], "onClick" | "ref">)}
        ref={forwardedRef as React.Ref<HTMLButtonElement>}
        disabled={disabled}
        type={type as "button" | "submit" | "reset"}
        className={buttonClassName}
        onClick={handleClick}>
        {buttonContent}
      </button>
    </Wrapper>
  );
});

const Wrapper = ({
  children,
  tooltip,
  tooltipSide,
  tooltipOffset,
  tooltipClassName,
}: {
  tooltip?: string | React.ReactNode;
  children: React.ReactNode;
  tooltipSide?: "top" | "right" | "bottom" | "left";
  tooltipOffset?: number;
  tooltipClassName?: string;
}) => {
  if (!tooltip) {
    return <>{children}</>;
  }

  return (
    <Tooltip
      data-testid="tooltip"
      className={tooltipClassName}
      content={tooltip}
      side={tooltipSide}
      sideOffset={tooltipOffset}>
      {children}
    </Tooltip>
  );
};

Button.displayName = "Button";
