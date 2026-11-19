import { buildLegacyRequest } from "@lib/buildLegacyCtx";
import { getServerSession } from "@rondevu/features/auth/lib/getServerSession";
import SettingsHeader from "@rondevu/features/settings/appDir/SettingsHeader";
import { _generateMetadata, getTranslate } from "app/_utils";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import BillingAccessAdminView from "~/settings/admin/billing-access-view";

export const generateMetadata = async () =>
  await _generateMetadata(
    (t) => t("billing_manual_access"),
    (t) => t("billing_manual_access_description"),
    undefined,
    undefined,
    "/settings/admin/billing-access"
  );

const Page = async () => {
  const session = await getServerSession({ req: buildLegacyRequest(await headers(), await cookies()) });
  if (session?.user?.role !== "ADMIN") redirect("/settings/my-account/profile");

  const t = await getTranslate();
  return (
    <SettingsHeader title={t("billing_manual_access")} description={t("billing_manual_access_description")}>
      <BillingAccessAdminView />
    </SettingsHeader>
  );
};

export default Page;
