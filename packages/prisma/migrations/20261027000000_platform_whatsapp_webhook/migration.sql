CREATE TABLE "WhatsAppPreference" (
  "userId" INTEGER NOT NULL,
  "phoneNumber" TEXT NOT NULL,
  "optedInAt" TIMESTAMP(3),
  "noticeVersion" TEXT,
  "revokedAt" TIMESTAMP(3),
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "WhatsAppPreference_pkey" PRIMARY KEY ("userId")
);
ALTER TABLE "WhatsAppPreference" ADD CONSTRAINT "WhatsAppPreference_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
CREATE INDEX "WhatsAppPreference_phoneNumber_idx" ON "WhatsAppPreference"("phoneNumber");

CREATE TABLE "WhatsAppBookingConsent" (
  "bookingId" INTEGER NOT NULL,
  "phoneNumber" TEXT NOT NULL,
  "optedInAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "noticeVersion" TEXT NOT NULL,
  "revokedAt" TIMESTAMP(3),
  CONSTRAINT "WhatsAppBookingConsent_pkey" PRIMARY KEY ("bookingId")
);
ALTER TABLE "WhatsAppBookingConsent" ADD CONSTRAINT "WhatsAppBookingConsent_bookingId_fkey"
  FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
CREATE INDEX "WhatsAppBookingConsent_phoneNumber_idx" ON "WhatsAppBookingConsent"("phoneNumber");

CREATE TABLE "WebhookDelivery" (
  "id" TEXT NOT NULL,
  "webhookId" TEXT NOT NULL,
  "eventId" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "lastHttpCode" INTEGER,
  "bodyEncrypted" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "WebhookDelivery_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "WebhookDelivery_webhookId_eventId_key" ON "WebhookDelivery"("webhookId", "eventId");
CREATE INDEX "WebhookDelivery_status_updatedAt_idx" ON "WebhookDelivery"("status", "updatedAt");
ALTER TABLE "WebhookDelivery" ADD CONSTRAINT "WebhookDelivery_webhookId_fkey"
  FOREIGN KEY ("webhookId") REFERENCES "Webhook"("id") ON DELETE CASCADE ON UPDATE CASCADE;
