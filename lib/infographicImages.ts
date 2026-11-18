import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import { toPng } from "html-to-image";
import type { InfographicCard } from "@/lib/types";

// Phone photos are several MB each and live in SQLite as data URLs, so
// imported pictures are scaled down and re-encoded before being stored.
const MAX_EDGE = 1280;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("That file isn't a readable image."));
    img.src = src;
  });
}

export async function fileToDataUrl(file: File): Promise<string> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await loadImage(objectUrl);
    const scale = Math.min(1, MAX_EDGE / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Couldn't process that image.");
    // JPEG has no alpha, so paint white first or transparent PNGs go black.
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.85);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export function titleFromFilename(name: string): string {
  return name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim() || "Image";
}

function safeName(title: string, i: number): string {
  const base = title.replace(/[^\w\- ]+/g, "").trim().replace(/\s+/g, "_") || "infographic";
  return `${String(i + 1).padStart(2, "0")}_${base}.png`;
}

// `nodes` are the rendered cards, in the same order as `cards`. Image cards
// skip rendering and export their stored picture directly.
export async function exportInfographicImages(
  deckTitle: string,
  cards: InfographicCard[],
  nodes: (HTMLElement | null)[],
): Promise<void> {
  const files: { name: string; base64: string }[] = [];
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    let dataUrl: string;
    if (card.layout === "image" && card.image) {
      dataUrl = card.image;
    } else {
      const node = nodes[i];
      if (!node) continue;
      dataUrl = await toPng(node, { pixelRatio: 2, backgroundColor: "#ffffff" });
    }
    const ext = dataUrl.startsWith("data:image/jpeg") ? "jpg" : "png";
    files.push({ name: safeName(card.title, i).replace(/\.png$/, `.${ext}`), base64: dataUrl.split(",")[1] });
  }
  if (files.length === 0) throw new Error("Nothing to export.");

  if (Capacitor.isNativePlatform()) {
    const uris: string[] = [];
    for (const f of files) {
      await Filesystem.writeFile({ path: f.name, data: f.base64, directory: Directory.Cache });
      uris.push((await Filesystem.getUri({ path: f.name, directory: Directory.Cache })).uri);
    }
    await Share.share({ title: deckTitle, files: uris, dialogTitle: `Export "${deckTitle}"` });
  } else {
    for (const f of files) {
      const a = document.createElement("a");
      a.href = `data:image/${f.name.endsWith(".jpg") ? "jpeg" : "png"};base64,${f.base64}`;
      a.download = f.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }
}
