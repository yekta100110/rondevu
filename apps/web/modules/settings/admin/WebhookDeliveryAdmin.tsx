"use client";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Button } from "@calcom/ui/components/button";
import { useCallback, useEffect, useState } from "react";

type Delivery = {
  id: string;
  eventId: string;
  status: string;
  attempts: number;
  lastHttpCode: number | null;
  createdAt: string;
  updatedAt: string;
};

export function WebhookDeliveryAdmin() {
  const { t } = useLocale();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const refresh = useCallback(async () => {
    const response = await fetch("/api/admin/webhook-deliveries", { credentials: "same-origin" });
    if (!response.ok) throw new Error("Unable to load deliveries");
    const data = (await response.json()) as { deliveries: Delivery[] };
    setDeliveries(data.deliveries);
  }, []);
  useEffect(() => {
    refresh().catch(() => setError(t("webhook_load_failed")));
  }, [refresh, t]);

  async function retry(id: string) {
    setBusy(id);
    setError("");
    try {
      const response = await fetch("/api/admin/webhook-deliveries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error("Retry failed");
      await refresh();
    } catch {
      setError(t("webhook_retry_failed"));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-3 p-6">
      {error && (
        <p role="alert" className="text-red-600">
          {error}
        </p>
      )}
      {deliveries.map((delivery) => (
        <div
          key={delivery.id}
          className="flex items-center justify-between gap-4 rounded-lg border border-subtle p-3 text-sm">
          <div>
            <div>
              {delivery.status} · HTTP {delivery.lastHttpCode ?? "—"} · {delivery.attempts}{" "}
              {t("webhook_attempts")}
            </div>
            <div className="text-subtle">
              {new Date(delivery.createdAt).toLocaleString()} · {delivery.eventId.slice(0, 12)}
            </div>
          </div>
          {(delivery.status === "FAILED" ||
            (delivery.status === "PROCESSING" &&
              Date.now() - new Date(delivery.updatedAt).getTime() > 15 * 60 * 1000)) && (
            <Button type="button" disabled={busy === delivery.id} onClick={() => retry(delivery.id)}>
              {t("webhook_retry")}
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
