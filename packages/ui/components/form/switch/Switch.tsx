import cx from "@rondevu/ui/classNames";
import { useId } from "@radix-ui/react-id";
import * as Label from "@radix-ui/react-label";
import * as PrimitiveSwitch from "@radix-ui/react-switch";
import type React from "react";
import type { ReactNode } from "react";
import { Tooltip } from "../../tooltip";

const Wrapper = ({ children, tooltip }: { tooltip?: string; children: React.ReactNode }) => {
  if (!tooltip) {
    return <>{children}</>;
  }
  return <Tooltip content={tooltip}>{children}</Tooltip>;
};
export const Switch = (
  props: React.ComponentProps<typeof PrimitiveSwitch.Root> & {
    label?: string | ReactNode;
    fitToHeight?: boolean;
    disabled?: boolean;
    tooltip?: string;
    labelOnLeading?: boolean;
    size?: "base" | "sm";
    classNames?: {
      container?: string;
      thumb?: string;
    };
    LockedIcon?: React.ReactNode;
    padding?: boolean;
  }
) => {
  const {
    label,
    fitToHeight,
    classNames,
    labelOnLeading,
    LockedIcon,
    padding,
    size = "base",
    ...primitiveProps
  } = props;
  const id = useId();
  return (
    <Wrapper tooltip={props.tooltip}>
      <div
        className={cx(
          "flex h-auto w-fit flex-row items-center",
          fitToHeight && "h-fit",
          labelOnLeading && "flex-row-reverse justify-between",
          padding && "hover:bg-subtle rounded-md p-1.5",
          classNames?.container
        )}>
        {LockedIcon && <div className="mr-2">{LockedIcon}</div>}
        <PrimitiveSwitch.Root
          {...primitiveProps}
          id={id}
          className={cx(
            "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border border-transparent outline-none transition-colors duration-160",
            "data-[state=checked]:bg-brand-default data-[state=unchecked]:bg-emphasis",
            "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
            size === "sm" ? "h-[14px] w-6" : "h-[18.4px] w-8",
            classNames?.container
          )}>
          <PrimitiveSwitch.Thumb
            className={cx(
              "bg-default data-[state=checked]:bg-(--rondevu-brand-text) pointer-events-none block rounded-full ring-0 transition-transform duration-160 ease-[cubic-bezier(0.16,1,0.3,1)]",
              size === "sm"
                ? "h-3 w-3 data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0 rtl:data-[state=checked]:-translate-x-[calc(100%-2px)]"
                : "h-4 w-4 data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0 rtl:data-[state=checked]:-translate-x-[calc(100%-2px)]",
              classNames?.thumb
            )}
          />
        </PrimitiveSwitch.Root>
        {label && (
          <Label.Root
            htmlFor={id}
            className={cx(
              "text-emphasis font-medium",
              size === "sm" ? "m-1 text-xs" : labelOnLeading ? "mr-2 text-sm" : "ml-2 text-sm",
              primitiveProps.disabled ? "cursor-not-allowed opacity-25" : "cursor-pointer",
              labelOnLeading && "flex-1"
            )}>
            {label}
          </Label.Root>
        )}
      </div>
    </Wrapper>
  );
};
