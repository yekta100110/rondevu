import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { prisma } from "@calcom/prisma";
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

/**
 * Returns candidate file paths across monorepo and web app working directories.
 */
function getConfigFileCandidates(): string[] {
  const cwd = process.cwd();
  const candidates = [
    path.join(cwd, "plan-contact-config.json"),
    path.join(cwd, "apps", "web", "plan-contact-config.json"),
    path.resolve(cwd, "..", "plan-contact-config.json"),
  ];
  return Array.from(new Set(candidates));
}

export async function getPlanContactConfig(): Promise<PlanContactConfig> {
  // 1. Try reading from Deployment.theme in PostgreSQL
  try {
    const deployment = await prisma.deployment.findUnique({
      where: { id: 1 },
      select: { theme: true },
    });

    let theme: Record<string, unknown> | null = null;
    if (deployment?.theme && typeof deployment.theme === "object" && !Array.isArray(deployment.theme)) {
      theme = deployment.theme as Record<string, unknown>;
    } else if (typeof deployment?.theme === "string") {
      try {
        theme = JSON.parse(deployment.theme);
      } catch {
        theme = null;
      }
    }

    if (theme?.planContact) {
      const parsed = ZPlanContactConfigSchema.safeParse(theme.planContact);
      if (parsed.success) {
        return parsed.data;
      }
    }
  } catch (err) {
    console.warn("[PlanContact] Could not read planContact from Deployment table:", err);
  }

  // 2. Fallback: Try reading from filesystem candidates
  for (const filePath of getConfigFileCandidates()) {
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf8");
        const parsed = ZPlanContactConfigSchema.safeParse(JSON.parse(content));
        if (parsed.success) {
          return parsed.data;
        }
      }
    } catch (err) {
      console.warn(`[PlanContact] Could not read ${filePath}:`, err);
    }
  }

  return DEFAULT_PLAN_CONTACT_CONFIG;
}

export async function updatePlanContactConfig(data: PlanContactConfig): Promise<PlanContactConfig> {
  const validated = ZPlanContactConfigSchema.parse(data);

  let dbSuccess = false;
  // 1. Persist to PostgreSQL Deployment table
  try {
    const existing = await prisma.deployment.findUnique({
      where: { id: 1 },
      select: { theme: true },
    });

    let existingTheme: Record<string, unknown> = {};
    if (existing?.theme && typeof existing.theme === "object" && !Array.isArray(existing.theme)) {
      existingTheme = existing.theme as Record<string, unknown>;
    } else if (typeof existing?.theme === "string") {
      try {
        existingTheme = JSON.parse(existing.theme);
      } catch {
        existingTheme = {};
      }
    }

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
    dbSuccess = true;
  } catch (err) {
    console.warn("[PlanContact] Could not write planContact to Deployment table:", err);
  }

  // 2. Persist to candidate file paths as resilient file backups
  let fileSuccess = false;
  for (const filePath of getConfigFileCandidates()) {
    try {
      const dir = path.dirname(filePath);
      if (fs.existsSync(dir)) {
        fs.writeFileSync(filePath, JSON.stringify(validated, null, 2), "utf8");
        fileSuccess = true;
      }
    } catch (err) {
      console.warn(`[PlanContact] Could not write backup to ${filePath}:`, err);
    }
  }

  if (!dbSuccess && !fileSuccess) {
    console.error("[PlanContact] CRITICAL: Could not persist plan contact config to DB or filesystem.");
  }

  return validated;
}
