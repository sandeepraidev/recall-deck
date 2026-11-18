"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_LANG, speak, stop } from "@/lib/audio/speak";

// Tracks which text is currently playing so each speaker button can show its
// own state. Audio is cut when the component unmounts (e.g. card change).
export function useSpeech(lang: string = DEFAULT_LANG) {
  const [playing, setPlaying] = useState<string | null>(null);
  const token = useRef(0);

  const play = useCallback(
    async (text: string) => {
      const mine = ++token.current;
      setPlaying(text);
      try {
        await speak(text, lang);
      } catch {
        // Missing voice / TTS engine: fail silently rather than break review.
      } finally {
        if (token.current === mine) setPlaying(null);
      }
    },
    [lang],
  );

  useEffect(() => {
    const t = token;
    return () => {
      t.current++;
      void stop();
    };
  }, []);

  return { playing, play };
}
