import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import SettingsHeader from "@calcom/features/settings/appDir/SettingsHeader";
import { buildLegacyRequest } from "@lib/buildLegacyCtx";
import { getTranslate } from "app/_utils";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { WebhookDeliveryAdmin } from "~/settings/admin/WebhookDeliveryAdmin";

export default async function Page() {
  const session = await getServerSession({ req: buildLegacyRequest(await headers(), await cookies()) });
  if (session?.user.role !== "ADMIN") redirect("/settings/my-account/profile");
  const t = await getTranslate();
  return (
    <SettingsHeader
      title={t("platform_webhook_deliveries")}
      description={t("platform_webhook_deliveries_description")}>
      <WebhookDeliveryAdmin />
    </SettingsHeader>
  );
}
