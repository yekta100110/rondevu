import { useBookerStoreContext } from "@calcom/features/bookings/Booker/BookerStoreProvider";
import { Dialog } from "@calcom/features/components/controlled-dialog";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import isSmsCalEmail from "@calcom/lib/isSmsCalEmail";
import classNames from "@calcom/ui/classNames";
import { Button } from "@calcom/ui/components/button";
import { DialogClose, DialogContent, DialogFooter, DialogHeader } from "@calcom/ui/components/dialog";
import { Input, Label } from "@calcom/ui/components/form";
import { InfoIcon } from "@coss/ui/icons";
import type { Dispatch, SetStateAction } from "react";
import { useCallback, useEffect, useState } from "react";
import useDigitInput from "react-digit-input";

export const VerifyCodeDialog = ({
  isOpenDialog,
  setIsOpenDialog,
  email,
  isUserSessionRequiredToVerify = true,
  verifyCodeWithSessionNotRequired,
  verifyCodeWithSessionRequired,
  resetErrors,
  setIsPending,
  isPending,
  error,
  onResendCode,
  onDismiss,
}: {
  isOpenDialog: boolean;
  setIsOpenDialog: Dispatch<SetStateAction<boolean>>;
  email: string;
  isUserSessionRequiredToVerify?: boolean;
  verifyCodeWithSessionNotRequired: (code: string, email: string) => void;
  verifyCodeWithSessionRequired: (code: string, email: string) => void;
  resetErrors: () => void;
  isPending: boolean;
  setIsPending: (status: boolean) => void;
  error: string;
  onResendCode?: () => void | Promise<void>;
  onDismiss?: () => void;
}) => {
  const { t } = useLocale();
  const [value, setValue] = useState("");
  const [hasVerified, setHasVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const setVerificationCode = useBookerStoreContext((state) => state.setVerificationCode);

  const isSms = Boolean(email && isSmsCalEmail(email));

  const cleanupAndDismiss = useCallback(() => {
    setIsOpenDialog(false);
    setValue("");
    setHasVerified(false);
    setIsPending(false);
    resetErrors();
    onDismiss?.();
  }, [setIsOpenDialog, setIsPending, resetErrors, onDismiss]);

  // Start 60-second cooldown timer when dialog opens
  useEffect(() => {
    if (!isOpenDialog) {
      setValue("");
      setHasVerified(false);
      setIsPending(false);
      resetErrors();
      return;
    }

    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpenDialog, setIsPending, resetErrors]);

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending || !onResendCode) return;
    try {
      setIsResending(true);
      resetErrors();
      setValue("");
      setHasVerified(false);
      setIsPending(false);
      await onResendCode();
      setResendCooldown(60);
    } catch (err) {
      console.error("Failed to resend code:", err);
    } finally {
      setIsResending(false);
    }
  };

  const digits = useDigitInput({
    acceptedCharacters: /^[0-9]$/,
    length: 6,
    value,
    onChange: useCallback(
      (newVal: string) => {
        resetErrors();
        setValue(newVal);
      },
      [resetErrors]
    ),
  });

  const verifyCode = useCallback(() => {
    resetErrors();
    setIsPending(true);
    if (isUserSessionRequiredToVerify) {
      verifyCodeWithSessionRequired(value, email);
    } else {
      verifyCodeWithSessionNotRequired(value, email);
    }
    setVerificationCode(value);
    setHasVerified(true);
  }, [
    resetErrors,
    setIsPending,
    isUserSessionRequiredToVerify,
    verifyCodeWithSessionRequired,
    value,
    email,
    verifyCodeWithSessionNotRequired,
    setVerificationCode,
  ]);

  useEffect(() => {
    if (hasVerified || error || isPending || !/^\d{6}$/.test(value.trim())) return;
    verifyCode();
  }, [error, isPending, value, hasVerified, verifyCode]);

  const digitClassName =
    "h-12 w-12 text-center text-xl! text-emphasis caret-emphasis [-webkit-text-fill-color:currentColor]";

  return (
    <Dialog
      open={isOpenDialog}
      onOpenChange={(open) => {
        if (!open) {
          cleanupAndDismiss();
        }
      }}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-row">
          <div className="w-full">
            <DialogHeader
              title={isSms ? "Telefon Numaranızı Doğrulayın" : t("verify_your_email")}
              subtitle={
                isSms
                  ? `${email.split("@")[0]} numaralı telefonunuza iletilen 6 haneli doğrulama kodunu girin.`
                  : t("enter_digit_code", { email })
              }
            />
            <Label htmlFor="code" className="mt-4 block font-medium text-emphasis text-sm">
              {t("code")}
            </Label>
            <div className="mt-2 flex flex-row justify-between gap-1.5">
              <Input
                className={digitClassName}
                name="2fa1"
                inputMode="decimal"
                {...digits[0]}
                autoFocus
                autoComplete="one-time-code"
              />
              <Input className={digitClassName} name="2fa2" inputMode="decimal" {...digits[1]} />
              <Input className={digitClassName} name="2fa3" inputMode="decimal" {...digits[2]} />
              <Input className={digitClassName} name="2fa4" inputMode="decimal" {...digits[3]} />
              <Input className={digitClassName} name="2fa5" inputMode="decimal" {...digits[4]} />
              <Input className={digitClassName} name="2fa6" inputMode="decimal" {...digits[5]} />
            </div>

            {error && (
              <div className="mt-3 flex items-center gap-x-2 text-red-600 text-sm">
                <div>
                  <InfoIcon className="h-4 w-4" />
                </div>
                <p>{error}</p>
              </div>
            )}

            {onResendCode && (
              <div className="mt-4 flex items-center justify-between border-subtle border-t pt-3 text-xs">
                <span className="text-subtle">Kodu almadınız mı?</span>
                <button
                  type="button"
                  disabled={resendCooldown > 0 || isResending}
                  onClick={handleResend}
                  className={classNames(
                    "font-medium transition-colors",
                    resendCooldown > 0 || isResending
                      ? "cursor-not-allowed text-muted"
                      : "cursor-pointer text-emphasis hover:underline"
                  )}>
                  {isResending
                    ? "Gönderiliyor..."
                    : resendCooldown > 0
                      ? `Tekrar Kod Gönder (${resendCooldown}s)`
                      : "Tekrar Kod Gönder"}
                </button>
              </div>
            )}

            <DialogFooter noSticky className="mt-6 flex justify-end gap-2">
              <DialogClose onClick={cleanupAndDismiss} />
              <Button type="submit" onClick={verifyCode} loading={isPending}>
                {t("submit")}
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
