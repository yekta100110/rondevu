"use client";

import { useLocale } from "@rondevu/lib/hooks/useLocale";
import { trpc } from "@rondevu/trpc/react";
import { Button } from "@rondevu/ui/components/button";
import { TextField } from "@rondevu/ui/components/form";
import { showToast } from "@rondevu/ui/components/toast";
import { useState } from "react";

export default function BillingAccessAdminView() {
  const { t, i18n } = useLocale();
  const utils = trpc.useUtils();
  const [emailInput, setEmailInput] = useState("");
  const [lookupEmail, setLookupEmail] = useState<string | null>(null);
  const [until, setUntil] = useState("");
  const [note, setNote] = useState("");

  const lookup = trpc.viewer.billing.adminFindAccess.useQuery(
    { email: lookupEmail ?? "" },
    { enabled: lookupEmail !== null, retry: false }
  );

  const refresh = () => {
    showToast(t("billing_manual_access_saved"), "success");
    void utils.viewer.billing.adminFindAccess.invalidate();
  };
  const onError = () => showToast(t("plan_billing_error_generic"), "error");
  const grant = trpc.viewer.billing.adminGrantManualAccess.useMutation({ onSuccess: refresh, onError });
  const remove = trpc.viewer.billing.adminRemoveManualAccess.useMutation({ onSuccess: refresh, onError });

  const formatDate = (value: Date | null) =>
    value
      ? new Intl.DateTimeFormat(i18n.language, { dateStyle: "long" }).format(new Date(value))
      : t("billing_manual_access_no_end");

  const reasonLabel: Record<string, string> = {
    admin: t("billing_access_reason_admin"),
    outreach_demo: t("billing_access_reason_outreach_demo"),
    manual: t("billing_access_reason_manual"),
    subscription: t("billing_access_reason_subscription"),
  };

  return (
    <div className="flex flex-col gap-6">
      <form
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
        onSubmit={(event) => {
          event.preventDefault();
          setLookupEmail(emailInput.trim());
        }}>
        <div className="flex-1">
          <TextField
            label={t("email")}
            type="email"
            required
            value={emailInput}
            onChange={(event) => setEmailInput(event.target.value)}
          />
        </div>
        <Button type="submit" color="secondary" loading={lookup.isFetching}>
          {t("billing_manual_access_lookup")}
        </Button>
      </form>

      {lookup.error && <p className="text-error text-sm">{t("billing_manual_access_user_not_found")}</p>}

      {lookup.data && lookupEmail && (
        <div className="flex flex-col gap-4 rounded-lg border border-subtle p-4">
          <p className="text-emphasis text-sm">
            {lookup.data.access.hasAccess
              ? t("billing_manual_access_current", {
                  reason: reasonLabel[lookup.data.access.reason],
                  date: formatDate(lookup.data.access.until),
                })
              : t("billing_manual_access_none")}
          </p>
          {lookup.data.manual && (
            <p className="text-sm text-subtle">
              {t("billing_manual_access_existing", { date: formatDate(lookup.data.manual.until) })}
            </p>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <TextField
              label={t("billing_manual_access_until")}
              type="date"
              value={until}
              onChange={(event) => setUntil(event.target.value)}
              hint={t("billing_manual_access_until_hint")}
            />
            <TextField
              label={t("billing_manual_access_note")}
              value={note}
              maxLength={200}
              onChange={(event) => setNote(event.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              color="primary"
              loading={grant.isPending}
              onClick={() =>
                grant.mutate({
                  email: lookupEmail,
                  until: until ? new Date(`${until}T23:59:59`) : null,
                  note: note || undefined,
                })
              }>
              {t("billing_manual_access_grant")}
            </Button>
            {lookup.data.manual && (
              <Button
                color="destructive"
                loading={remove.isPending}
                onClick={() => remove.mutate({ email: lookupEmail })}>
                {t("billing_manual_access_remove")}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
