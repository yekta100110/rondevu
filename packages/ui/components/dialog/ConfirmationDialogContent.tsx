import { useLocale } from "@rondevu/lib/hooks/useLocale";
import { CheckIcon, CircleAlertIcon } from "@coss/ui/icons";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import type React from "react";
import type { PropsWithChildren, ReactElement } from "react";
import { DialogClose, DialogContent } from "./Dialog";

type ConfirmBtnType =
  | { confirmBtn?: never; confirmBtnText?: string }
  | { confirmBtnText?: never; confirmBtn?: ReactElement };

export type ConfirmationDialogContentProps = {
  cancelBtnText?: string;
  isPending?: boolean;
  loadingText?: string;
  onConfirm?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  title: string;
  variety?: "danger" | "warning" | "success";
} & ConfirmBtnType;

export function ConfirmationDialogContent(props: PropsWithChildren<ConfirmationDialogContentProps>) {
  return (
    <DialogContent type="creation">
      <ConfirmationContent {...props} />
    </DialogContent>
  );
}

export const ConfirmationContent = (props: PropsWithChildren<ConfirmationDialogContentProps>) => {
  const { t } = useLocale();
  const {
    title,
    variety,
    confirmBtn = null,
    confirmBtnText = t("confirm"),
    cancelBtnText = t("cancel"),
    loadingText = t("loading"),
    isPending = false,
    onConfirm,
    children,
  } = props;

  return (
    <>
      <div className="flex">
        {variety && (
          <div className="mt-0.5 ltr:mr-3">
            {variety === "danger" && (
              <div className="bg-error mx-auto rounded-full p-2 text-center">
                <CircleAlertIcon className="text-error h-5 w-5" />
              </div>
            )}
            {variety === "warning" && (
              <div className="bg-subtle mx-auto rounded-full p-2 text-center">
                <CircleAlertIcon className="text-emphasis h-5 w-5" />
              </div>
            )}
            {variety === "success" && (
              <div className="bg-subtle mx-auto rounded-full p-2 text-center">
                <CheckIcon className="text-emphasis h-5 w-5" />
              </div>
            )}
          </div>
        )}
        <div className="w-full">
          <DialogPrimitive.Title className="font-display text-emphasis mt-1 text-lg font-semibold tracking-[-0.02em]">
            {title}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description asChild>
            <div className="text-subtle text-sm">{children}</div>
          </DialogPrimitive.Description>
        </div>
      </div>
      <div className="my-5 flex flex-row-reverse gap-x-2 sm:my-8">
        {confirmBtn ? (
          confirmBtn
        ) : (
          <DialogClose
            color="primary"
            loading={isPending}
            onClick={(e) => onConfirm && onConfirm(e)}
            data-testid="dialog-confirmation">
            {isPending ? loadingText : confirmBtnText}
          </DialogClose>
        )}
        <DialogClose disabled={isPending}>{cancelBtnText}</DialogClose>
      </div>
    </>
  );
};
