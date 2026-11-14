import { _generateMetadata } from "app/_utils";

import Page from "~/auth/oauth2/authorize-view";

export const generateMetadata = async () => {
  const metadata = await _generateMetadata(
    (t) => t("authorize"),
    () => "",
    undefined,
    undefined,
    "/auth/oauth2/authorize"
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
