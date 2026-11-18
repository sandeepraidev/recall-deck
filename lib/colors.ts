// Colors are derived procedurally from a deck category's hue, not chosen from
// a fixed preset list — this mirrors the artifact's chipBg/chipFg helpers.
export function chipBg(hue: number): string {
  return `oklch(0.95 0.045 ${hue})`;
}

export function chipFg(hue: number): string {
  return `oklch(0.47 0.13 ${hue})`;
}

export const ACCENT = "oklch(0.56 0.15 285)";
export const ACCENT_HOVER = "oklch(0.48 0.16 285)";
export const ACCENT_GRADIENT =
  "linear-gradient(135deg, oklch(0.58 0.15 285) 0%, oklch(0.5 0.16 292) 100%)";
