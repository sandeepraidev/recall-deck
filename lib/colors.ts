export interface CardColor {
  id: string;
  label: string;
  front: string;       // gradient for front face
  back: string;        // gradient for back face
  text: string;        // primary text color
  subtext: string;     // muted text color
  border: string;      // border / shine color
  dot: string;         // swatch preview color (solid)
}

export const CARD_COLORS: CardColor[] = [
  {
    id: "ocean",
    label: "Ocean",
    front: "linear-gradient(135deg, #1e3a5f 0%, #1a6b8a 50%, #0d9488 100%)",
    back:  "linear-gradient(135deg, #0d9488 0%, #1a6b8a 50%, #1e3a5f 100%)",
    text: "#e0f7f4",
    subtext: "#94d4cc",
    border: "rgba(255,255,255,0.15)",
    dot: "#1a6b8a",
  },
  {
    id: "sunset",
    label: "Sunset",
    front: "linear-gradient(135deg, #7c1d6f 0%, #c2185b 50%, #f57c00 100%)",
    back:  "linear-gradient(135deg, #f57c00 0%, #c2185b 50%, #7c1d6f 100%)",
    text: "#fff3e0",
    subtext: "#ffcc80",
    border: "rgba(255,255,255,0.2)",
    dot: "#c2185b",
  },
  {
    id: "forest",
    label: "Forest",
    front: "linear-gradient(135deg, #1b4332 0%, #2d6a4f 50%, #52b788 100%)",
    back:  "linear-gradient(135deg, #52b788 0%, #2d6a4f 50%, #1b4332 100%)",
    text: "#d8f3dc",
    subtext: "#95d5b2",
    border: "rgba(255,255,255,0.15)",
    dot: "#2d6a4f",
  },
  {
    id: "violet",
    label: "Violet",
    front: "linear-gradient(135deg, #2d1b69 0%, #6c3483 50%, #9b59b6 100%)",
    back:  "linear-gradient(135deg, #9b59b6 0%, #6c3483 50%, #2d1b69 100%)",
    text: "#f5eef8",
    subtext: "#d7bde2",
    border: "rgba(255,255,255,0.18)",
    dot: "#6c3483",
  },
  {
    id: "rose",
    label: "Rose",
    front: "linear-gradient(135deg, #881337 0%, #e11d48 50%, #fb7185 100%)",
    back:  "linear-gradient(135deg, #fb7185 0%, #e11d48 50%, #881337 100%)",
    text: "#fff1f2",
    subtext: "#fda4af",
    border: "rgba(255,255,255,0.2)",
    dot: "#e11d48",
  },
  {
    id: "midnight",
    label: "Midnight",
    front: "linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #2d2d6b 100%)",
    back:  "linear-gradient(135deg, #2d2d6b 0%, #1a1a3e 50%, #0f0f23 100%)",
    text: "#e8e8ff",
    subtext: "#9898d0",
    border: "rgba(255,255,255,0.12)",
    dot: "#2d2d6b",
  },
  {
    id: "amber",
    label: "Amber",
    front: "linear-gradient(135deg, #78350f 0%, #d97706 50%, #fbbf24 100%)",
    back:  "linear-gradient(135deg, #fbbf24 0%, #d97706 50%, #78350f 100%)",
    text: "#fffbeb",
    subtext: "#fde68a",
    border: "rgba(255,255,255,0.2)",
    dot: "#d97706",
  },
  {
    id: "slate",
    label: "Slate",
    front: "linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)",
    back:  "linear-gradient(135deg, #475569 0%, #334155 50%, #1e293b 100%)",
    text: "#f1f5f9",
    subtext: "#94a3b8",
    border: "rgba(255,255,255,0.12)",
    dot: "#334155",
  },
];

export const DEFAULT_COLOR_ID = "ocean";

export function getCardColor(id: string): CardColor {
  return CARD_COLORS.find((c) => c.id === id) ?? CARD_COLORS[0];
}
