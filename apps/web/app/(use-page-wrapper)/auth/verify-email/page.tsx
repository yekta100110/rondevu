import { _generateMetadata } from "app/_utils";

import VerifyEmailPage from "~/auth/verify-email-view";

export const generateMetadata = async () => {
  const metadata = await _generateMetadata(
    (t) => t("verify_email_button"),
    () => "",
    undefined,
    undefined,
    "/auth/verify-email"
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
  return <VerifyEmailPage />;
};

export default ServerPageWrapper;
