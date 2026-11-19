-- CreateEnum
CREATE TYPE "BillingPlan" AS ENUM ('MONTHLY', 'YEARLY');

-- CreateTable
CREATE TABLE "BillingSubscription" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "polarCustomerId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "plan" "BillingPlan" NOT NULL,
    "status" TEXT NOT NULL,
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "currentPeriodStart" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "pendingPlan" "BillingPlan",
    "pendingPlanAppliesAt" TIMESTAMP(3),
    "polarCreatedAt" TIMESTAMP(3) NOT NULL,
    "polarModifiedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BillingSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillingOrder" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "subscriptionId" TEXT,
    "status" TEXT NOT NULL,
    "billingReason" TEXT NOT NULL,
    "totalAmount" INTEGER NOT NULL,
    "refundedAmount" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL,
    "polarCreatedAt" TIMESTAMP(3) NOT NULL,
    "polarModifiedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BillingOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PolarWebhookEvent" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PolarWebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BillingSubscription_userId_idx" ON "BillingSubscription"("userId");

-- CreateIndex
CREATE INDEX "BillingSubscription_polarCustomerId_idx" ON "BillingSubscription"("polarCustomerId");

-- CreateIndex
CREATE INDEX "BillingOrder_userId_idx" ON "BillingOrder"("userId");

-- CreateIndex
CREATE INDEX "BillingOrder_subscriptionId_polarCreatedAt_idx" ON "BillingOrder"("subscriptionId", "polarCreatedAt");

-- AddForeignKey
ALTER TABLE "BillingSubscription" ADD CONSTRAINT "BillingSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingOrder" ADD CONSTRAINT "BillingOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
