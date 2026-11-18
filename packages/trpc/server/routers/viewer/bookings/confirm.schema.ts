import type { z } from "zod";

import { bookingConfirmPatchBodySchema } from "@rondevu/prisma/zod-utils";

export const ZConfirmInputSchema = bookingConfirmPatchBodySchema;

export type TConfirmInputSchema = z.infer<typeof ZConfirmInputSchema>;
