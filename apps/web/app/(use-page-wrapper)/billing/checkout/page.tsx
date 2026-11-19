import { buildLegacyRequest } from "@lib/buildLegacyCtx";
import { getServerSession } from "@rondevu/features/auth/lib/getServerSession";
import { getBillingService } from "@rondevu/features/billing-polar/di/BillingService.container";
import { ErrorWithCode } from "@rondevu/lib/errors";
import { _generateMetadata, getTranslate } from "app/_utils";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { BillingCheckoutError } from "~/billing/billing-checkout-error";

export const generateMetadata = async () => {
  const metadata = await _generateMetadata(
    (t) => t("plan_billing"),
    () => "",
    undefined,
    undefined,
    "/billing/checkout"
  );
  return { ...metadata, robots: { index: false, follow: false } };
};

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const Page = async ({ searchParams }: PageProps) => {
  const planParam = (await searchParams).plan;
  const planSlug = planParam === "monthly" ? "monthly" : "yearly";

  const session = await getServerSession({ req: buildLegacyRequest(await headers(), await cookies()) });
  if (!session?.user?.id) {
    // Login lets new visitors switch to signup and keeps this URL as the place to come back to.
    redirect(`/auth/login?callbackUrl=${encodeURIComponent(`billing/checkout?plan=${planSlug}`)}`);
  }

  let checkoutUrl: string | null = null;
  let errorKey: string | null = null;
  try {
    const checkout = await getBillingService().createCheckout({
      userId: session.user.id,
      plan: planSlug === "monthly" ? "MONTHLY" : "YEARLY",
    });
    checkoutUrl = checkout.url;
  } catch (error) {
    if (error instanceof ErrorWithCode && error.message === "billing_subscription_exists") {
      redirect("/settings/my-account/billing");
    }
    errorKey =
      error instanceof ErrorWithCode && error.message === "billing_not_configured"
        ? "plan_billing_error_billing_not_configured"
        : "plan_billing_checkout_error_description";
  }

  if (checkoutUrl) redirect(checkoutUrl);

  const t = await getTranslate();
  return (
    <BillingCheckoutError
      title={t("plan_billing_checkout_error_title")}
      description={t(errorKey ?? "plan_billing_checkout_error_description")}
      retryLabel={t("plan_billing_try_again")}
      retryHref={`/billing/checkout?plan=${planSlug}`}
      contactLabel={t("plan_billing_contact_link")}
    />
  );
};

export default Page;
