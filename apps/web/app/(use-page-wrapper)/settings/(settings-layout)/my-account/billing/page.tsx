import { buildLegacyRequest } from "@lib/buildLegacyCtx";
import { getServerSession } from "@rondevu/features/auth/lib/getServerSession";
import { _generateMetadata } from "app/_utils";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import BillingView from "~/settings/my-account/billing-view";

export const generateMetadata = async () =>
  await _generateMetadata(
    (t) => t("plan_billing"),
    (t) => t("plan_billing_description"),
    undefined,
    undefined,
    "/settings/my-account/billing"
  );

const Page = async () => {
  const session = await getServerSession({ req: buildLegacyRequest(await headers(), await cookies()) });
  if (!session?.user?.id) redirect("/auth/login?callbackUrl=settings/my-account/billing");

  return <BillingView />;
};

export default Page;
