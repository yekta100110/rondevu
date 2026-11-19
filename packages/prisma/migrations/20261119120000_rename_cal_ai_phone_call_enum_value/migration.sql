-- The rebrand renamed this enum value in schema.prisma and in the original migration.
-- Databases created before the rebrand still hold the old label, so rename it in place.
-- Fresh databases already have the new label and skip this.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_enum e JOIN pg_type t ON t.oid = e.enumtypid
    WHERE t.typname = 'CreditUsageType' AND e.enumlabel = 'CAL_AI_PHONE_CALL'
  ) THEN
    ALTER TYPE "CreditUsageType" RENAME VALUE 'CAL_AI_PHONE_CALL' TO 'RONDEVU_AI_PHONE_CALL';
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_enum e JOIN pg_type t ON t.oid = e.enumtypid
    WHERE t.typname = 'WorkflowActions' AND e.enumlabel = 'CAL_AI_PHONE_CALL'
  ) THEN
    ALTER TYPE "WorkflowActions" RENAME VALUE 'CAL_AI_PHONE_CALL' TO 'RONDEVU_AI_PHONE_CALL';
  END IF;
END $$;
