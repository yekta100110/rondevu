import { requirePaidAccess } from "@lib/billing/requirePaidAccess";
import { _generateMetadata } from "app/_utils";
import LegacyPage from "~/upgrade/upgrade-view";

export const generateMetadata = async () => {
  const metadata = await _generateMetadata(
    (t) => t("upgrade"),
    () => "",
    undefined,
    undefined,
    "/upgrade"
  );
  return {
    ...metadata,
    robots: {
      index: false,
      follow: false,
    },
  };
};

const ServerPage = async () => {
  await requirePaidAccess();
  return <LegacyPage />;
};

export default ServerPage;
