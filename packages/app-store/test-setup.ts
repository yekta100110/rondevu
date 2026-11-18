import matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { afterEach, expect, vi } from "vitest";

vi.mock("@rondevu/lib/OgImages", async () => {
  return {};
});

vi.mock("@rondevu/lib/hooks/useLocale", () => ({
  useLocale: () => {
    return {
      t: (str: string) => str,
      isLocaleReady: true,
      i18n: {
        language: "en",
        defaultLocale: "en",
        locales: ["en"],
        exists: () => false,
      },
    };
  },
}));

vi.mock("@rondevu/atoms/hooks/useIsPlatform", () => ({
  useIsPlatform: () => {
    return false;
  },
}));
vi.mock("@rondevu/ui/classNames", () => ({
  default: (...args: string[]) => {
    return args.filter(Boolean).join(" ");
  },
}));

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
