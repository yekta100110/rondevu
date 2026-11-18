import { vi } from "vitest";

vi.mock("@rondevu/lib/logger", () => ({
  default: {
    getSubLogger: () => ({
      debug: vi.fn(),
      error: vi.fn(),
      log: vi.fn(),
    }),
  },
}));

vi.mock("@rondevu/lib/crypto", () => ({
  symmetricDecrypt: () => `{
      "userApiKey": "test"
    }`,
}));

export {};
