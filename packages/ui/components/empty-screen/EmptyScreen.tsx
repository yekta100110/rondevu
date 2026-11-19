import type { ReactNode } from "react";
import React from "react";

import classNames from "@rondevu/ui/classNames";

import { Button } from "../button";
import type { IconName } from "../icon";
import { Icon } from "../icon";

export function EmptyScreen({
  Icon: icon,
  customIcon,
  avatar,
  headline,
  description,
  buttonText,
  buttonOnClick,
  buttonRaw,
  border = true,
  dashedBorder = true,
  className,
  iconClassName,
  iconWrapperClassName,
  limitWidth = true,
}: {
  Icon?: IconName;
  customIcon?: React.ReactElement;
  avatar?: React.ReactElement;
  headline: string | React.ReactElement;
  description?: string | React.ReactElement;
  buttonText?: string;
  buttonOnClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  buttonRaw?: ReactNode; // Used incase you want to provide your own button.
  border?: boolean;
  dashedBorder?: boolean;
  iconWrapperClassName?: string;
  iconClassName?: string;
  limitWidth?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <>
      <div
        data-testid="empty-screen"
        className={classNames(
          "flex w-full select-none flex-col items-center justify-center rounded-xl p-7 lg:p-16",
          border && "border-default border",
          dashedBorder && "border-dashed",
          className
        )}>
        {!avatar ? null : (
          <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full">{avatar}</div>
        )}

        {!icon ? null : (
          <div
            className={classNames(
              "bg-subtle flex h-12 w-12 items-center justify-center rounded-lg",
              iconWrapperClassName
            )}>
            <Icon
              name={icon}
              className={classNames("text-emphasis inline-block h-5 w-5 stroke-[1.5px]", iconClassName)}
            />
          </div>
        )}
        {!customIcon ? null : <>{customIcon}</>}
        <div className={`flex ${limitWidth ? "max-w-[420px]" : ""}  flex-col items-center`}>
          <h2
            className={classNames(
              "font-display text-emphasis text-center text-lg font-semibold tracking-[-0.02em] normal-nums",
              icon && "mt-4",
              !description && "mb-8"
            )}>
            {headline}
          </h2>
          {description && (
            <div className="text-subtle mb-6 mt-1.5 text-center text-sm font-normal leading-6 text-balance">
              {description}
            </div>
          )}
          {buttonOnClick && buttonText && <Button onClick={(e) => buttonOnClick(e)}>{buttonText}</Button>}
          {buttonRaw}
        </div>
      </div>
    </>
  );
}
