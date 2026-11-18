import type { Card, Deck, StoryContent } from "@/lib/types";
import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import { normalizeCard } from "@/lib/examples";

export type ImportedDeck = Pick<Deck, "title" | "sub" | "cards" | "story">;

export async function parseDeckFile(file: File): Promise<ImportedDeck> {
  const text = await file.text();
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("That file isn't valid JSON.");
  }

  if (
    typeof data !== "object" ||
    data === null ||
    typeof (data as { title?: unknown }).title !== "string" ||
    !Array.isArray((data as { cards?: unknown }).cards)
  ) {
    throw new Error("That file doesn't look like a deck export.");
  }

  const record = data as { title: string; sub?: unknown; cards: unknown[]; story?: unknown };
  return {
    title: record.title,
    sub: typeof record.sub === "string" ? record.sub : "",
    cards: (record.cards as Card[]).map(normalizeCard),
    story: record.story as StoryContent | undefined,
  };
}

export async function exportDeckAsJson(deck: Deck) {
  const json = JSON.stringify(deck, null, 2);
  const filename = `${deck.title.replace(/\s+/g, "_")}.json`;

  if (Capacitor.isNativePlatform()) {
    // Write to cache directory then share — works on Android
    await Filesystem.writeFile({
      path: filename,
      data: json,
      directory: Directory.Cache,
      encoding: "utf8" as never,
    });

    const fileUri = await Filesystem.getUri({
      path: filename,
      directory: Directory.Cache,
    });

    await Share.share({
      title: deck.title,
      url: fileUri.uri,
      dialogTitle: `Export "${deck.title}"`,
    });
  } else {
    // Web fallback
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(json);
    const a = document.createElement("a");
    a.href = dataUri;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
