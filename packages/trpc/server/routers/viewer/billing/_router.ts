import authedProcedure from "../../../procedures/authedProcedure";
import { router } from "../../../trpc";
import { ZBillingPlanSchema } from "./billing.schema";

const loadBillingService = async () => {
  const { getBillingService } = await import("@rondevu/features/billing-polar/di/BillingService.container");
  return getBillingService();
};

export const billingRouter = router({
  getStatus: authedProcedure.query(async ({ ctx }) => (await loadBillingService()).getStatus(ctx.user.id)),

  createCheckout: authedProcedure
    .input(ZBillingPlanSchema)
    .mutation(async ({ ctx, input }) =>
      (await loadBillingService()).createCheckout({ userId: ctx.user.id, plan: input.plan })
    ),

  changePlan: authedProcedure
    .input(ZBillingPlanSchema)
    .mutation(async ({ ctx, input }) =>
      (await loadBillingService()).changePlan({ userId: ctx.user.id, plan: input.plan })
    ),

  cancel: authedProcedure.mutation(async ({ ctx }) =>
    (await loadBillingService()).cancelAtPeriodEnd(ctx.user.id)
  ),

  resume: authedProcedure.mutation(async ({ ctx }) => (await loadBillingService()).resume(ctx.user.id)),

  createPortalSession: authedProcedure.mutation(async ({ ctx }) =>
    (await loadBillingService()).createPortalUrl(ctx.user.id)
  ),

  sync: authedProcedure.mutation(async ({ ctx }) => (await loadBillingService()).syncFromPolar(ctx.user.id)),
});
