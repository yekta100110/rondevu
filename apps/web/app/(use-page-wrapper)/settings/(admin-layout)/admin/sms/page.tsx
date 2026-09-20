import { _generateMetadata, getTranslate } from "app/_utils";

import SettingsHeader from "@calcom/features/settings/appDir/SettingsHeader";

import SMSAdminView from "~/settings/admin/sms-view";

export const generateMetadata = async () =>
  await _generateMetadata(
    (t) => t("sms_system"),
    (t) => t("admin_sms_description"),
    undefined,
    undefined,
    "/settings/admin/sms"
  );

const Page = async () => {
  const t = await getTranslate();
  return (
    <SettingsHeader title={t("sms_system")} description={t("admin_sms_description")}>
      <SMSAdminView />
    </SettingsHeader>
  );
};

export default Page;
