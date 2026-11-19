import type { PrismaClient } from "@rondevu/prisma";
import { Prisma } from "@rondevu/prisma/client";
import type { BillingPlanKey } from "../lib/types";

export type BillingSubscriptionRecord = {
  id: string;
  userId: number;
  polarCustomerId: string;
  productId: string;
  plan: BillingPlanKey;
  status: string;
  cancelAtPeriodEnd: boolean;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  endedAt: Date | null;
  pastDueAt: Date | null;
  pendingPlan: BillingPlanKey | null;
  pendingPlanAppliesAt: Date | null;
  polarCreatedAt: Date;
  polarModifiedAt: Date;
};

export type BillingSubscriptionWrite = Omit<
  BillingSubscriptionRecord,
  "pendingPlan" | "pendingPlanAppliesAt"
> & {
  /** Omitted when the source does not know about scheduled changes, so stored values stay intact. */
  pending?: { plan: BillingPlanKey | null; appliesAt: Date | null };
};

export type BillingOrderWrite = {
  id: string;
  userId: number;
  subscriptionId: string | null;
  status: string;
  billingReason: string;
  totalAmount: number;
  refundedAmount: number;
  currency: string;
  polarCreatedAt: Date;
  polarModifiedAt: Date;
};

export type BillingUserRecord = {
  id: number;
  email: string;
  name: string | null;
  locale: string | null;
  role: string;
  metadata: Prisma.JsonValue;
};

export type ManualAccessRecord = { userId: number; until: Date | null; note: string | null };

const subscriptionSelect = {
  id: true,
  userId: true,
  polarCustomerId: true,
  productId: true,
  plan: true,
  status: true,
  cancelAtPeriodEnd: true,
  currentPeriodStart: true,
  currentPeriodEnd: true,
  endedAt: true,
  pastDueAt: true,
  pendingPlan: true,
  pendingPlanAppliesAt: true,
  polarCreatedAt: true,
  polarModifiedAt: true,
} satisfies Prisma.BillingSubscriptionSelect;

const SETTLED_ORDER_STATUSES = ["paid", "refunded", "partially_refunded"];

const isUniqueViolation = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";

export class BillingRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  findUserById(userId: number): Promise<BillingUserRecord | null> {
    return this.prismaClient.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, locale: true, role: true, metadata: true },
    });
  }

  async findUserIdByEmail(email: string): Promise<number | null> {
    const user = await this.prismaClient.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
      select: { id: true },
    });
    return user?.id ?? null;
  }

  findManualAccess(userId: number): Promise<ManualAccessRecord | null> {
    return this.prismaClient.billingManualAccess.findUnique({
      where: { userId },
      select: { userId: true, until: true, note: true },
    });
  }

  async upsertManualAccess(data: {
    userId: number;
    until: Date | null;
    note: string | null;
    grantedById: number;
  }): Promise<void> {
    const { userId, ...fields } = data;
    await this.prismaClient.billingManualAccess.upsert({
      where: { userId },
      create: { userId, ...fields },
      update: fields,
      select: { userId: true },
    });
  }

  async deleteManualAccess(userId: number): Promise<void> {
    await this.prismaClient.billingManualAccess.deleteMany({ where: { userId } });
  }

  findSubscriptionById(id: string): Promise<BillingSubscriptionRecord | null> {
    return this.prismaClient.billingSubscription.findUnique({ where: { id }, select: subscriptionSelect });
  }

  async updateUserMetadata(userId: number, metadata: Record<string, Prisma.JsonValue>): Promise<void> {
    await this.prismaClient.user.update({
      where: { id: userId },
      data: { metadata: metadata as Prisma.InputJsonObject },
      select: { id: true },
    });
  }

  findSubscriptionsByUserId(userId: number): Promise<BillingSubscriptionRecord[]> {
    return this.prismaClient.billingSubscription.findMany({
      where: { userId },
      select: subscriptionSelect,
      orderBy: { polarCreatedAt: "desc" },
    });
  }

  async findUserIdByPolarCustomerId(polarCustomerId: string): Promise<number | null> {
    const row = await this.prismaClient.billingSubscription.findFirst({
      where: { polarCustomerId },
      select: { userId: true },
    });
    return row?.userId ?? null;
  }

  /** Writes the snapshot unless a newer version is already stored. Returns whether it was written. */
  async upsertSubscriptionIfNotOlder(data: BillingSubscriptionWrite): Promise<boolean> {
    const { pending, userId, id, ...fields } = data;
    const pendingFields = pending
      ? { pendingPlan: pending.plan, pendingPlanAppliesAt: pending.appliesAt }
      : {};

    const existing = await this.prismaClient.billingSubscription.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing) {
      try {
        await this.prismaClient.billingSubscription.create({
          data: { id, userId, ...fields, ...pendingFields },
          select: { id: true },
        });
        return true;
      } catch (error) {
        if (!isUniqueViolation(error)) throw error;
      }
    }

    const { count } = await this.prismaClient.billingSubscription.updateMany({
      where: { id, polarModifiedAt: { lte: fields.polarModifiedAt } },
      data: { ...fields, ...pendingFields },
    });
    return count > 0;
  }

  async upsertOrderIfNotOlder(data: BillingOrderWrite): Promise<boolean> {
    const { id, userId, ...fields } = data;
    const existing = await this.prismaClient.billingOrder.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      try {
        await this.prismaClient.billingOrder.create({
          data: { id, userId, ...fields },
          select: { id: true },
        });
        return true;
      } catch (error) {
        if (!isUniqueViolation(error)) throw error;
      }
    }

    const { count } = await this.prismaClient.billingOrder.updateMany({
      where: { id, polarModifiedAt: { lte: fields.polarModifiedAt } },
      data: fields,
    });
    return count > 0;
  }

  findLatestSettledOrderBySubscriptionIds(
    subscriptionIds: string[]
  ): Promise<{ id: string; subscriptionId: string | null; status: string; polarModifiedAt: Date }[]> {
    if (subscriptionIds.length === 0) return Promise.resolve([]);
    return this.prismaClient.billingOrder.findMany({
      where: { subscriptionId: { in: subscriptionIds }, status: { in: SETTLED_ORDER_STATUSES } },
      select: { id: true, subscriptionId: true, status: true, polarModifiedAt: true },
      orderBy: { polarCreatedAt: "desc" },
      distinct: ["subscriptionId"],
    });
  }

  async isWebhookEventProcessed(webhookId: string): Promise<boolean> {
    const row = await this.prismaClient.polarWebhookEvent.findUnique({
      where: { id: webhookId },
      select: { id: true },
    });
    return row !== null;
  }

  async recordWebhookEvent(webhookId: string, type: string): Promise<void> {
    try {
      await this.prismaClient.polarWebhookEvent.create({
        data: { id: webhookId, type },
        select: { id: true },
      });
    } catch (error) {
      if (!isUniqueViolation(error)) throw error;
    }
  }
}

/** Public surface of the repository, so services and tests do not depend on Prisma. */
export type IBillingRepository = Pick<BillingRepository, keyof BillingRepository>;
