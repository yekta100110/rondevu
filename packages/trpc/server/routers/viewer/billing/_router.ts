import { authedAdminProcedure, authedProcedureWithoutPaywall } from "../../../procedures/authedProcedure";
import { router } from "../../../trpc";
import {
  ZBillingAdminEmailSchema,
  ZBillingGrantManualAccessSchema,
  ZBillingPlanSchema,
} from "./billing.schema";

const loadBillingService = async () => {
  const { getBillingService } = await import("@rondevu/features/billing-polar/di/BillingService.container");
  return getBillingService();
};

export const billingRouter = router({
  getStatus: authedProcedureWithoutPaywall.query(async ({ ctx }) =>
    (await loadBillingService()).getStatus(ctx.user.id)
  ),

  createCheckout: authedProcedureWithoutPaywall
    .input(ZBillingPlanSchema)
    .mutation(async ({ ctx, input }) =>
      (await loadBillingService()).createCheckout({ userId: ctx.user.id, plan: input.plan })
    ),

  changePlan: authedProcedureWithoutPaywall
    .input(ZBillingPlanSchema)
    .mutation(async ({ ctx, input }) =>
      (await loadBillingService()).changePlan({ userId: ctx.user.id, plan: input.plan })
    ),

  cancel: authedProcedureWithoutPaywall.mutation(async ({ ctx }) =>
    (await loadBillingService()).cancelAtPeriodEnd(ctx.user.id)
  ),

  resume: authedProcedureWithoutPaywall.mutation(async ({ ctx }) =>
    (await loadBillingService()).resume(ctx.user.id)
  ),

  createPortalSession: authedProcedureWithoutPaywall.mutation(async ({ ctx }) =>
    (await loadBillingService()).createPortalUrl(ctx.user.id)
  ),

  sync: authedProcedureWithoutPaywall.mutation(async ({ ctx }) =>
    (await loadBillingService()).syncFromPolar(ctx.user.id)
  ),

  getAccess: authedProcedureWithoutPaywall.query(async ({ ctx }) =>
    (await loadBillingService()).getAccess(ctx.user.id)
  ),

  adminFindAccess: authedAdminProcedure
    .input(ZBillingAdminEmailSchema)
    .query(async ({ input }) => (await loadBillingService()).findAccessByEmail(input.email)),

  adminGrantManualAccess: authedAdminProcedure
    .input(ZBillingGrantManualAccessSchema)
    .mutation(async ({ ctx, input }) =>
      (await loadBillingService()).grantManualAccess({
        adminUserId: ctx.user.id,
        email: input.email,
        until: input.until,
        note: input.note ?? null,
      })
    ),

  adminRemoveManualAccess: authedAdminProcedure
    .input(ZBillingAdminEmailSchema)
    .mutation(async ({ input }) => (await loadBillingService()).removeManualAccess(input.email)),
});
