"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { TEMPLATES } from "@/lib/templates";
import { useDecks } from "@/hooks/useDecks";
import CardForm from "@/components/CardForm";
import ColorPicker from "@/components/ColorPicker";
import AlignPicker from "@/components/AlignPicker";
import { DEFAULT_COLOR_ID, getCardColor } from "@/lib/colors";
import type { Card, TextAlign } from "@/lib/types";
import { exportDeckAsJson } from "@/lib/exportDeck";

export default function EditDeckClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const deckId = searchParams.get("id") ?? "";
  const { getDeck, updateDeck, isLoaded, importIntoDeck } = useDecks();

  const [deckName, setDeckName] = useState("");
  const [colorId, setColorId] = useState(DEFAULT_COLOR_ID);
  const [textAlign, setTextAlign] = useState<TextAlign>("center");
  const [cards, setCards] = useState<Card[]>([]);
  const [templateId, setTemplateId] = useState<string>("");
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoaded) return;
    const deck = getDeck(deckId);
    if (!deck) {
      router.replace("/");
      return;
    }
    setDeckName(deck.name);
    setColorId(deck.color ?? DEFAULT_COLOR_ID);
    setTextAlign(deck.textAlign ?? "center");
    setCards(deck.cards);
    setTemplateId(deck.templateId);
  }, [isLoaded, deckId, getDeck, router]);

  const template = TEMPLATES[templateId];
  const color = getCardColor(colorId);

  const handleCardChange = useCallback((index: number, key: string, value: string) => {
    setCards((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  }, []);

  const handleAddCard = useCallback(() => {
    if (!template) return;
    setCards((prev) => [
      ...prev,
      { id: crypto.randomUUID(), ...template.emptyCard() } as Card,
    ]);
  }, [template]);

  const handleRemoveCard = useCallback((index: number) => {
    setCards((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const isValid = useCallback(() => {
    if (!deckName.trim()) return false;
    if (!template) return false;
    for (const card of cards) {
      for (const field of template.fields) {
        if (field.required && !(card as unknown as Record<string, string>)[field.key]?.trim()) {
          return false;
        }
      }
    }
    return true;
  }, [deckName, cards, template]);

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = importIntoDeck(deckId, ev.target?.result as string);
      if (!result.ok) {
        setImportError(result.error);
        setTimeout(() => setImportError(null), 4000);
      } else {
        // reload deck state from storage
        const deck = getDeck(deckId);
        if (deck) {
          setDeckName(deck.name);
          setColorId(deck.color ?? DEFAULT_COLOR_ID);
          setTextAlign(deck.textAlign ?? "center");
          setCards(deck.cards);
          setTemplateId(deck.templateId);
        }
      }
    };
    reader.readAsText(file);
  }

  const handleSave = useCallback(() => {
    if (!isValid()) return;
    updateDeck(deckId, { name: deckName.trim(), color: colorId, textAlign, cards });
    router.push(`/deck?id=${deckId}`);
  }, [isValid, updateDeck, deckId, deckName, colorId, textAlign, cards, router]);

  if (!isLoaded || !template) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-pulse rounded-full bg-surface" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-2 flex items-center justify-between">
          <Link
            href={`/deck?id=${deckId}`}
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            ← Back to Study
          </Link>
          <input
            ref={fileInputRef}
            type="file"
            accept="*/*"
            className="hidden"
            onChange={handleImport}
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const deck = getDeck(deckId);
                if (deck) void exportDeckAsJson(deck);
              }}
              className="inline-flex h-8 items-center rounded-lg border border-border px-3 text-xs font-medium transition-colors hover:bg-surface-hover"
            >
              Export
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex h-8 items-center rounded-lg border border-border px-3 text-xs font-medium transition-colors hover:bg-surface-hover"
            >
              Import
            </button>
          </div>
        </div>

        {importError && (
          <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {importError}
          </div>
        )}

        <div className="mb-8 mt-6 flex items-center gap-3">
          <span className="text-3xl">{template.icon}</span>
          <div>
            <h1 className="text-2xl font-bold">Edit Deck</h1>
            <p className="text-sm text-muted">{template.name}</p>
          </div>
        </div>

        {/* Deck name */}
        <div className="mb-6 flex flex-col gap-1.5">
          <label className="text-sm font-medium">
            Deck Name <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
            placeholder="e.g. Spanish Vocab — Chapter 3"
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>

        {/* Color picker + alignment + preview */}
        <div className="mb-6 rounded-xl border border-border bg-surface p-4 flex flex-col gap-4">
          <ColorPicker value={colorId} onChange={setColorId} />
          <AlignPicker value={textAlign} onChange={setTextAlign} />
          <div
            className="flex h-14 items-center rounded-xl text-sm font-semibold px-4"
            style={{
              background: color.front,
              color: color.text,
              justifyContent: textAlign === "left" ? "flex-start" : textAlign === "right" ? "flex-end" : "center",
            }}
          >
            Preview · {deckName || "Your Deck"}
          </div>
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-4">
          {cards.map((card, index) => (
            <CardForm
              key={card.id}
              card={card}
              cardIndex={index}
              fields={template.fields}
              onChange={handleCardChange}
              onRemove={handleRemoveCard}
              canRemove={cards.length > 1}
            />
          ))}
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={handleAddCard}
            className="w-full rounded-xl border border-dashed border-border py-3 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
          >
            + Add Card
          </button>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-muted">
            {cards.length} card{cards.length !== 1 ? "s" : ""}
          </p>
          <button
            type="button"
            onClick={handleSave}
            disabled={!isValid()}
            className="inline-flex h-10 items-center rounded-lg bg-accent px-6 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
