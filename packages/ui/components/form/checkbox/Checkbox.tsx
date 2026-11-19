import classNames from "@rondevu/ui/classNames";
import { CheckIcon } from "@coss/ui/icons";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { useId } from "@radix-ui/react-id";
import type { InputHTMLAttributes } from "react";
import React, { forwardRef } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: React.ReactNode;
  description?: string;
  descriptionAsLabel?: boolean;
  informationIconText?: string;
  error?: boolean;
  className?: string;
  descriptionClassName?: string;
  /**
   * Accepts this special property instead of allowing description itself to be accidentally used in dangerous way.
   */
  descriptionAsSafeHtml?: string;
};

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={classNames(
      "border-emphasis data-[state=checked]:border-brand-default data-[state=checked]:bg-brand-default data-[state=checked]:text-brand peer h-4 w-4 shrink-0 rounded-[4px] border outline-none transition-colors duration-160 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}>
    <CheckboxPrimitive.Indicator className={classNames("flex items-center justify-center text-current")}>
      <CheckIcon className="h-3.5 w-3.5" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

const CheckboxField = forwardRef<HTMLInputElement, Props>(
  ({ label, description, error, disabled, descriptionAsSafeHtml, ...rest }, ref) => {
    const descriptionAsLabel = !label || rest.descriptionAsLabel;
    const id = useId();
    return (
      <div className="block items-center sm:flex">
        {label && (
          <div className="min-w-48 mb-4 sm:mb-0">
            {React.createElement(
              descriptionAsLabel ? "div" : "label",
              {
                className: classNames("flex text-sm font-medium text-emphasis"),
                ...(!descriptionAsLabel
                  ? {
                      htmlFor: rest.id ? rest.id : id,
                    }
                  : {}),
              },
              label
            )}
          </div>
        )}
        <div className="w-full">
          <div className="hover:bg-subtle relative flex w-fit items-center rounded-md p-1">
            {React.createElement(
              descriptionAsLabel ? "label" : "div",
              {
                className: classNames(
                  "relative flex items-start",
                  !error && descriptionAsLabel ? "text-emphasis" : "text-emphasis",
                  error && "text-error"
                ),
              },
              <>
                <div className="flex h-5 items-center">
                  <input
                    {...rest}
                    ref={ref}
                    type="checkbox"
                    disabled={disabled}
                    id={rest.id ? rest.id : id}
                    className={classNames(
                      "text-brand-default border-emphasis bg-default checked:border-transparent! checked:bg-brand-default! h-4 w-4 rounded-[4px] transition-colors duration-160 focus:outline-none focus:ring-0 focus-visible:ring-3 focus-visible:ring-ring/50 ltr:mr-2 rtl:ml-2",
                      !error && disabled
                        ? "cursor-not-allowed opacity-50"
                        : "hover:bg-subtle hover:border-emphasis",
                      error &&
                        "border-error hover:bg-error hover:border-error checked:bg-dark-error! checked:hover:border-error",
                      rest.className
                    )}
                  />
                </div>
                {descriptionAsSafeHtml ? (
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: Content is sanitized via descriptionAsSafeHtml prop
                  <span
                    className={classNames(
                      "text-default ml-2 text-sm [&_a]:text-emphasis [&_a]:underline [&_a]:underline-offset-4",
                      !label && "font-medium",
                      rest.descriptionClassName
                    )}
                    dangerouslySetInnerHTML={{
                      __html: descriptionAsSafeHtml,
                    }}
                  />
                ) : (
                  <span
                    className={classNames(
                      "text-default ml-2 text-sm",
                      !label && "font-medium",
                      rest.descriptionClassName
                    )}>
                    {description}
                  </span>
                )}
              </>
            )}
            {/* {informationIconText && <InfoBadge content={informationIconText}></InfoBadge>} */}
          </div>
        </div>
      </div>
    );
  }
);

CheckboxField.displayName = "CheckboxField";

export { Checkbox, CheckboxField };
