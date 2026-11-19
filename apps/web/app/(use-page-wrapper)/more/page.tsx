import { requirePaidAccess } from "@lib/billing/requirePaidAccess";
import { _generateMetadata } from "app/_utils";
import Page from "~/more/more-page-view";

export const generateMetadata = async () => {
  const metadata = await _generateMetadata(
    (t) => t("more"),
    () => "",
    undefined,
    undefined,
    "/more"
  );
  return {
    ...metadata,
    robots: {
      index: false,
      follow: false,
    },
  };
};

const ServerPageWrapper = async () => {
  await requirePaidAccess();
  return <Page />;
};

export default ServerPageWrapper;
