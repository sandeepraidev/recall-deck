import { CapacitorSQLite, SQLiteConnection, type SQLiteDBConnection } from "@capacitor-community/sqlite";
import type { Card, Category, Deck } from "@/lib/types";
import {
  rowToCard,
  rowToCategory,
  rowToDeck,
  rowsToStory,
  type CardRow,
  type CategoryRow,
  type DeckRow,
  type DeckStoryRow,
  type ListItemRow,
} from "@/lib/sqlite/mappers";

// Read-only access to the SQLite database older versions of the app stored
// everything in. It is opened once, on the first launch of this version, so
// lib/legacyMigration.ts can copy the user's data into user-data.json.
const DB_NAME = "recall_deck";

export interface LegacySnapshot {
  categories: Category[];
  // Only cards the user touched (reviewed, edited or created) are loaded in
  // full; untouched built-in cards are identical to content/ anyway.
  decks: Deck[];
  // Every card id in each deck, touched or not.
  cardIdsByDeck: Map<string, Set<string>>;
  meta: Map<string, string>;
}

// Built-in card ids look like "card-12" or "pack6-card-40"; the user's own are UUIDs.
const TOUCHED_CARD = "(updated_at <> created_at OR NOT (id GLOB 'card-[0-9]*' OR id GLOB 'pack[0-9]*-card-[0-9]*'))";

// Returns null when this device never had the old database.
export async function readLegacyDatabase(): Promise<LegacySnapshot | null> {
  const { result: exists } = await CapacitorSQLite.isDatabase({ database: DB_NAME });
  if (!exists) return null;

  const sqlite = new SQLiteConnection(CapacitorSQLite);
  const { result: open } = await sqlite.isConnection(DB_NAME, true);
  const db = open
    ? await sqlite.retrieveConnection(DB_NAME, true)
    : await sqlite.createConnection(DB_NAME, false, "no-encryption", 1, true);
  await db.open();
  try {
    return await loadAll(db);
  } finally {
    await sqlite.closeConnection(DB_NAME, true).catch(() => undefined);
  }
}

async function select<T>(db: SQLiteDBConnection, sql: string): Promise<T[]> {
  return ((await db.query(sql)).values ?? []) as T[];
}

async function loadAll(db: SQLiteDBConnection): Promise<LegacySnapshot> {
  const categoryRows = await select<CategoryRow>(db, "SELECT * FROM categories");
  const deckRows = await select<DeckRow>(db, "SELECT * FROM decks");
  const cardRows = await select<CardRow>(db, `SELECT * FROM cards WHERE ${TOUCHED_CARD}`);
  const idRows = await select<{ id: string; deck_id: string }>(db, "SELECT id, deck_id FROM cards");
  const storyRows = await select<DeckStoryRow>(db, "SELECT * FROM deck_story");
  const listItemRows = await select<ListItemRow>(
    db,
    `SELECT * FROM list_items WHERE owner_type = 'deck_story' OR owner_id IN (SELECT id FROM cards WHERE ${TOUCHED_CARD}) ORDER BY position`
  );
  const metaRows = await select<{ key: string; value: string }>(db, "SELECT key, value FROM app_meta");

  const listItemsByOwner = new Map<string, Map<string, string[]>>();
  for (const li of listItemRows) {
    const ownerKey = `${li.owner_type}:${li.owner_id}`;
    if (!listItemsByOwner.has(ownerKey)) listItemsByOwner.set(ownerKey, new Map());
    const fieldMap = listItemsByOwner.get(ownerKey)!;
    if (!fieldMap.has(li.field)) fieldMap.set(li.field, []);
    fieldMap.get(li.field)!.push(li.value);
  }

  const cardsByDeck = new Map<string, Card[]>();
  for (const row of cardRows) {
    const card = rowToCard(row, listItemsByOwner.get(`card:${row.id}`) ?? new Map());
    if (!cardsByDeck.has(row.deck_id)) cardsByDeck.set(row.deck_id, []);
    cardsByDeck.get(row.deck_id)!.push(card);
  }

  const storyByDeck = new Map(storyRows.map((row) => [row.deck_id, row]));
  const decks = deckRows.map((row) => {
    const storyRow = storyByDeck.get(row.id);
    const story = storyRow ? rowsToStory(storyRow, listItemsByOwner.get(`deck_story:${row.id}`) ?? new Map()) : undefined;
    return rowToDeck(row, cardsByDeck.get(row.id) ?? [], story);
  });

  const cardIdsByDeck = new Map<string, Set<string>>();
  for (const { id, deck_id } of idRows) {
    if (!cardIdsByDeck.has(deck_id)) cardIdsByDeck.set(deck_id, new Set());
    cardIdsByDeck.get(deck_id)!.add(id);
  }

  return {
    categories: categoryRows.map(rowToCategory),
    decks,
    cardIdsByDeck,
    meta: new Map(metaRows.map((r) => [r.key, r.value])),
  };
}
