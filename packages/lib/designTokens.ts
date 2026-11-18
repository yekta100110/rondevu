/**
 * Single source of truth for design values that JavaScript has to read
 * (inline styles, Web Animations, third-party component props).
 * CSS consumers read the same values from packages/config/theme/tokens.css;
 * designTokens.test.ts keeps both in sync.
 */
export const designTokens = {
  accent: {
    sky: "#62aef0",
    marigold: "#ffb110",
    coral: "#f64932",
    coralOnDark: "#ff6a55",
    mocha: "#b18164",
    midnight: "#02093a",
  },
  brand: {
    light: "#0075de",
    dark: "#4aa3f2",
  },
  surface: {
    darkBase: "#191918",
  },
  motion: {
    easeStandard: "cubic-bezier(0.2, 0, 0, 1)",
    easeEmphasized: "cubic-bezier(0.16, 1, 0.3, 1)",
    fastMs: 120,
    baseMs: 200,
    slowMs: 400,
  },
  radius: {
    controlPx: 8,
    cardPx: 12,
    stagePx: 24,
  },
} as const;

export type DesignTokens = typeof designTokens;
