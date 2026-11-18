"use client";

import { useSpeech } from "@/hooks/useSpeech";

interface SpeakButtonProps {
  text: string;
  lang?: string;
  color: string;
  size?: number;
}

export default function SpeakButton({ text, lang, color, size = 36 }: SpeakButtonProps) {
  const { playing, play } = useSpeech(lang);
  const active = playing === text;

  return (
    <button
      type="button"
      aria-label={`Pronounce ${text}`}
      onClick={(e) => {
        // The card itself toggles flip on click.
        e.stopPropagation();
        void play(text);
      }}
      className="flex flex-none items-center justify-center rounded-full border border-border bg-white"
      style={{ width: size, height: size, opacity: active ? 0.6 : 1 }}
    >
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M15.5 8.5a5 5 0 0 1 0 7" />
        <path d="M18.5 5.5a9 9 0 0 1 0 13" />
      </svg>
    </button>
  );
}
