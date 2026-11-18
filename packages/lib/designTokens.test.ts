import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { designTokens } from "./designTokens";

const css = readFileSync(path.join(__dirname, "../config/theme/tokens.css"), "utf8");
const rootCss = css.slice(css.indexOf("Shared design tokens"));
const darkStart = rootCss.indexOf(".dark {");
const lightCss = rootCss.slice(0, darkStart);
const darkCss = rootCss.slice(darkStart);

const read = (block: string, name: string) =>
  new RegExp(`--${name}:\\s*([^;]+);`).exec(block)?.[1].trim();

describe("designTokens stay in sync with tokens.css", () => {
  it("accent colors", () => {
    expect(read(lightCss, "accent-sky")).toBe(designTokens.accent.sky);
    expect(read(lightCss, "accent-marigold")).toBe(designTokens.accent.marigold);
    expect(read(lightCss, "accent-coral")).toBe(designTokens.accent.coral);
    expect(read(darkCss, "accent-coral")).toBe(designTokens.accent.coralOnDark);
    expect(read(lightCss, "accent-mocha")).toBe(designTokens.accent.mocha);
    expect(read(lightCss, "accent-midnight")).toBe(designTokens.accent.midnight);
  });

  it("motion", () => {
    expect(read(lightCss, "ease-standard")).toBe(designTokens.motion.easeStandard);
    expect(read(lightCss, "ease-emphasized")).toBe(designTokens.motion.easeEmphasized);
    expect(read(lightCss, "motion-fast")).toBe(`${designTokens.motion.fastMs}ms`);
    expect(read(lightCss, "motion-base")).toBe(`${designTokens.motion.baseMs}ms`);
    expect(read(lightCss, "motion-slow")).toBe(`${designTokens.motion.slowMs}ms`);
  });

  it("radius", () => {
    const rem = (v: string | undefined) => (v ? Number.parseFloat(v) * 16 : Number.NaN);
    expect(rem(read(lightCss, "radius-control"))).toBe(designTokens.radius.controlPx);
    expect(rem(read(lightCss, "radius-card"))).toBe(designTokens.radius.cardPx);
    expect(rem(read(lightCss, "radius-stage"))).toBe(designTokens.radius.stagePx);
  });

  it("brand colors match the theme tokens", () => {
    const lightBrand = /:root,\n:host \{[\s\S]*?--rondevu-brand:\s*([^;]+);/.exec(css)?.[1].trim();
    const darkBrand = /\.dark \{[\s\S]*?--rondevu-brand:\s*([^;]+);/.exec(css)?.[1].trim();
    expect(lightBrand).toBe(designTokens.brand.light);
    expect(darkBrand).toBe(designTokens.brand.dark);
  });
});
