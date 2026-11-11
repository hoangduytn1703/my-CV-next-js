export type Bezier = [number, number, number, number];

/** Expo-like ease out — used for most reveals. */
export const EASE_OUT: Bezier = [0.22, 1, 0.36, 1];
/** Strong in-out — used for curtains / page-level wipes. */
export const EASE_IN_OUT: Bezier = [0.76, 0, 0.24, 1];

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
