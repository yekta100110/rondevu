-- AlterTable
ALTER TABLE "BillingSubscription" ADD COLUMN "pastDueAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "BillingManualAccess" (
    "userId" INTEGER NOT NULL,
    "until" TIMESTAMP(3),
    "note" TEXT,
    "grantedById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BillingManualAccess_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "BillingManualAccess" ADD CONSTRAINT "BillingManualAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Data: the panel is now gated on paid access. Every existing account that is not an outreach demo was
-- activated by hand before online payment existed, so it keeps access without an end date until an
-- admin changes it. Outreach demos keep access through their own demoExpiresAt.
INSERT INTO "BillingManualAccess" ("userId", "until", "note", "createdAt", "updatedAt")
SELECT u."id", NULL, 'grandfathered-before-polar-billing', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "users" u
WHERE (u."metadata" ->> 'isOutreachDemo') IS DISTINCT FROM 'true'
ON CONFLICT ("userId") DO NOTHING;
