import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const i18nJson = require("../../i18n.json");
const config = require("./next-i18next.config");

describe("@calcom/i18n/next-i18next.config", () => {
  it("exports i18n with defaultLocale and locales", () => {
    expect(config.i18n).toBeDefined();
    expect(config.i18n.defaultLocale).toBe("tr");
    expect(Array.isArray(config.i18n.locales)).toBe(true);
    expect(config.i18n.locales).toContain("tr");
    expect(config.i18n.locales).toContain("en");
  });

  it("includes all target locales from i18n.json plus the source locale", () => {
    const expectedLocales = Array.from(new Set([...i18nJson.locale.targets, i18nJson.locale.source]));
    for (const locale of expectedLocales) {
      expect(config.i18n.locales).toContain(locale);
    }
    expect(config.i18n.locales.length).toBe(expectedLocales.length);
  });

  it("has localePath pointing to existing locales directory", () => {
    expect(config.localePath).toBeDefined();
    expect(typeof config.localePath).toBe("string");
    expect(fs.existsSync(config.localePath)).toBe(true);
  });

  it("has fallbackLng configured", () => {
    expect(config.fallbackLng).toBeDefined();
    expect(config.fallbackLng.default).toEqual(["tr", "en"]);
  });

  it("every locale in config has a corresponding locale directory with common.json", () => {
    const localesDir = config.localePath;
    for (const locale of config.i18n.locales) {
      const localeDir = path.join(localesDir, locale);
      const commonJson = path.join(localeDir, "common.json");
      expect(fs.existsSync(localeDir)).toBe(true);
      expect(fs.existsSync(commonJson)).toBe(true);
    }
  });

  it("turkish and english common.json are valid JSON with translation keys", () => {
    for (const locale of ["tr", "en"]) {
      const localePath = path.join(config.localePath, locale, "common.json");
      const translations = JSON.parse(fs.readFileSync(localePath, "utf-8"));
      expect(typeof translations).toBe("object");
      expect(Object.keys(translations).length).toBeGreaterThan(0);
    }
  });
});
