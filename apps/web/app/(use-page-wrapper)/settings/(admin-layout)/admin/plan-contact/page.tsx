import { _generateMetadata, getTranslate } from "app/_utils";

import SettingsHeader from "@calcom/features/settings/appDir/SettingsHeader";

import PlanContactAdminView from "~/settings/admin/plan-contact-view";

export const generateMetadata = async () =>
  await _generateMetadata(
    (t) => t("plan_contact"),
    (t) => t("admin_plan_contact_description"),
    undefined,
    undefined,
    "/settings/admin/plan-contact"
  );

const Page = async () => {
  const t = await getTranslate();
  return (
    <SettingsHeader title={t("plan_contact")} description={t("admin_plan_contact_description")}>
      <PlanContactAdminView />
    </SettingsHeader>
  );
};

export default Page;
