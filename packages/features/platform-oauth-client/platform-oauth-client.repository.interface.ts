import type { PlatformOAuthClient } from "@rondevu/prisma/client";

export interface IPlatformOAuthClientRepository {
  getByUserId(userId: number): Promise<PlatformOAuthClient | null>;
}
