import { Capacitor } from "@capacitor/core";

export const DEFAULT_LANG = "en-US";

type TtsPlugin = typeof import("@capacitor-community/text-to-speech").TextToSpeech;

// The plugin's web class touches `window` at import time, which breaks static
// prerender, so it is only imported on native.
//
// The plugin is a Capacitor Proxy that answers *every* property — including
// `then` — with a native method wrapper. Resolving a promise with it directly
// makes the promise treat it as a thenable and hang forever, so it is wrapped
// in a plain object.
let ttsModule: Promise<{ tts: TtsPlugin }> | null = null;
const loadTts = () =>
  (ttsModule ??= import("@capacitor-community/text-to-speech").then((m) => ({ tts: m.TextToSpeech })));

// Android WebView's speechSynthesis is unreliable, so native uses the plugin
// and the browser falls back to the Web Speech API.
export async function speak(text: string, lang: string = DEFAULT_LANG, rate = 0.9): Promise<void> {
  const clean = text.trim();
  if (!clean) return;
  await stop();

  if (Capacitor.isNativePlatform()) {
    const { tts } = await loadTts();
    await tts.speak({ text: clean, lang, rate, pitch: 1, volume: 1, category: "playback" });
    return;
  }

  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  await new Promise<void>((resolve) => {
    const u = new SpeechSynthesisUtterance(clean);
    u.lang = lang;
    u.rate = rate;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    window.speechSynthesis.speak(u);
  });
}

export async function stop(): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    const { tts } = await loadTts();
    await tts.stop().catch(() => {});
  } else if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
