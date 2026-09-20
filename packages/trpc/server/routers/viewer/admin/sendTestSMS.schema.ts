import { z } from "zod";

export const ZSendTestSMSSchema = z.object({
  phoneNumber: z.string().min(8, "Telefon numarası en az 8 karakter olmalıdır"),
  message: z.string().optional(),
});

export type TSendTestSMSSchema = z.infer<typeof ZSendTestSMSSchema>;
