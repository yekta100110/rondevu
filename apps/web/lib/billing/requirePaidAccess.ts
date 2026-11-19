import { buildLegacyRequest } from "@lib/buildLegacyCtx";
import { getServerSession } from "@rondevu/features/auth/lib/getServerSession";
import { getBillingService } from "@rondevu/features/billing-polar/di/BillingService.container";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export const BILLING_LOCKED_PATH = "/settings/my-account/billing?locked=1";

/**
 * Panel pages call this from page.tsx (layouts do not re-run on client navigation). Signed-out
 * visitors are left to the page's own login handling.
 */
export async function requirePaidAccess(): Promise<void> {
  const session = await getServerSession({ req: buildLegacyRequest(await headers(), await cookies()) });
  const userId = session?.user?.id;
  if (!userId) return;
  if (!(await getBillingService().hasAccess(userId))) redirect(BILLING_LOCKED_PATH);
}
