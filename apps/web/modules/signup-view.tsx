"use client";

import getStripe from "@rondevu/app-store/stripepayment/lib/client";
import { getPremiumPlanPriceValue } from "@rondevu/app-store/stripepayment/lib/utils";
import {
  fetchSignup,
  hasCheckoutSession,
  isAccountUnderReview,
  isUserAlreadyExistsError,
} from "@rondevu/features/auth/signup/lib/fetchSignup";
import { getOrgUsernameFromEmail } from "@rondevu/features/auth/signup/utils/getOrgUsernameFromEmail";
import ServerTrans from "@rondevu/lib/components/ServerTrans";
import {
  APP_NAME,
  CLOUDFLARE_SITE_ID,
  IS_RONDEVU,
  URL_PROTOCOL_REGEX,
  WEBAPP_URL,
  WEBSITE_PRIVACY_POLICY_URL,
  WEBSITE_TERMS_URL,
  WEBSITE_URL,
} from "@rondevu/lib/constants";
import { isENVDev } from "@rondevu/lib/env";
import { fetchUsername } from "@rondevu/lib/fetchUsername";
import { pushGTMEvent } from "@rondevu/lib/gtm";
import { useCompatSearchParams } from "@rondevu/lib/hooks/useCompatSearchParams";
import { useDebounce } from "@rondevu/lib/hooks/useDebounce";
import { useLocale } from "@rondevu/lib/hooks/useLocale";
import { INVALID_CLOUDFLARE_TOKEN_ERROR } from "@rondevu/lib/server/checkCfTurnstileToken";
import { IS_EUROPE } from "@rondevu/lib/timezoneConstants";
import { signupSchema as apiSignupSchema } from "@rondevu/prisma/zod-utils";
import type { inferSSRProps } from "@rondevu/types/inferSSRProps";
import classNames from "@rondevu/ui/classNames";
import { Alert } from "@rondevu/ui/components/alert";
import { Button } from "@rondevu/ui/components/button";
import { CheckboxField, Form, PasswordField, SelectField, TextField } from "@rondevu/ui/components/form";
import { showToast } from "@rondevu/ui/components/toast";
import { InfoIcon, ShieldCheckIcon, StarIcon } from "@coss/ui/icons";
import { Analytics as DubAnalytics } from "@dub/analytics/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { getServerSideProps } from "@lib/signup/getServerSideProps";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { signIn } from "next-auth/react";
import posthog from "posthog-js";
import { useEffect, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm, useFormContext } from "react-hook-form";
import { Toaster } from "sonner";
import { z } from "zod";

const signupSchema = apiSignupSchema.extend({
  apiError: z.string().optional(), // Needed to display API errors doesn't get passed to the API
  cfToken: z.string().optional(),
});

const TurnstileCaptcha = dynamic(() => import("@rondevu/web/modules/auth/components/Turnstile"), {
  ssr: false,
});

type FormValues = z.infer<typeof signupSchema>;

export type SignupProps = inferSSRProps<typeof getServerSideProps>;

function truncateDomain(domain: string) {
  const maxLength = 25;
  const cleanDomain = domain.replace(URL_PROTOCOL_REGEX, "");

  if (cleanDomain.length <= maxLength) {
    return cleanDomain;
  }

  return `${cleanDomain.substring(0, maxLength - 3)}.../`;
}

function UsernameField({
  username,
  setPremium,
  premium,
  setUsernameTaken,
  orgSlug,
  usernameTaken,
  disabled,
  ...props
}: React.ComponentProps<typeof TextField> & {
  username: string;
  setPremium: (value: boolean) => void;
  premium: boolean;
  usernameTaken: boolean;
  orgSlug?: string;
  setUsernameTaken: (value: boolean) => void;
}) {
  const { t } = useLocale();
  const { register, formState } = useFormContext<FormValues>();
  const debouncedUsername = useDebounce(username, 600);

  useEffect(() => {
    if (formState.isSubmitting || formState.isSubmitSuccessful) return;

    async function checkUsername() {
      // If the username can't be changed, there is no point in doing the username availability check
      if (disabled) return;
      if (!debouncedUsername) {
        setPremium(false);
        setUsernameTaken(false);
        return;
      }
      fetchUsername(debouncedUsername, orgSlug ?? null).then(({ data }) => {
        setPremium(data.premium);
        setUsernameTaken(!data.available);
      });
    }
    checkUsername();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    debouncedUsername,
    disabled,
    orgSlug,
    formState.isSubmitting,
    formState.isSubmitSuccessful,
    setPremium,
    setUsernameTaken,
  ]);

  return (
    <div>
      <TextField
        disabled={disabled}
        {...props}
        {...register("username")}
        data-testid="signup-usernamefield"
      />
      {(!formState.isSubmitting || !formState.isSubmitted) && (
        <div className="flex items-center text-default text-gray text-sm">
          <div className="text-sm">
            {usernameTaken ? (
              <div className="flex items-center text-error">
                <InfoIcon className="mr-1 inline-block h-4 w-4" />
                <p>{t("already_in_use_error")}</p>
              </div>
            ) : premium ? (
              <div data-testid="premium-username-warning" className="flex items-center">
                <StarIcon className="mr-1 inline-block h-4 w-4" />
                <p>
                  {t("premium_username", {
                    price: getPremiumPlanPriceValue(),
                    interpolation: { escapeValue: false },
                  })}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

function addOrUpdateQueryParam(url: string, key: string, value: string) {
  const separator = url.includes("?") ? "&" : "?";
  const param = `${key}=${encodeURIComponent(value)}`;
  return `${url}${separator}${param}`;
}

export default function Signup({
  prepopulateFormValues,
  token,
  orgSlug,
  isGoogleLoginEnabled,
  isOutlookLoginEnabled,
  orgAutoAcceptEmail,
  redirectUrl,
  emailVerificationEnabled,
  onboardingV3Enabled,
}: SignupProps) {
  const isOrgInviteByLink = orgSlug && !prepopulateFormValues?.username;
  const [premiumUsername, setPremiumUsername] = useState(false);
  const [usernameTaken, setUsernameTaken] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isMicrosoftLoading, setIsMicrosoftLoading] = useState(false);
  const [accountUnderReview, setAccountUnderReview] = useState(false);
  const [displayEmailForm, setDisplayEmailForm] = useState(token);
  const [turnstileKey, setTurnstileKey] = useState(0);
  const searchParams = useCompatSearchParams();
  const { t, i18n } = useLocale();
  const router = useRouter();
  const formMethods = useForm<FormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: prepopulateFormValues satisfies FormValues,
    mode: "onTouched",
  });
  const {
    register,
    watch,
    formState: { isSubmitting, errors, isSubmitSuccessful },
  } = formMethods;

  useEffect(() => {
    if (redirectUrl) {
      localStorage.setItem("onBoardingRedirect", redirectUrl);
    }
  }, [redirectUrl]);

  const [userConsentToCookie, setUserConsentToCookie] = useState(false); // No need to be checked for user to proceed

  function handleConsentChange(consent: boolean) {
    setUserConsentToCookie(!consent);
  }

  const loadingSubmitState = isSubmitSuccessful || isSubmitting;
  const displayBackButton = token ? false : displayEmailForm;

  const signUp: SubmitHandler<FormValues> = async (_data) => {
    const { cfToken, ...data } = _data;

    posthog.capture("signup_form_submitted", {
      has_token: !!token,
      is_org_invite: isOrgInviteByLink,
      org_slug: orgSlug,
      is_premium_username: premiumUsername,
      username_taken: usernameTaken,
    });

    try {
      const result = await fetchSignup(
        {
          ...data,
          language: i18n.language,
          token,
        },
        cfToken
      );

      if (!result.ok) {
        if (isUserAlreadyExistsError(result)) {
          showToast(t("account_already_exists_please_login"), "warning");
          const callbackUrl = token ? `/teams?token=${token}` : "/event-types";
          setTimeout(() => {
            router.push(`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
          }, 3000);
          return;
        }

        if (hasCheckoutSession(result)) {
          const stripe = await getStripe();
          if (stripe) {
            const { error } = await stripe.redirectToCheckout({
              sessionId: result.error.checkoutSessionId,
            });
            if (error) console.warn(error.message);
          }
          return;
        }

        throw new Error(result.error.message);
      }

      if (isAccountUnderReview(result)) {
        setAccountUnderReview(true);
        return;
      }

      if (process.env.NEXT_PUBLIC_GTM_ID) {
        pushGTMEvent("create_account", { email: data.email, user: data.username, lang: data.language });
      }

      const gettingStartedPath = onboardingV3Enabled ? "onboarding/getting-started" : "getting-started";
      const verifyOrGettingStarted = emailVerificationEnabled ? "auth/verify-email" : gettingStartedPath;
      const constructCallBackIfUrlPresent = () => {
        if (isOrgInviteByLink) {
          return `${WEBAPP_URL}/${searchParams.get("callbackUrl")}`;
        }
        return addOrUpdateQueryParam(`${WEBAPP_URL}/${searchParams.get("callbackUrl")}`, "from", "signup");
      };

      const constructCallBackIfUrlNotPresent = () => {
        return `${WEBAPP_URL}/${verifyOrGettingStarted}?from=signup`;
      };

      const constructCallBackUrl = () => {
        const callbackUrlSearchParams = searchParams?.get("callbackUrl");
        return callbackUrlSearchParams ? constructCallBackIfUrlPresent() : constructCallBackIfUrlNotPresent();
      };

      await signIn<"credentials">("credentials", {
        ...data,
        callbackUrl: constructCallBackUrl(),
      });
    } catch (err) {
      setTurnstileKey((k) => k + 1);
      formMethods.setValue("cfToken", undefined);

      const errorMessage = err instanceof Error ? err.message : t("unexpected_error_try_again");

      if (errorMessage === INVALID_CLOUDFLARE_TOKEN_ERROR) {
        return;
      }

      posthog.capture("signup_form_submit_error", {
        has_token: !!token,
        is_org_invite: isOrgInviteByLink,
        org_slug: orgSlug,
        is_premium_username: premiumUsername,
        error_message: errorMessage,
      });
      formMethods.setError("apiError", { message: errorMessage });
    }
  };

  return (
    <>
      {IS_RONDEVU && (!IS_EUROPE || userConsentToCookie) ? (
        <>
          {process.env.NEXT_PUBLIC_GTM_ID && (
            <>
              {/* biome-ignore lint/security/noDangerouslySetInnerHtml: GTM script injection */}
              <Script
                id="gtm-init-script"
                // It is strictly not necessary to disable, but in a future update of react/no-danger this will error.
                // And we don't want it to error here anyways

                dangerouslySetInnerHTML={{
                  __html: `(function (w, d, s, l, i) {
                        w[l] = w[l] || []; w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
                        var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
                        j.async = true; j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
                    })(window, document, 'script', 'dataLayer', '${process.env.NEXT_PUBLIC_GTM_ID}');`,
                }}
              />
              {/* biome-ignore lint/security/noDangerouslySetInnerHtml: GTM noscript fallback */}
              <noscript
                dangerouslySetInnerHTML={{
                  __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
                }}
              />
            </>
          )}
          <DubAnalytics
            apiHost="/_proxy/dub"
            cookieOptions={{
              domain: isENVDev ? undefined : `.${new URL(WEBSITE_URL).hostname}`,
            }}
            domainsConfig={{
              refer: "refer.rondevu.org",
            }}
          />
        </>
      ) : null}
      <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
        <header className="mx-auto flex h-16 w-full max-w-6xl items-center px-4 sm:px-6">
          <Link
            href="/"
            aria-label="rOndevu"
            className="rounded-md font-semibold text-[22px] tracking-[-0.04em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
            rOndevu
          </Link>
        </header>
        <main className="flex flex-1 items-start justify-center px-4 pt-10 pb-16 sm:items-center sm:pt-0">
          <div className="flex w-full max-w-md flex-col rounded-xl border border-border bg-card p-6 text-card-foreground sm:p-8">
            {accountUnderReview ? (
              <div
                className="flex flex-col items-center gap-4 py-10 text-center"
                data-testid="account-under-review">
                <div className="flex size-12 items-center justify-center rounded-full border border-border">
                  <ShieldCheckIcon className="size-5 text-foreground" />
                </div>
                <h1 className="font-semibold text-2xl tracking-[-0.04em]">{t("account_under_review_title")}</h1>
                <p className="text-muted-foreground text-sm">
                  {t("account_under_review_description")}
                </p>
                <Button href="/auth/login" className="mt-4">
                  {t("go_back_login")}
                </Button>
              </div>
            ) : (
              <>
                {displayBackButton && (
                  <div className="flex w-fit">
                    <Button
                      color="minimal"
                      className="mb-4 flex h-7 w-full items-center rounded-md px-2 text-muted-foreground hover:bg-accent hover:text-foreground"
                      StartIcon="arrow-left"
                      data-testid="signup-back-button"
                      onClick={() => {
                        setDisplayEmailForm(false);
                      }}>
                      {t("back")}
                    </Button>
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <h1 className="text-balance font-semibold text-3xl tracking-[-0.045em]">
                    {IS_RONDEVU ? t("create_your_rondevu_account") : t("create_your_account")}
                  </h1>
                  {IS_RONDEVU ? (
                    <p className="text-muted-foreground text-sm">
                      {t("signup_page_description")}
                    </p>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      {t("rondevu_explained", {
                        appName: APP_NAME,
                      })}
                    </p>
                  )}
                  {IS_RONDEVU && (
                    <div className="mt-12">
                      <SelectField
                        label={t("data_region")}
                        value={{
                          label: t(
                            // Use WEBAPP_URL for SSR-safe region detection
                            WEBAPP_URL.includes("cal.eu") ||
                              (typeof window !== "undefined" &&
                                window.location.hostname === "localhost" &&
                                new URL(window.location.href).searchParams.get("region") === "eu")
                              ? "european_union"
                              : "united_states"
                          ),
                          value:
                            // Use WEBAPP_URL for SSR-safe region detection
                            WEBAPP_URL.includes("cal.eu") ||
                            (typeof window !== "undefined" &&
                              window.location.hostname === "localhost" &&
                              new URL(window.location.href).searchParams.get("region") === "eu")
                              ? "eu"
                              : "us",
                        }}
                        options={[
                          { label: t("united_states"), value: "us" },
                          { label: t("european_union"), value: "eu" },
                        ]}
                        onChange={(option) => {
                          if (option && "value" in option) {
                            const currentUrl = new URL(window.location.href);

                            // Handle localhost - add region as URL parameter
                            if (currentUrl.hostname === "localhost") {
                              currentUrl.searchParams.set("region", option.value);
                              window.location.href = currentUrl.toString();
                              return;
                            }

                            // Handle production domains - modify hostname only to preserve query params
                            if (option.value === "eu") {
                              currentUrl.hostname = currentUrl.hostname.replace("rondevu.org", "cal.eu");
                            } else {
                              currentUrl.hostname = currentUrl.hostname.replace("cal.eu", "rondevu.org");
                            }
                            window.location.href = currentUrl.toString();
                          }
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Form Container */}
                {displayEmailForm && (
                  <div className="mt-6">
                    <Form
                      className="flex flex-col gap-4"
                      form={formMethods}
                      handleSubmit={async (values) => {
                        let updatedValues = values;
                        if (!formMethods.getValues().username && isOrgInviteByLink) {
                          updatedValues = {
                            ...values,
                            username: getOrgUsernameFromEmail(values.email, orgAutoAcceptEmail),
                          };
                        }
                        await signUp(updatedValues);
                      }}>
                      {/* Username */}
                      {!isOrgInviteByLink ? (
                        <UsernameField
                          orgSlug={orgSlug}
                          label={t("username")}
                          username={watch("username") || ""}
                          premium={premiumUsername}
                          usernameTaken={usernameTaken}
                          disabled={!!orgSlug}
                          setUsernameTaken={(value) => setUsernameTaken(value)}
                          data-testid="signup-usernamefield"
                          setPremium={(value) => setPremiumUsername(value)}
                          addOnLeading={
                            orgSlug
                              ? truncateDomain(
                                  `${WEBAPP_URL.replace(
                                    URL_PROTOCOL_REGEX,
                                    ""
                                  )}/`
                                )
                              : truncateDomain(
                                  `${WEBSITE_URL.replace(URL_PROTOCOL_REGEX, "")}/`
                                )
                          }
                        />
                      ) : null}
                      {/* Email */}
                      <TextField
                        id="signup-email"
                        {...register("email")}
                        label={t("email")}
                        placeholder="ad@alanadi.com"
                        type="email"
                        autoComplete="email"
                        disabled={prepopulateFormValues?.email}
                        data-testid="signup-emailfield"
                      />

                      {/* Password */}
                      <PasswordField
                        id="signup-password"
                        data-testid="signup-passwordfield"
                        autoComplete="new-password"
                        label={t("password")}
                        {...register("password")}
                        hintErrors={["caplow", "min", "num"]}
                      />
                      {/* Cloudflare Turnstile Captcha */}
                      {CLOUDFLARE_SITE_ID ? (
                        <TurnstileCaptcha
                          key={turnstileKey}
                          appearance="interaction-only"
                          onVerify={(token) => {
                            formMethods.setValue("cfToken", token);
                          }}
                          onExpire={() => {
                            formMethods.setValue("cfToken", undefined);
                          }}
                          onError={() => {
                            formMethods.setValue("cfToken", undefined);
                          }}
                        />
                      ) : null}

                      <CheckboxField
                        data-testid="signup-cookie-content-checkbox"
                        onChange={() => handleConsentChange(userConsentToCookie)}
                        description={t("cookie_consent_checkbox")}
                      />
                      {errors.apiError && (
                        <Alert
                          className="mb-3"
                          severity="error"
                          message={errors.apiError?.message}
                          data-testid="signup-error-message"
                        />
                      )}
                      <Button
                        type="submit"
                        data-testid="signup-submit-button"
                        className="my-2 w-full justify-center"
                        loading={loadingSubmitState}
                        disabled={
                          !!formMethods.formState.errors.username ||
                          !!formMethods.formState.errors.email ||
                          !formMethods.getValues("email") ||
                          !formMethods.getValues("password") ||
                          (CLOUDFLARE_SITE_ID && !process.env.NEXT_PUBLIC_IS_E2E && !watch("cfToken")) ||
                          isSubmitting ||
                          usernameTaken
                        }>
                        {premiumUsername && !usernameTaken
                          ? `${t("get_started")} (${getPremiumPlanPriceValue()})`
                          : t("get_started")}
                      </Button>
                    </Form>
                  </div>
                )}
                {!displayEmailForm && (
                  <div className="mt-8 flex flex-col gap-6">
                    {/* Upper Row */}
                    {isGoogleLoginEnabled && (
                      <div className="flex flex-col gap-2 md:flex-row">
                        <Button
                          color="primary"
                          loading={isGoogleLoading}
                          disabled={isMicrosoftLoading}
                          CustomStartIcon={
                            <>
                              {/* eslint-disable @next/next/no-img-element */}
                              <img
                                className={classNames(
                                  "mr-2 h-4 w-4 text-subtle",
                                  premiumUsername && "opacity-50"
                                )}
                                src="/google-icon-colored.svg"
                                alt="Continue with Google Icon"
                              />
                            </>
                          }
                          className={classNames("w-full justify-center rounded-md text-center")}
                          data-testid="continue-with-google-button"
                          onClick={async () => {
                            posthog.capture("signup_google_button_clicked", {
                              has_token: !!token,
                              is_org_invite: isOrgInviteByLink,
                              org_slug: orgSlug,
                              has_prepopulated_username: !!prepopulateFormValues?.username,
                            });
                            setIsGoogleLoading(true);
                            const baseUrl = process.env.NEXT_PUBLIC_WEBAPP_URL;
                            const GOOGLE_AUTH_URL = `${baseUrl}/auth/sso/google`;
                            const searchQueryParams = new URLSearchParams();
                            if (prepopulateFormValues?.username) {
                              // If username is present we save it in query params to check for premium
                              searchQueryParams.set("username", prepopulateFormValues.username);
                              localStorage.setItem("username", prepopulateFormValues.username);
                            }
                            if (token && prepopulateFormValues?.email) {
                              searchQueryParams.set("email", prepopulateFormValues.email);
                            }
                            const url = searchQueryParams.toString()
                              ? `${GOOGLE_AUTH_URL}?${searchQueryParams.toString()}`
                              : GOOGLE_AUTH_URL;

                            router.push(url);
                          }}>
                          {t("continue_with_google")}
                        </Button>
                      </div>
                    )}

                    {isOutlookLoginEnabled && (
                      <div className="flex flex-col gap-2 md:flex-row">
                        <Button
                          color="secondary"
                          loading={isMicrosoftLoading}
                          disabled={isGoogleLoading}
                          CustomStartIcon={
                            <>
                              {/* eslint-disable @next/next/no-img-element */}
                              <img
                                className={classNames(
                                  "text-subtle mr-2 h-4 w-4",
                                  premiumUsername && "opacity-50"
                                )}
                                src="/microsoft-logo.svg"
                                alt="Continue with Microsoft Icon"
                              />
                            </>
                          }
                          className={classNames("w-full justify-center rounded-md text-center")}
                          data-testid="continue-with-microsoft-button"
                          onClick={async () => {
                            posthog.capture("signup_microsoft_button_clicked", {
                              has_token: !!token,
                              is_org_invite: isOrgInviteByLink,
                              org_slug: orgSlug,
                              has_prepopulated_username: !!prepopulateFormValues?.username,
                            });
                            setIsMicrosoftLoading(true);
                            const baseUrl = process.env.NEXT_PUBLIC_WEBAPP_URL;
                            const MICROSOFT_AUTH_URL = `${baseUrl}/auth/sso/microsoft`;
                            const searchQueryParams = new URLSearchParams();
                            if (prepopulateFormValues?.username) {
                              // If username is present we save it in query params to check for premium
                              searchQueryParams.set("username", prepopulateFormValues.username);
                              localStorage.setItem("username", prepopulateFormValues.username);
                            }
                            if (token && prepopulateFormValues?.email) {
                              searchQueryParams.set("email", prepopulateFormValues.email);
                            }
                            const url = searchQueryParams.toString()
                              ? `${MICROSOFT_AUTH_URL}?${searchQueryParams.toString()}`
                              : MICROSOFT_AUTH_URL;

                            router.push(url);
                          }}>
                          {t("continue_with_microsoft")}
                        </Button>
                      </div>
                    )}

                    {(isGoogleLoginEnabled || isOutlookLoginEnabled) && (
                      <div>
                        <div className="relative flex items-center">
                          <div className="grow border-border border-t" />
                          <span className="mx-3 shrink text-muted-foreground text-xs leading-none">
                            {t("or").toLocaleLowerCase()}
                          </span>
                          <div className="grow border-border border-t" />
                        </div>
                      </div>
                    )}

                    {/* Lower Row */}
                    <div className="flex flex-col gap-2">
                      <Button
                        color="secondary"
                        disabled={isGoogleLoading || isMicrosoftLoading}
                        className={classNames("w-full justify-center rounded-md text-center")}
                        onClick={() => {
                          posthog.capture("signup_email_button_clicked", {
                            has_token: !!token,
                            is_org_invite: isOrgInviteByLink,
                            org_slug: orgSlug,
                          });
                          setDisplayEmailForm(true);
                        }}
                        data-testid="continue-with-email-button">
                        {t("continue_with_email")}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Already have an account & T&C */}
                <div className="mt-8 flex flex-col border-border border-t pt-6 text-xs">
                  <div className="flex flex-col text-sm">
                    <div className="flex gap-1">
                      <p className="text-muted-foreground">{t("already_have_account")}</p>
                      <Link href="/auth/login" className="font-medium text-foreground underline-offset-4 hover:underline">
                        {t("sign_in")}
                      </Link>
                    </div>
                    <div className="mt-2 text-muted-foreground text-xs">
                      <ServerTrans
                        t={t}
                        i18nKey="signing_up_terms"
                        values={{ appName: APP_NAME }}
                        components={[
                          <Link
                            className="text-emphasis hover:underline"
                            key="terms"
                            href={`${WEBSITE_TERMS_URL}`}
                            target="_blank">
                            Terms
                          </Link>,
                          <Link
                            className="text-emphasis hover:underline"
                            key="privacy"
                            href={`${WEBSITE_PRIVACY_POLICY_URL}`}
                            target="_blank">
                            Privacy Policy.
                          </Link>,
                        ]}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
        <Toaster position="bottom-right" />
      </div>
    </>
  );
}
