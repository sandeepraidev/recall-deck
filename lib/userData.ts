import { Capacitor } from "@capacitor/core";
import { Directory, Encoding, Filesystem } from "@capacitor/filesystem";
import type { Card, Category, Deck } from "@/lib/types";

// Everything the user owns, saved as one JSON file on the device. Built-in
// content ships in content/ and is never copied here: this file only records
// how the user's library differs from it.
export interface CardProgress {
  learned: boolean;
  reviewCount: number;
  dueAt: string | null;
  updatedAt: string;
}

export interface UserData {
  version: 1;
  // Review progress for every card, built-in or the user's own.
  progress: Record<string, CardProgress>;
  // Built-in content the user changed or removed. Edits win over later
  // content updates; untouched items always show the bundled version.
  editedCategories: Record<string, Pick<Category, "title" | "sub" | "updatedAt">>;
  editedDecks: Record<string, Pick<Deck, "title" | "sub" | "updatedAt">>;
  editedCards: Record<string, Card>;
  deletedCategories: string[];
  deletedDecks: string[];
  deletedCards: string[];
  // The user's own content.
  categories: Category[];
  decks: Deck[];
  // Cards the user added to built-in decks, keyed by deck id.
  addedCards: Record<string, Card[]>;
}

export function emptyUserData(): UserData {
  return {
    version: 1,
    progress: {},
    editedCategories: {},
    editedDecks: {},
    editedCards: {},
    deletedCategories: [],
    deletedDecks: [],
    deletedCards: [],
    categories: [],
    decks: [],
    addedCards: {},
  };
}

const FILE = "user-data.json";
const TEMP_FILE = "user-data.json.tmp";
const WEB_KEY = "recall-deck:user-data";

const isNative = () => Capacitor.isNativePlatform();

async function readNative(path: string): Promise<string | null> {
  try {
    const { data } = await Filesystem.readFile({ path, directory: Directory.Data, encoding: Encoding.UTF8 });
    return typeof data === "string" ? data : await data.text();
  } catch {
    return null; // the file doesn't exist yet
  }
}

// Returns null when nothing has been saved yet (first launch).
export async function readUserData(): Promise<UserData | null> {
  let text: string | null;
  if (isNative()) {
    // A leftover temp file means the app stopped between writing it and
    // renaming it over the real file, so it holds the newest data.
    text = (await readNative(TEMP_FILE)) ?? (await readNative(FILE));
  } else {
    text = localStorage.getItem(WEB_KEY);
  }
  if (text === null) return null;
  return { ...emptyUserData(), ...(JSON.parse(text) as UserData) };
}

async function writeNow(data: UserData): Promise<void> {
  const text = JSON.stringify(data);
  if (!isNative()) {
    localStorage.setItem(WEB_KEY, text);
    return;
  }
  // Write a temp file first and rename it over the real one, so a crash
  // mid-write never leaves a half-written file behind.
  await Filesystem.writeFile({ path: TEMP_FILE, directory: Directory.Data, data: text, encoding: Encoding.UTF8 });
  try {
    await Filesystem.rename({ from: TEMP_FILE, to: FILE, directory: Directory.Data, toDirectory: Directory.Data });
  } catch {
    await Filesystem.deleteFile({ path: FILE, directory: Directory.Data }).catch(() => undefined);
    await Filesystem.rename({ from: TEMP_FILE, to: FILE, directory: Directory.Data, toDirectory: Directory.Data });
  }
}

// Saves are coalesced: a burst of changes (e.g. swiping through cards)
// becomes one write shortly after the last change, and writes never overlap.
const SAVE_DELAY_MS = 400;
let pending: UserData | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;
let writing: Promise<void> = Promise.resolve();

export function saveUserData(data: UserData): void {
  pending = data;
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => void flushUserData(), SAVE_DELAY_MS);
}

export function flushUserData(): Promise<void> {
  if (timer) clearTimeout(timer);
  timer = null;
  const data = pending;
  pending = null;
  if (!data) return writing;
  writing = writing
    .then(() => writeNow(data))
    .catch((err) => console.error("[userData] save failed", err));
  return writing;
}

// Save immediately when the app goes to the background, since it may be
// killed there without another chance.
if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") void flushUserData();
  });
}
