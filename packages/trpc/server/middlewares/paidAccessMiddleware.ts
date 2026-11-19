import { TRPCError } from "@trpc/server";

type AccessChecker = { hasAccess(userId: number): Promise<boolean> };

const loadAccessChecker = async (): Promise<AccessChecker> => {
  const { getBillingService } = await import("@rondevu/features/billing-polar/di/BillingService.container");
  return getBillingService();
};

/**
 * Without paid access the panel is read-only: every mutation is refused unless the procedure is built
 * from `authedProcedureWithoutPaywall` (billing, password, profile). Queries stay open so the billing
 * page and the redirect can still load.
 */
export async function assertPaidAccessForMutation(
  input: { type: string; userId: number | undefined },
  getChecker: () => Promise<AccessChecker> = loadAccessChecker
): Promise<void> {
  if (input.type !== "mutation") return;
  if (typeof input.userId !== "number") throw new TRPCError({ code: "UNAUTHORIZED" });

  const checker = await getChecker();
  if (!(await checker.hasAccess(input.userId))) {
    throw new TRPCError({ code: "FORBIDDEN", message: "billing_access_required" });
  }
}
