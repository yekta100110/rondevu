// rOndevu design system: single easing curve and the spring used by every sliding "pill"
// (selected day, selected slot, active step). See docs/design-system.md §5.
export const bookerEase = [0.16, 1, 0.3, 1] as const;

export const bookerPillSpring = { type: "spring", stiffness: 500, damping: 38 } as const;
