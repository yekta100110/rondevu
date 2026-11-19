-- schema.prisma declares @default("tr") for Attendee.locale (Turkish is the product default),
-- but the column default in existing databases is still 'en'. Existing rows are unchanged.
ALTER TABLE "Attendee" ALTER COLUMN "locale" SET DEFAULT 'tr';
