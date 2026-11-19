"use client";

import { ErrorCode } from "@rondevu/features/auth/lib/ErrorCode";
import { APP_NAME, HOSTED_CAL_FEATURES, WEBAPP_URL, WEBSITE_URL } from "@rondevu/lib/constants";
import { emailRegex } from "@rondevu/lib/emailSchema";
import { getSafeRedirectUrl } from "@rondevu/lib/getSafeRedirectUrl";
import { useCompatSearchParams } from "@rondevu/lib/hooks/useCompatSearchParams";
import { useLocale } from "@rondevu/lib/hooks/useLocale";
import { Alert } from "@rondevu/ui/components/alert";
import { Icon } from "@rondevu/ui/components/icon";
import { LastUsed, useLastUsed } from "@rondevu/web/modules/auth/hooks/useLastUsed";
import AddToHomescreen from "@components/AddToHomescreen";
import BackupCode from "@components/auth/BackupCode";
import TwoFactor from "@components/auth/TwoFactor";
import { AuthShell } from "@rondevu/web/modules/auth/components/AuthShell";
import { Button } from "@coss/ui/components/button";
import { Field, FieldLabel } from "@coss/ui/components/field";
import { Input } from "@coss/ui/components/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@coss/ui/components/input-group";
import { Separator } from "@coss/ui/components/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import type { inferSSRProps } from "@lib/types/inferSSRProps";
import type { getServerSideProps } from "@server/lib/auth/login/getServerSideProps";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

interface LoginValues {
  email: string;
  password: string;
  totpCode: string;
  backupCode: string;
  csrfToken: string;
}

const MicrosoftIcon = () => (
  <img className="size-4" src="/microsoft-logo.svg" alt="" />
);

const GoogleIcon = () => (
  <img className="size-4" src="/google-icon-colored.svg" alt="" />
);

export type PageProps = inferSSRProps<typeof getServerSideProps>;
export default function Login({
  csrfToken,
  isGoogleLoginEnabled,
  isOutlookLoginEnabled,
  totpEmail,
}: PageProps) {
  const searchParams = useCompatSearchParams();
  const { t } = useLocale();
  const router = useRouter();
  const formSchema = z
    .object({
      email: z
        .string()
        .min(1, `${t("error_required_field")}`)
        .regex(emailRegex, `${t("auth_email_error_example")}`),
      ...(totpEmail ? {} : { password: z.string().min(1, `${t("error_required_field")}`) }),
    })
    // Passthrough other fields like totpCode
    .passthrough();
  const methods = useForm<LoginValues>({ resolver: zodResolver(formSchema) });
  const { register, formState } = methods;
  const [twoFactorRequired, setTwoFactorRequired] = useState(!!totpEmail || false);
  const [twoFactorLostAccess, setTwoFactorLostAccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUsed, setLastUsed] = useLastUsed();
  const [showPassword, setShowPassword] = useState(false);

  const errorMessages: { [key: string]: string } = {
    // [ErrorCode.SecondFactorRequired]: t("2fa_enabled_instructions"),
    // Don't leak information about whether an email is registered or not
    [ErrorCode.IncorrectEmailPassword]: t("incorrect_email_password"),
    [ErrorCode.IncorrectTwoFactorCode]: `${t("incorrect_2fa_code")} ${t("please_try_again")}`,
    [ErrorCode.InternalServerError]: `${t("something_went_wrong")} ${t("please_try_again_and_contact_us")}`,
    [ErrorCode.ThirdPartyIdentityProviderEnabled]: t("account_created_with_identity_provider"),
  };

  let callbackUrl = searchParams?.get("callbackUrl") || "/event-types";

  if (/"\//.test(callbackUrl)) callbackUrl = callbackUrl.substring(1);

  // If not absolute URL, make it absolute
  if (!/^https?:\/\//.test(callbackUrl)) {
    callbackUrl = `${WEBAPP_URL}/${callbackUrl}`;
  }

  const safeCallbackUrl = getSafeRedirectUrl(callbackUrl);

  callbackUrl = safeCallbackUrl || "";

  const onSubmit = async (values: LoginValues) => {
    setErrorMessage(null);
    // telemetry.event(telemetryEventTypes.login, collectPageParameters());
    const res = await signIn<"credentials">("credentials", {
      ...values,
      callbackUrl,
      redirect: false,
    });
    if (!res) setErrorMessage(errorMessages[ErrorCode.InternalServerError]);
    // we're logged in! let's do a hard refresh to the desired url
    else if (!res.error) {
      setLastUsed("credentials");
      router.push(callbackUrl);
    } else if (res.error === ErrorCode.SecondFactorRequired) setTwoFactorRequired(true);
    else if (res.error === ErrorCode.IncorrectBackupCode) setErrorMessage(t("incorrect_backup_code"));
    else if (res.error === ErrorCode.MissingBackupCodes) setErrorMessage(t("missing_backup_codes"));
    // fallback if error not found
    else setErrorMessage(errorMessages[res.error] || t("something_went_wrong"));
  };

  const showSocialLogin = isGoogleLoginEnabled || isOutlookLoginEnabled;
  const showSignupLink =
    process.env.NEXT_PUBLIC_DISABLE_SIGNUP !== "true" && searchParams?.get("register") !== "false";

  const fieldError = (message?: string) =>
    message ? (
      <p data-testid="field-error" className="text-destructive text-sm">
        {message}
      </p>
    ) : null;

  return (
    <>
      <AuthShell
        title={twoFactorRequired ? t("2fa_code") : t("sign_in")}
        description={
          <span data-testid="login-subtitle">{twoFactorRequired ? APP_NAME : t("welcome_back_sign_in")}</span>
        }
        footer={
          !twoFactorRequired && showSignupLink ? (
            <span>
              {t("auth_no_account")}{" "}
              <Link
                href={
                  callbackUrl
                    ? `${WEBSITE_URL}/signup?redirect=${encodeURIComponent(callbackUrl)}`
                    : `${WEBSITE_URL}/signup`
                }
                className="font-medium text-foreground underline-offset-4 hover:underline">
                {t("create_account")}
              </Link>
            </span>
          ) : null
        }>
        <FormProvider {...methods}>
          {!twoFactorRequired && showSocialLogin && (
            <>
              <div className="flex flex-col gap-2">
                {isGoogleLoginEnabled && (
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={formState.isSubmitting}
                    data-testid="google"
                    onClick={async (e) => {
                      e.preventDefault();
                      setLastUsed("google");
                      await signIn("google", {
                        callbackUrl,
                      });
                    }}>
                    <GoogleIcon />
                    <span>{t("signin_with_google")}</span>
                    {lastUsed === "google" && <LastUsed />}
                  </Button>
                )}
                {isOutlookLoginEnabled && (
                  <Button
                    variant="outline"
                    className="w-full"
                    data-testid="microsoft"
                    onClick={async (e) => {
                      e.preventDefault();
                      setLastUsed("microsoft");
                      await signIn("azure-ad", {
                        callbackUrl,
                      });
                    }}>
                    <MicrosoftIcon />
                    <span>{t("signin_with_microsoft")}</span>
                    {lastUsed === "microsoft" && <LastUsed />}
                  </Button>
                )}
              </div>

              <div className="my-6 flex items-center gap-4">
                <Separator className="flex-1" />
                <span className="text-muted-foreground text-xs">{t("or").toLocaleLowerCase()}</span>
                <Separator className="flex-1" />
              </div>
            </>
          )}

          <form onSubmit={methods.handleSubmit(onSubmit)} noValidate data-testid="login-form">
            <input defaultValue={csrfToken || undefined} type="hidden" hidden {...register("csrfToken")} />

            {!twoFactorRequired && (
              <div className="grid gap-5">
                <Field>
                  <FieldLabel>{t("email")}</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={totpEmail || (searchParams?.get("email") as string)}
                    autoComplete="email"
                    aria-invalid={!!formState.errors.email || undefined}
                    {...register("email")}
                  />
                  {fieldError(formState.errors.email?.message)}
                </Field>

                <Field>
                  <div className="flex w-full items-center justify-between">
                    <FieldLabel>{t("password")}</FieldLabel>
                    <Link
                      href="/auth/forgot-password"
                      className="text-muted-foreground text-sm transition-colors hover:text-foreground">
                      {t("forgot")}
                    </Link>
                  </div>
                  <InputGroup className="overflow-hidden">
                    <InputGroupInput
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      aria-invalid={!!formState.errors.password || undefined}
                      {...register("password")}
                    />
                    <InputGroupAddon align="inline-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? t("hide_password") : t("show_password")}>
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldError(formState.errors.password?.message)}
                </Field>
              </div>
            )}

            {twoFactorRequired && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4">
                {!twoFactorLostAccess ? <TwoFactor center /> : <BackupCode center />}
              </motion.div>
            )}

            {errorMessage && <Alert severity="error" title={errorMessage} className="mt-4" />}

            <Button type="submit" className="mt-6 w-full" disabled={formState.isSubmitting}>
              {twoFactorRequired ? t("submit") : t("continue")}
            </Button>
          </form>

          {twoFactorRequired && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {!totpEmail ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      if (twoFactorLostAccess) {
                        setTwoFactorLostAccess(false);
                        methods.setValue("backupCode", "");
                      } else {
                        setTwoFactorRequired(false);
                        methods.setValue("totpCode", "");
                      }
                      setErrorMessage(null);
                    }}>
                    <Icon name="arrow-left" className="size-4" />
                    {t("go_back")}
                  </Button>
                  {!twoFactorLostAccess && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setTwoFactorLostAccess(true);
                        setErrorMessage(null);
                        methods.setValue("totpCode", "");
                      }}>
                      <Icon name="lock" className="size-4" />
                      {t("lost_access")}
                    </Button>
                  )}
                </>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => {
                    window.location.replace("/");
                  }}>
                  {t("cancel")}
                </Button>
              )}
            </div>
          )}
        </FormProvider>
      </AuthShell>

      <AddToHomescreen />
    </>
  );
}
