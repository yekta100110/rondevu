"use client";

// eslint-disable-next-line no-restricted-imports
import { debounce } from "lodash";
import Link from "next/link";
import type { SyntheticEvent } from "react";
import React from "react";

import { useLocale } from "@rondevu/lib/hooks/useLocale";
import { Button } from "@rondevu/ui/components/button";
import { EmailField } from "@rondevu/ui/components/form";

import { AuthShell } from "@rondevu/web/modules/auth/components/AuthShell";

export type PageProps = {
  csrfToken?: string;
};

export default function ForgotPassword(props: PageProps) {
  const csrfToken = "csrfToken" in props ? (props.csrfToken as string) : undefined;
  const { t } = useLocale();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<{ message: string } | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [email, setEmail] = React.useState("");

  const handleChange = (e: SyntheticEvent) => {
    const target = e.target as typeof e.target & { value: string };
    setEmail(target.value);
  };

  const submitForgotPasswordRequest = async ({ email }: { email: string }) => {
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json);
      } else {
        setSuccess(true);
      }

      return json;
    } catch (reason) {
      setError({ message: t("unexpected_error_try_again") });
    } finally {
      setLoading(false);
    }
  };

  const submitRef = React.useRef(submitForgotPasswordRequest);
  submitRef.current = submitForgotPasswordRequest;

  const debouncedHandleSubmitPasswordRequest = React.useRef(
    debounce((args: { email: string }) => submitRef.current(args), 250)
  ).current;

  React.useEffect(() => {
    return () => debouncedHandleSubmitPasswordRequest.cancel();
  }, []);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!email) {
      return;
    }

    if (loading) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    debouncedHandleSubmitPasswordRequest({ email });
  };

  const Success = () => {
    return (
      <div className="stack-y-6 text-sm leading-normal">
        <p>{t("password_reset_email", { email })}</p>
        <p className="text-muted-foreground">{t("password_reset_leading")}</p>
        {error && <p className="text-center text-destructive text-sm">{error.message}</p>}
        <Button color="secondary" className="w-full justify-center" href="/auth/login">
          {t("back_to_signin")}
        </Button>
      </div>
    );
  };

  return (
    <AuthShell
      title={!success ? t("forgot_password") : t("reset_link_sent")}
      description={!success ? t("auth_forgot_password_description") : undefined}
      footer={
        !success && (
          <Link href="/auth/login" className="font-medium text-foreground underline-offset-4 hover:underline">
            {t("back_to_signin")}
          </Link>
        )
      }>
      {success && <Success />}
      {!success && (
        <>
          {error && <p className="mb-4 text-destructive text-sm">{error.message}</p>}
          <form
            className="stack-y-6"
            onSubmit={handleSubmit}
            action="#">
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} hidden />
            <EmailField
              onChange={handleChange}
              id="email"
              name="email"
              label={t("email_address")}
              placeholder="ad@alanadi.com"
              required
            />
            <div className="stack-y-2">
              <Button
                className="w-full justify-center"
                type="submit"
                color="secondary"
                disabled={loading}
                aria-label={t("request_password_reset")}
                loading={loading}>
                {t("request_password_reset")}
              </Button>
            </div>
          </form>
        </>
      )}
    </AuthShell>
  );
}
