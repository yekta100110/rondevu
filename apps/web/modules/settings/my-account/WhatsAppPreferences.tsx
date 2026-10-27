"use client";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Button } from "@calcom/ui/components/button";
import { showToast } from "@calcom/ui/components/toast";
import { useEffect, useState } from "react";

export function WhatsAppPreferences() {
  const { t } = useLocale();
  const [enabled, setEnabled] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/whatsapp/preferences", { credentials: "same-origin" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { enabled: boolean; phoneNumber: string } | null) => {
        if (!data) return;
        setEnabled(data.enabled);
        setPhoneNumber(data.phoneNumber);
      })
      .catch(() => showToast(t("whatsapp_save_failed"), "error"));
  }, [t]);

  async function save() {
    setSaving(true);
    try {
      const response = await fetch("/api/whatsapp/preferences", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enabled ? { enabled, phoneNumber } : { enabled }),
      });
      if (!response.ok) throw new Error("Save failed");
      showToast(t("whatsapp_saved"), "success");
    } catch {
      showToast(t("whatsapp_save_failed"), "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mt-6 rounded-lg border border-subtle p-6">
      <h2 className="mb-3 text-base font-semibold">{t("whatsapp_notifications")}</h2>
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} />
        <span>{t("whatsapp_host_notice")}</span>
      </label>
      <input
        className="mt-4 w-full max-w-sm rounded-md border border-subtle bg-default p-2"
        type="tel"
        autoComplete="tel"
        placeholder={t("whatsapp_phone_hint")}
        value={phoneNumber}
        onChange={(event) => setPhoneNumber(event.target.value)}
      />
      <div className="mt-4">
        <Button
          type="button"
          disabled={saving || (enabled && !/^\+[1-9]\d{7,14}$/.test(phoneNumber))}
          onClick={save}>
          {t("whatsapp_save")}
        </Button>
      </div>
    </section>
  );
}
