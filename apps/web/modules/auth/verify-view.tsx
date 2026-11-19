"use client";

import { WEBAPP_URL } from "@rondevu/lib/constants";
import { useCompatSearchParams } from "@rondevu/lib/hooks/useCompatSearchParams";
import { useLocale } from "@rondevu/lib/hooks/useLocale";
import { useRouterQuery } from "@rondevu/lib/hooks/useRouterQuery";
import classNames from "@rondevu/ui/classNames";
import { Button } from "@rondevu/ui/components/button";
import { showToast } from "@rondevu/ui/components/toast";
import { MailOpenIcon, TriangleAlertIcon } from "@coss/ui/icons";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import z from "zod";

async function sendVerificationLogin(email: string, username: string, t: (key: string) => string) {
  await signIn("email", {
    email: email.toLowerCase(),
    username: username.toLowerCase(),
    redirect: false,
    callbackUrl: WEBAPP_URL || "https://rondevu.org",
  })
    .then(() => {
      showToast(t("verification_email_sent"), "success");
    })
    .catch((err) => {
      showToast(err, "error");
    });
}

function useSendFirstVerificationLogin({
  email,
  username,
}: {
  email: string | undefined;
  username: string | undefined;
}) {
  const sent = useRef(false);
  const { t } = useLocale();
  useEffect(() => {
    if (!email || !username || sent.current) {
      return;
    }
    (async () => {
      await sendVerificationLogin(email, username, t);
      sent.current = true;
    })();
  }, [email, username, t]);
}

const querySchema = z.object({
  email: z.string().optional(),
  username: z.string().optional(),
  paymentStatus: z.string().optional(),
  t: z.string().optional(),
});

const PaymentFailedIcon = () => (
  <div className="rounded-full border border-border p-3">
    <TriangleAlertIcon className="size-6 shrink-0 text-destructive" />
  </div>
);

const PaymentSuccess = () => (
  <svg viewBox="0 0 48 48" className="size-12 text-foreground" aria-hidden="true">
    <motion.circle
      cx="24"
      cy="24"
      r="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{ rotate: -90, transformOrigin: "center" }}
    />
    <motion.path
      d="M15 24.5l6 6 12-13"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
    />
  </svg>
);

const MailOpenIconWrapper = () => (
  <div className="rounded-full border border-border p-3">
    <MailOpenIcon className="size-6 shrink-0 text-foreground" />
  </div>
);

export default function Verify({ EMAIL_FROM }: { EMAIL_FROM?: string }) {
  const searchParams = useCompatSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const routerQuery = useRouterQuery();
  const { email, username, paymentStatus } = querySchema.parse(routerQuery);
  const { t } = useLocale();
  const [secondsLeft, setSecondsLeft] = useState(30);

  // Derive payment failed status from payment status
  const hasPaymentFailed = paymentStatus !== undefined && paymentStatus !== "paid";
  const isPremiumUsername = !!paymentStatus; // If paymentStatus exists, it's from premium username flow

  // Only send verification login if we DON'T have the email yet (for resend button)
  // The email is already sent server-side in paymentCallback
  useSendFirstVerificationLogin({
    email: !isPremiumUsername ? email : undefined,
    username: !isPremiumUsername ? username : undefined,
  });
  // @note: check for t=timestamp and apply disabled state and secondsLeft accordingly
  // to avoid refresh to skip waiting 30 seconds to re-send email
  useEffect(() => {
    const lastSent = new Date(parseInt(`${t}`));
    // @note: This double round() looks ugly but it's the only way I came up to get the time difference in seconds
    const difference = Math.round(Math.round(new Date().getTime() - lastSent.getTime()) / 1000);
    if (difference < 30) {
      // If less than 30 seconds, set the seconds left to 30 - difference
      setSecondsLeft(30 - difference);
    } else {
      // else set the seconds left to 0 and disabled false
      setSecondsLeft(0);
    }
  }, [t]);
  // @note: here we make sure each second is decremented if disabled up to 0.
  useEffect(() => {
    if (secondsLeft > 0) {
      const interval = setInterval(() => {
        if (secondsLeft > 0) {
          setSecondsLeft(secondsLeft - 1);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [secondsLeft]);

  if (!email) {
    return <div>{t("invalid_link")}</div>;
  }

  return (
    <div className="bg-background text-foreground">
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="mb-8 font-semibold text-[22px] tracking-[-0.04em]">rOndevu</div>
        <div className="mb-6 flex w-full max-w-md flex-col items-center rounded-xl border border-border bg-card px-6 py-10 text-center sm:px-8">
          {hasPaymentFailed ? (
            <PaymentFailedIcon />
          ) : isPremiumUsername ? (
            <PaymentSuccess />
          ) : (
            <MailOpenIconWrapper />
          )}
          <h1 className="mt-6 mb-3 font-semibold text-2xl tracking-[-0.04em]">
            {hasPaymentFailed
              ? t("your_payment_failed")
              : isPremiumUsername
                ? t("payment_successful")
                : t("check_your_inbox")}
          </h1>
          {hasPaymentFailed && <p className="mb-3 text-sm">{t("account_created_premium_not_reserved")}</p>}
          <p className="text-muted-foreground text-sm">
            {t("email_sent_with_activation_link", { email })}{" "}
            {hasPaymentFailed && t("activate_account_to_purchase_username")}
          </p>
          <div className="mt-6">
            <Button
              color="secondary"
              href={
                EMAIL_FROM
                  ? encodeURIComponent(`https://mail.google.com/mail/u/0/#search/from:${EMAIL_FROM}`)
                  : "https://mail.google.com/mail/u/0/"
              }
              target="_blank"
              EndIcon="external-link">
              {t("open_in_gmail")}
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground text-sm">{t("dont_see_email")}</p>
          <button
            className={classNames(
              "font-mono text-sm tabular-nums",
              secondsLeft > 0 ? "text-muted-foreground" : "font-medium text-foreground underline underline-offset-4"
            )}
            disabled={secondsLeft > 0}
            onClick={async (e) => {
              if (!email || !username) {
                return;
              }
              e.preventDefault();
              setSecondsLeft(30);
              // Update query params with t:timestamp, shallow: true doesn't re-render the page
              const _searchParams = new URLSearchParams(searchParams?.toString());
              _searchParams.set("t", `${Date.now()}`);
              router.replace(`${pathname}?${_searchParams.toString()}`);
              return await sendVerificationLogin(email, username, t);
            }}>
            {secondsLeft > 0 ? t("resend_in_seconds", { seconds: secondsLeft }) : t("resend")}
          </button>
        </div>
      </div>
    </div>
  );
}
