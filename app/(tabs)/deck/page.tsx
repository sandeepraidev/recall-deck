"use client";

import { Suspense, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDecks } from "@/hooks/useDecks";
import { useLongPress } from "@/hooks/useLongPress";
import BackButton from "@/components/layout/BackButton";
import StatTile from "@/components/deck/StatTile";
import CardListRow from "@/components/deck/CardListRow";
import ConfirmSheet from "@/components/ui/ConfirmSheet";
import EditDetailsSheet from "@/components/ui/EditDetailsSheet";
import { chipBg, chipFg, ACCENT } from "@/lib/colors";
import { MODES } from "@/lib/modes";
import { computeDueCount, computeLearnedCount } from "@/lib/scheduling";
import { exportDeckAsJson } from "@/lib/exportDeck";
import { exportInfographicImages, fileToDataUrl, titleFromFilename } from "@/lib/infographicImages";
import InfographicView from "@/components/infographic/InfographicView";
import type { Card, InfographicCard } from "@/lib/types";

function DeckContent() {
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get("id") ?? "";
  const { isLoaded, getDeck, getCategory, deleteCard, deleteDeck, addCard, updateDeck } = useDecks();
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [confirmDeleteDeck, setConfirmDeleteDeck] = useState(false);
  const [editing, setEditing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [imageStatus, setImageStatus] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const exportNodes = useRef<(HTMLElement | null)[]>([]);
  // Deleting the collection is hidden behind a long press on its title.
  const titlePress = useLongPress(() => setConfirmDeleteDeck(true));

  if (!isLoaded) return null;

  const deck = getDeck(id);
  if (!deck) {
    return (
      <div className="pt-10 text-center text-muted">
        Deck not found. <button onClick={() => router.push("/")} className="text-accent">Go home</button>
      </div>
    );
  }

  const category = getCategory(deck.categoryId);
  const hue = category?.hue ?? 285;
  const bg = chipBg(hue);
  const fg = chipFg(hue);
  const due = computeDueCount(deck);
  const learned = computeLearnedCount(deck);

  const infographicCards = deck.cards.filter((c): c is InfographicCard => c.mode === "infographic");

  async function handleImportImages(files: FileList | null) {
    if (!files || files.length === 0) return;
    setImageStatus(`Importing ${files.length} image${files.length === 1 ? "" : "s"}…`);
    let added = 0;
    let firstError = "";
    for (const file of Array.from(files)) {
      try {
        const image = await fileToDataUrl(file);
        const now = new Date().toISOString();
        const card: Card = {
          id: crypto.randomUUID(),
          mode: "infographic",
          layout: "image",
          title: titleFromFilename(file.name),
          items: [],
          image,
          tags: [],
          learned: false,
          reviewCount: 0,
          dueAt: null,
          createdAt: now,
          updatedAt: now,
        };
        addCard(deck!.id, card);
        added += 1;
      } catch (err) {
        // Skip unreadable files; the summary below reports how many made it and why not.
        if (!firstError) firstError = err instanceof Error ? err.message : String(err);
      }
    }
    setImageStatus(`Added ${added} of ${files.length} image${files.length === 1 ? "" : "s"}.${firstError ? ` ${firstError}` : ""}`);
    if (fileInput.current) fileInput.current.value = "";
  }

  async function handleExportImages() {
    setExporting(true);
    setImageStatus(null);
    try {
      // Let the off-screen cards mount before they are rasterised.
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      await exportInfographicImages(deck!.title, infographicCards, exportNodes.current);
    } catch (err) {
      setImageStatus(err instanceof Error ? err.message : "Export failed.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between pt-1.5">
        <BackButton onClick={() => (category ? router.push(`/collection?id=${category.id}`) : router.push("/"))} />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label="Edit collection"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#3a3730" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => exportDeckAsJson(deck)}
            aria-label="Export collection"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#3a3730" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 15V3" />
              <path d="M7 8l5-5 5 5" />
              <path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
            </svg>
          </button>
</div>
      </div>

      <div className="pt-[18px]">
        {category && (
          <span className="rounded-[7px] px-2.5 py-1 text-[11px] font-bold tracking-wide" style={{ color: fg, background: bg }}>
            {MODES[category.mode].name}
          </span>
        )}
        <div {...titlePress} className="select-none [-webkit-touch-callout:none]">
          <div className="mb-1.5 mt-3 text-[26px] font-extrabold tracking-tight text-foreground">{deck.title}</div>
          <div className="text-[14px] leading-relaxed text-muted">{deck.sub}</div>
        </div>

        <div className="my-5 flex gap-2.5">
          <StatTile value={deck.cards.length} label="Cards" />
          <StatTile value={due} label="Due today" color={fg} />
          <StatTile value={learned} label="Learned" />
        </div>

        <Link
          href={`/deck/review?id=${deck.id}`}
          className="mb-2 flex h-[54px] items-center justify-center gap-2.5 rounded-2xl text-[16px] font-bold text-white"
          style={{ background: ACCENT, boxShadow: `0 14px 26px -12px ${ACCENT}` }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="#fff">
            <polygon points="6 4 20 12 6 20 6 4" />
          </svg>
          {due > 0 ? `Start review · ${due} due` : `Practice all · ${deck.cards.length} cards`}
        </Link>

        {category?.mode === "infographic" && (
          <div className="mb-2 flex gap-2">
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              className="flex h-[48px] flex-1 items-center justify-center rounded-2xl border border-border-strong bg-white text-[14.5px] font-bold text-[#3a3730]"
            >
              Import images
            </button>
            <button
              type="button"
              onClick={handleExportImages}
              disabled={exporting || infographicCards.length === 0}
              className="flex h-[48px] flex-1 items-center justify-center rounded-2xl border border-border-strong bg-white text-[14.5px] font-bold text-[#3a3730] disabled:opacity-40"
            >
              {exporting ? "Exporting…" : "Export as images"}
            </button>
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleImportImages(e.target.files)}
            />
          </div>
        )}
        {imageStatus && <div className="mb-2 text-center text-[13px] text-muted">{imageStatus}</div>}

        {deck.story && (
          <Link
            href={`/deck/story?id=${deck.id}`}
            className="mb-2 flex h-[52px] items-center justify-center gap-2.5 rounded-2xl border border-border-strong bg-white text-[15px] font-bold text-[#3a3730]"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={fg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 5h13a2 2 0 0 1 2 2v12a1 1 0 0 1-1.5.87A4 4 0 0 0 15 19H4z" />
              <line x1="7" y1="9" x2="15" y2="9" />
              <line x1="7" y1="13" x2="13" y2="13" />
            </svg>
            Read the story · uses your words
          </Link>
        )}
      </div>

      <div className="px-0.5 pb-2 pt-[18px] text-[13px] font-bold tracking-wide text-muted">ALL CARDS</div>
      {deck.cards.map((c) => (
        <CardListRow key={c.id} card={c} deckId={deck.id} deckHue={hue} onLongPress={() => setPendingDelete(c.id)} />
      ))}
      {exporting && (
        <div aria-hidden style={{ position: "fixed", left: -10000, top: 0, width: 440 }}>
          {infographicCards.map((c, i) => (
            <div
              key={c.id}
              ref={(el) => {
                exportNodes.current[i] = el;
              }}
              className="bg-white p-6"
            >
              <InfographicView card={c} chipBg={bg} chipFg={fg} animate={false} />
            </div>
          ))}
        </div>
      )}
      <ConfirmSheet
        open={pendingDelete !== null}
        title="Delete this card?"
        message="This can't be undone."
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) deleteCard(deck.id, pendingDelete);
          setPendingDelete(null);
        }}
      />

      <Link
        href={`/card/new?deckId=${deck.id}`}
        className="mt-1 flex w-full items-center justify-center gap-2.5 rounded-[20px] border-[1.5px] border-dashed border-border-strong py-4 text-[14.5px] font-bold"
        style={{ color: fg }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={fg} strokeWidth="2.4" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add card
      </Link>

      <EditDetailsSheet
        open={editing}
        heading="Edit collection"
        title={deck.title}
        sub={deck.sub}
        onCancel={() => setEditing(false)}
        onSave={(values) => {
          updateDeck(deck.id, values);
          setEditing(false);
        }}
      />
      <ConfirmSheet
        open={confirmDeleteDeck}
        title={`Delete "${deck.title}"?`}
        message="The collection and all its cards will be removed. This can't be undone."
        onCancel={() => setConfirmDeleteDeck(false)}
        onConfirm={() => {
          deleteDeck(deck.id);
          setConfirmDeleteDeck(false);
          router.replace(category ? `/collection?id=${category.id}` : "/");
        }}
      />
    </div>
  );
}

export default function DeckPage() {
  return (
    <Suspense>
      <DeckContent />
    </Suspense>
  );
}
