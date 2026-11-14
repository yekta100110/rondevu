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
  return <Page />;
};

export default ServerPageWrapper;
