"use client";

import SettingsHeader from "@rondevu/features/settings/appDir/SettingsHeader";
import { useLocale } from "@rondevu/lib/hooks/useLocale";
import type { RouterOutputs } from "@rondevu/trpc/react";
import { trpc } from "@rondevu/trpc/react";
import { Alert } from "@rondevu/ui/components/alert";
import { Badge } from "@rondevu/ui/components/badge";
import { Button } from "@rondevu/ui/components/button";
import { SkeletonText } from "@rondevu/ui/components/skeleton";
import { showToast } from "@rondevu/ui/components/toast";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

type BillingStatus = RouterOutputs["viewer"]["billing"]["getStatus"];
type Plan = "MONTHLY" | "YEARLY";

const KNOWN_ERROR_KEYS = new Set([
  "billing_subscription_exists",
  "billing_resume_first",
  "billing_payment_past_due",
  "billing_not_configured",
]);

function useBillingErrorMessage() {
  const { t } = useLocale();
  return (error: { message: string }) =>
    KNOWN_ERROR_KEYS.has(error.message)
      ? t(`plan_billing_error_${error.message}`)
      : t("plan_billing_error_generic");
}

function PlanPicker() {
  const { t } = useLocale();
  const errorMessage = useBillingErrorMessage();
  const checkout = trpc.viewer.billing.createCheckout.useMutation({
    onSuccess: ({ url }) => {
      window.location.href = url;
    },
    onError: (error) => showToast(errorMessage(error), "error"),
  });

  const options: { plan: Plan; label: string; price: string; primary: boolean }[] = [
    {
      plan: "YEARLY",
      label: t("plan_billing_start_yearly"),
      price: t("plan_billing_price_yearly"),
      primary: true,
    },
    {
      plan: "MONTHLY",
      label: t("plan_billing_start_monthly"),
      price: t("plan_billing_price_monthly"),
      primary: false,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        {options.map((option) => (
          <Button
            key={option.plan}
            color={option.primary ? "primary" : "secondary"}
            loading={checkout.isPending && checkout.variables?.plan === option.plan}
            disabled={checkout.isPending}
            onClick={() => checkout.mutate({ plan: option.plan })}>
            {option.label} · {option.price}
          </Button>
        ))}
      </div>
      <a href="/plan-bilgi" className="w-fit text-sm text-subtle underline-offset-4 hover:underline">
        {t("plan_billing_contact_link")}
      </a>
    </div>
  );
}

function SubscriptionDetails({ status }: { status: BillingStatus }) {
  const { t, i18n } = useLocale();
  const errorMessage = useBillingErrorMessage();
  const utils = trpc.useUtils();
  const [confirmingCancel, setConfirmingCancel] = useState(false);

  const formatDate = (value: Date | null) =>
    value ? new Intl.DateTimeFormat(i18n.language, { dateStyle: "long" }).format(new Date(value)) : "";
  const planLabel = (plan: Plan | null) =>
    plan === "YEARLY" ? t("plan_billing_yearly") : plan === "MONTHLY" ? t("plan_billing_monthly") : "";

  const mutationOptions = {
    onSuccess: (next: BillingStatus) => {
      utils.viewer.billing.getStatus.setData(undefined, next);
      showToast(t("plan_billing_updated"), "success");
      setConfirmingCancel(false);
    },
    onError: (error: { message: string }) => showToast(errorMessage(error), "error"),
  };
  const changePlan = trpc.viewer.billing.changePlan.useMutation(mutationOptions);
  const cancel = trpc.viewer.billing.cancel.useMutation(mutationOptions);
  const resume = trpc.viewer.billing.resume.useMutation(mutationOptions);
  const portal = trpc.viewer.billing.createPortalSession.useMutation({
    onSuccess: ({ url }) => {
      window.location.href = url;
    },
    onError: (error) => showToast(errorMessage(error), "error"),
  });
  const busy = changePlan.isPending || cancel.isPending || resume.isPending;

  const otherPlan: Plan = status.plan === "YEARLY" ? "MONTHLY" : "YEARLY";
  const canChange = status.isLive && status.status !== "past_due" && !status.cancelAtPeriodEnd;

  let badge: { label: string; variant: "success" | "warning" | "error" | "gray" };
  if (!status.isLive) badge = { label: t("plan_billing_status_ended"), variant: "gray" };
  else if (status.status === "past_due")
    badge = { label: t("plan_billing_status_past_due"), variant: "error" };
  else if (status.cancelAtPeriodEnd)
    badge = { label: t("plan_billing_status_cancel_scheduled"), variant: "warning" };
  else badge = { label: t("plan_billing_status_active"), variant: "success" };

  let periodLine = "";
  if (status.isLive && status.hasAccess && !status.cancelAtPeriodEnd) {
    periodLine = t("plan_billing_renews_on", { date: formatDate(status.currentPeriodEnd) });
  } else if (status.hasAccess) {
    periodLine = t("plan_billing_access_until", { date: formatDate(status.accessEndsAt) });
  } else if (!status.isLive && status.accessEndsAt) {
    periodLine = t("plan_billing_ended_on", { date: formatDate(status.accessEndsAt) });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <p className="font-semibold text-emphasis text-lg">{planLabel(status.plan)}</p>
          <Badge variant={badge.variant}>{badge.label}</Badge>
        </div>
        <p className="text-default text-sm">
          {status.plan === "YEARLY" ? t("plan_billing_price_yearly") : t("plan_billing_price_monthly")}
        </p>
        {periodLine && <p className="text-sm text-subtle">{periodLine}</p>}
        {status.pendingPlan && status.pendingPlanAppliesAt && (
          <p className="text-sm text-subtle">
            {t("plan_billing_pending_change", {
              plan: planLabel(status.pendingPlan),
              date: formatDate(status.pendingPlanAppliesAt),
            })}
          </p>
        )}
      </div>

      {status.status === "past_due" && <Alert severity="error" title={t("plan_billing_past_due_notice")} />}
      {status.refunded && !status.hasAccess && (
        <Alert severity="warning" title={t("plan_billing_refunded_notice")} />
      )}

      {canChange && (
        <div className="flex flex-col gap-2">
          {status.pendingPlan ? (
            <Button
              color="secondary"
              className="w-fit"
              loading={changePlan.isPending}
              disabled={busy}
              onClick={() => status.plan && changePlan.mutate({ plan: status.plan })}>
              {t("plan_billing_keep_current_plan")}
            </Button>
          ) : (
            <>
              <Button
                color="secondary"
                className="w-fit"
                loading={changePlan.isPending}
                disabled={busy}
                onClick={() => changePlan.mutate({ plan: otherPlan })}>
                {otherPlan === "YEARLY"
                  ? t("plan_billing_switch_to_yearly")
                  : t("plan_billing_switch_to_monthly")}
              </Button>
              <p className="text-subtle text-xs">
                {otherPlan === "YEARLY"
                  ? t("plan_billing_switch_to_yearly_hint")
                  : t("plan_billing_switch_to_monthly_hint")}
              </p>
            </>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-3 border-subtle border-t pt-6">
        <Button color="secondary" loading={portal.isPending} onClick={() => portal.mutate()}>
          {t("plan_billing_manage_payment")}
        </Button>
        {status.isLive && status.cancelAtPeriodEnd && (
          <Button color="primary" loading={resume.isPending} disabled={busy} onClick={() => resume.mutate()}>
            {t("plan_billing_resume")}
          </Button>
        )}
        {status.isLive && !status.cancelAtPeriodEnd && !confirmingCancel && (
          <Button color="minimal" disabled={busy} onClick={() => setConfirmingCancel(true)}>
            {t("plan_billing_cancel")}
          </Button>
        )}
      </div>

      {confirmingCancel && (
        <Alert
          severity="warning"
          title={t("plan_billing_cancel_confirm")}
          actions={
            <div className="flex gap-2">
              <Button color="destructive" loading={cancel.isPending} onClick={() => cancel.mutate()}>
                {t("plan_billing_cancel_confirm_button")}
              </Button>
              <Button color="minimal" onClick={() => setConfirmingCancel(false)}>
                {t("plan_billing_cancel_dismiss")}
              </Button>
            </div>
          }
        />
      )}
    </div>
  );
}

function AccessNotice() {
  const { t, i18n } = useLocale();
  const searchParams = useSearchParams();
  const { data: access } = trpc.viewer.billing.getAccess.useQuery();
  if (!access) return null;

  if (!access.hasAccess) {
    return searchParams?.get("locked") ? (
      <Alert severity="warning" title={t("plan_billing_locked_notice")} />
    ) : null;
  }
  if (access.reason === "subscription" || access.reason === "admin") return null;

  const date = access.until
    ? new Intl.DateTimeFormat(i18n.language, { dateStyle: "long" }).format(new Date(access.until))
    : null;
  const key =
    access.reason === "outreach_demo"
      ? "plan_billing_demo_access_notice"
      : date
        ? "plan_billing_manual_access_until_notice"
        : "plan_billing_manual_access_notice";
  return <Alert severity="info" title={t(key, { date })} />;
}

const BillingView = () => {
  const { t } = useLocale();
  const { data: status, isPending } = trpc.viewer.billing.getStatus.useQuery();

  const showPicker = status && !status.isLive && !status.hasAccess;

  return (
    <SettingsHeader
      title={t("plan_billing")}
      description={t("plan_billing_description")}
      borderInShellHeader={true}>
      <div className="flex flex-col gap-8 rounded-b-xl border-subtle border-x border-b px-4 pt-8 pb-10 sm:px-6">
        <AccessNotice />
        {isPending || !status ? (
          <SkeletonText className="h-24 w-full" />
        ) : (
          <>
            {status.hasBillingHistory && <SubscriptionDetails status={status} />}
            {showPicker && (
              <div className="flex flex-col gap-3">
                <p className="font-semibold text-emphasis">
                  {status.hasBillingHistory ? t("plan_billing_ended_title") : t("plan_billing_no_plan_title")}
                </p>
                <p className="max-w-prose text-default text-sm">{t("plan_billing_no_plan_description")}</p>
                <PlanPicker />
              </div>
            )}
          </>
        )}
      </div>
    </SettingsHeader>
  );
};

export default BillingView;
