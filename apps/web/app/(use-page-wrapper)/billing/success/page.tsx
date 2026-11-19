import { buildLegacyRequest } from "@lib/buildLegacyCtx";
import { getServerSession } from "@rondevu/features/auth/lib/getServerSession";
import { _generateMetadata } from "app/_utils";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import BillingSuccessView from "~/billing/billing-success-view";

export const generateMetadata = async () => {
  const metadata = await _generateMetadata(
    (t) => t("plan_billing_success_title"),
    () => "",
    undefined,
    undefined,
    "/billing/success"
  );
  return { ...metadata, robots: { index: false, follow: false } };
};

const Page = async () => {
  const session = await getServerSession({ req: buildLegacyRequest(await headers(), await cookies()) });
  if (!session?.user?.id) redirect("/auth/login?callbackUrl=settings/my-account/billing");

  return <BillingSuccessView />;
};

export default Page;
