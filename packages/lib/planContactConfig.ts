import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import prisma from "@calcom/prisma";
import { z } from "zod";

export const ZPlanContactConfigSchema = z.object({
  phone: z
    .string()
    .min(5, "Telefon numarası çok kısa")
    .max(30, "Telefon numarası çok uzun")
    .regex(/^[\d\s+()-]+$/, "Geçersiz telefon formatı"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz").max(100, "E-posta adresi çok uzun"),
  whatsapp: z
    .string()
    .min(5, "WhatsApp numarası çok kısa")
    .max(30, "WhatsApp numarası çok uzun")
    .regex(/^[\d\s+()-]+$/, "Geçersiz WhatsApp formatı"),
});

export type PlanContactConfig = z.infer<typeof ZPlanContactConfigSchema>;

export const DEFAULT_PLAN_CONTACT_CONFIG: PlanContactConfig = {
  phone: "0552 119 19 87",
  email: "destek@rondevu.org",
  whatsapp: "905521191987",
};

const CONFIG_FILE_PATH = path.join(process.cwd(), "plan-contact-config.json");

export async function getPlanContactConfig(): Promise<PlanContactConfig> {
  try {
    const deployment = await prisma.deployment.findUnique({
      where: { id: 1 },
      select: { theme: true },
    });

    const theme = deployment?.theme as Record<string, unknown> | null;
    if (theme?.planContact) {
      const parsed = ZPlanContactConfigSchema.safeParse(theme.planContact);
      if (parsed.success) {
        return parsed.data;
      }
    }
  } catch (err) {
    console.warn("Could not read planContact from deployment:", err);
  }

  try {
    if (fs.existsSync(CONFIG_FILE_PATH)) {
      const content = fs.readFileSync(CONFIG_FILE_PATH, "utf8");
      const parsed = ZPlanContactConfigSchema.safeParse(JSON.parse(content));
      if (parsed.success) {
        return parsed.data;
      }
    }
  } catch (err) {
    console.warn("Could not read plan-contact-config.json:", err);
  }

  return DEFAULT_PLAN_CONTACT_CONFIG;
}

export async function updatePlanContactConfig(data: PlanContactConfig): Promise<PlanContactConfig> {
  const validated = ZPlanContactConfigSchema.parse(data);

  try {
    const existing = await prisma.deployment.findUnique({
      where: { id: 1 },
      select: { theme: true },
    });

    const existingTheme = (existing?.theme as Record<string, unknown>) || {};
    const updatedTheme = {
      ...existingTheme,
      planContact: validated,
    };

    await prisma.deployment.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        theme: updatedTheme,
      },
      update: {
        theme: updatedTheme,
      },
    });
  } catch (err) {
    console.warn("Could not write planContact to deployment table:", err);
  }

  try {
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(validated, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not write plan-contact-config.json backup:", err);
  }

  return validated;
}
