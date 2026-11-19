"use client";

import { useLocale } from "@rondevu/lib/hooks/useLocale";
import { trpc } from "@rondevu/trpc/react";
import { Button } from "@rondevu/ui/components/button";
import { useEffect, useRef, useState } from "react";

const POLL_INTERVAL_MS = 3000;
// Webhooks usually land within seconds; after this many polls we pull from Polar directly.
const POLLS_BEFORE_SYNC = 3;
const MAX_POLLS = 20;

export default function BillingSuccessView() {
  const { t } = useLocale();
  const [polls, setPolls] = useState(0);
  const syncedRef = useRef(false);
  const sync = trpc.viewer.billing.sync.useMutation();

  const gaveUp = polls >= MAX_POLLS;
  const { data: status } = trpc.viewer.billing.getStatus.useQuery(undefined, {
    refetchInterval: (query) => (query.state.data?.hasAccess || gaveUp ? false : POLL_INTERVAL_MS),
  });
  const hasAccess = Boolean(status?.hasAccess || sync.data?.hasAccess);

  useEffect(() => {
    if (hasAccess || gaveUp) return;
    const timer = setTimeout(() => setPolls((count) => count + 1), POLL_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [polls, hasAccess, gaveUp]);

  useEffect(() => {
    if (hasAccess || syncedRef.current || polls < POLLS_BEFORE_SYNC) return;
    syncedRef.current = true;
    sync.mutate();
  }, [polls, hasAccess, sync]);

  const message = hasAccess
    ? t("plan_billing_success_active")
    : gaveUp
      ? t("plan_billing_success_slow")
      : t("plan_billing_success_pending");

  return (
    <main className="flex min-h-screen items-center justify-center bg-default px-4">
      <div className="flex w-full max-w-md flex-col gap-4 rounded-xl border border-subtle bg-default p-6">
        <h1 className="font-semibold text-emphasis text-xl">{t("plan_billing_success_title")}</h1>
        <p className="text-default text-sm" aria-live="polite">
          {message}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button href="/event-types" color={hasAccess ? "primary" : "secondary"}>
            {t("plan_billing_go_to_dashboard")}
          </Button>
          <Button href="/settings/my-account/billing" color="secondary">
            {t("plan_billing_go_to_billing")}
          </Button>
        </div>
      </div>
    </main>
  );
}
