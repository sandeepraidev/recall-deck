"use client";

import { Suspense, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDecks } from "@/hooks/useDecks";
import BackButton from "@/components/layout/BackButton";
import CollectionRow from "@/components/deck/CollectionRow";
import ConfirmSheet from "@/components/ui/ConfirmSheet";
import EditDetailsSheet from "@/components/ui/EditDetailsSheet";
import { chipBg, chipFg, ACCENT } from "@/lib/colors";
import { MODES } from "@/lib/modes";
import { parseDeckFile } from "@/lib/exportDeck";

function CollectionContent() {
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get("id") ?? "";
  const { isLoaded, getCategory, getDecksForCategory, createDeck, importDeck, deleteDeck, getDeck, updateCategory } = useDecks();
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [importError, setImportError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isLoaded) return null;

  const category = getCategory(id);
  if (!category) {
    return (
      <div className="pt-10 text-center text-muted">
        Collection not found. <button onClick={() => router.push("/")} className="text-accent">Go home</button>
      </div>
    );
  }

  const decks = getDecksForCategory(category.id);
  const bg = chipBg(category.hue);
  const fg = chipFg(category.hue);

  function openAddForm() {
    setIsAdding(true);
    setNewTitle("");
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function cancelAddForm() {
    setIsAdding(false);
    setNewTitle("");
  }

  function handleAddCollection() {
    const title = newTitle.trim();
    if (!title) return;
    const deck = createDeck(category!.id, { title, sub: "" });
    router.push(`/deck?id=${deck.id}`);
  }

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    try {
      const parsed = await parseDeckFile(file);
      if (parsed.cards.some((c) => c.mode !== category!.mode)) {
        setImportError(`This file's cards don't match ${MODES[category!.mode].name}.`);
        return;
      }
      setImportError("");
      const deck = importDeck(category!.id, parsed);
      router.push(`/deck?id=${deck.id}`);
    } catch (err) {
      setImportError(err instanceof Error ? err.message : "Couldn't import that file.");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between pt-1.5">
        <BackButton onClick={() => router.push("/")} />
        <button
          type="button"
          onClick={() => setEditing(true)}
          aria-label="Edit deck"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#3a3730" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
          </svg>
        </button>
      </div>
      <EditDetailsSheet
        open={editing}
        heading="Edit deck"
        title={category.title}
        sub={category.sub}
        onCancel={() => setEditing(false)}
        onSave={(values) => {
          updateCategory(category.id, values);
          setEditing(false);
        }}
      />
      <div className="pt-4">
        <span className="rounded-[7px] px-2.5 py-1 text-[11px] font-bold tracking-wide" style={{ color: fg, background: bg }}>
          {MODES[category.mode].name}
        </span>
        <div className="mb-1.5 mt-3 text-[27px] font-extrabold tracking-tight text-foreground">{category.title}</div>
        <div className="text-[14px] leading-relaxed text-muted">{category.sub}</div>
      </div>

      <div className="px-0.5 pb-3 pt-[22px] text-[13px] font-bold tracking-wide text-muted">COLLECTIONS</div>
      {decks.map((d) => (
        <CollectionRow key={d.id} deck={d} chipBg={bg} chipFg={fg} onLongPress={() => setPendingDelete(d.id)} />
      ))}

      <ConfirmSheet
        open={pendingDelete !== null}
        title={`Delete "${(pendingDelete && getDeck(pendingDelete)?.title) || "collection"}"?`}
        message="The collection and all its cards will be removed. This can't be undone."
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) deleteDeck(pendingDelete);
          setPendingDelete(null);
        }}
      />

      {isAdding ? (
        <div className="flex w-full items-center gap-2.5 rounded-[20px] border-[1.5px] border-dashed border-border-strong py-3 px-4">
          <input
            ref={inputRef}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddCollection();
              if (e.key === "Escape") cancelAddForm();
            }}
            placeholder="Collection name"
            className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[14.5px] font-bold text-foreground outline-none"
          />
          <button type="button" onClick={cancelAddForm} className="flex-none text-[14px] font-semibold text-muted">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAddCollection}
            disabled={!newTitle.trim()}
            className="flex-none text-[14px] font-extrabold disabled:opacity-40"
            style={{ color: ACCENT }}
          >
            Add
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={openAddForm}
          className="flex w-full items-center justify-center gap-2.5 rounded-[20px] border-[1.5px] border-dashed border-border-strong py-4 text-[14.5px] font-bold"
          style={{ color: fg }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={fg} strokeWidth="2.4" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New collection
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        onChange={handleImportFile}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="mt-2.5 w-full text-center text-[13.5px] font-semibold text-muted"
      >
        Import a collection from JSON
      </button>
      {importError && <div className="mt-1.5 text-center text-[12.5px] font-semibold text-red-600">{importError}</div>}
    </div>
  );
}

export default function CollectionPage() {
  return (
    <Suspense>
      <CollectionContent />
    </Suspense>
  );
}
