"use client";

import { useLocale } from "@rondevu/lib/hooks/useLocale";
import { Alert } from "@rondevu/ui/components/alert";

import Shell from "~/shell/Shell";

export default function Error() {
  const { t } = useLocale();
  return (
    <Shell>
      <Alert severity="error" title={t("something_went_wrong")} />
    </Shell>
  );
}
