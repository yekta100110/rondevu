import { describe, expect, it, vi } from "vitest";
import { assertPaidAccessForMutation } from "./paidAccessMiddleware";

const checkerWith = (hasAccess: boolean) => {
  const checker = { hasAccess: vi.fn().mockResolvedValue(hasAccess) };
  return { checker, getChecker: async () => checker };
};

describe("assertPaidAccessForMutation", () => {
  it("lets mutations through for users with access", async () => {
    const { checker, getChecker } = checkerWith(true);
    await expect(
      assertPaidAccessForMutation({ type: "mutation", userId: 7 }, getChecker)
    ).resolves.toBeUndefined();
    expect(checker.hasAccess).toHaveBeenCalledWith(7);
  });

  it("refuses mutations for users without access", async () => {
    const { getChecker } = checkerWith(false);
    await expect(
      assertPaidAccessForMutation({ type: "mutation", userId: 7 }, getChecker)
    ).rejects.toMatchObject({
      code: "FORBIDDEN",
      message: "billing_access_required",
    });
  });

  it("keeps queries readable so the billing page and redirects still work", async () => {
    const { checker, getChecker } = checkerWith(false);
    await expect(
      assertPaidAccessForMutation({ type: "query", userId: 7 }, getChecker)
    ).resolves.toBeUndefined();
    expect(checker.hasAccess).not.toHaveBeenCalled();
  });

  it("rejects a mutation without a signed-in user", async () => {
    const { getChecker } = checkerWith(true);
    await expect(
      assertPaidAccessForMutation({ type: "mutation", userId: undefined }, getChecker)
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});
