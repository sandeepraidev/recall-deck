import type { Deck } from "@/lib/types";
import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";

export async function exportDeckAsJson(deck: Deck) {
  const json = JSON.stringify(deck, null, 2);
  const filename = `${deck.name.replace(/\s+/g, "_")}.json`;

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
      title: deck.name,
      url: fileUri.uri,
      dialogTitle: `Export "${deck.name}"`,
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
