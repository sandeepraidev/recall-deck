"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";
import { TEMPLATES } from "@/lib/templates";
import { useDecks } from "@/hooks/useDecks";
import CardForm from "@/components/CardForm";
import ColorPicker from "@/components/ColorPicker";
import AlignPicker from "@/components/AlignPicker";
import { DEFAULT_COLOR_ID, getCardColor } from "@/lib/colors";
import type { Card, TextAlign } from "@/lib/types";

interface CreateDeckClientProps {
  templateId: string;
}

export default function CreateDeckClient({ templateId }: CreateDeckClientProps) {
  const template = TEMPLATES[templateId];

  if (!template) notFound();

  const router = useRouter();
  const { createDeck } = useDecks();

  const [deckName, setDeckName] = useState("");
  const [colorId, setColorId] = useState(DEFAULT_COLOR_ID);
  const [textAlign, setTextAlign] = useState<TextAlign>("center");
  const [cards, setCards] = useState<Card[]>([
    { id: crypto.randomUUID(), ...template.emptyCard() } as Card,
  ]);

  const color = getCardColor(colorId);

  const handleCardChange = useCallback((index: number, key: string, value: string) => {
    setCards((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  }, []);

  const handleAddCard = useCallback(() => {
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
    for (const card of cards) {
      for (const field of template.fields) {
        if (field.required && !(card as unknown as Record<string, string>)[field.key]?.trim()) {
          return false;
        }
      }
    }
    return true;
  }, [deckName, cards, template.fields]);

  const handleSave = useCallback(() => {
    if (!isValid()) return;
    const newDeck = createDeck({
      name: deckName.trim(),
      templateId: template.id,
      color: colorId,
      textAlign,
      cards,
    });
    router.push(`/deck?id=${newDeck.id}`);
  }, [isValid, createDeck, deckName, template.id, colorId, textAlign, cards, router]);

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-2">
          <Link href="/create" className="text-sm text-muted hover:text-foreground transition-colors">
            ← Choose Template
          </Link>
        </div>
        <div className="mb-8 mt-6 flex items-center gap-3">
          <span className="text-3xl">{template.icon}</span>
          <div>
            <h1 className="text-2xl font-bold">{template.name}</h1>
            <p className="text-sm text-muted">{template.description}</p>
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
          {/* Mini preview */}
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
          <p className="text-sm text-muted">{cards.length} card{cards.length !== 1 ? "s" : ""}</p>
          <button
            type="button"
            onClick={handleSave}
            disabled={!isValid()}
            className="inline-flex h-10 items-center rounded-lg bg-accent px-6 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            Save Deck
          </button>
        </div>
      </div>
    </div>
  );
}
