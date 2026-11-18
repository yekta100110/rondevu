import { vi } from "vitest";

export const getCredentialForSelectedCalendar = vi.fn();

vi.mock("@rondevu/app-store/delegationCredential", () => ({
  getCredentialForSelectedCalendar,
}));
