"use client";

import { useLocale } from "@rondevu/lib/hooks/useLocale";
import { Alert } from "@rondevu/ui/components/alert";

export default function Error() {
  const { t } = useLocale();
  return <Alert severity="error" title={t("something_went_wrong")} />;
}
