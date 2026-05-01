"use client";

import type { Card, TemplateField } from "@/lib/types";

interface CardFormProps {
  card: Card;
  cardIndex: number;
  fields: TemplateField[];
  onChange: (index: number, key: string, value: string) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

export default function CardForm({ card, cardIndex, fields, onChange, onRemove, canRemove }: CardFormProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-muted">Card {cardIndex + 1}</span>
        <button
          type="button"
          onClick={() => onRemove(cardIndex)}
          disabled={!canRemove}
          className="text-sm text-destructive disabled:cursor-not-allowed disabled:opacity-30 hover:underline"
        >
          Remove
        </button>
      </div>
      <div className="flex flex-col gap-4">
        {fields.map((field) => {
          const value = (card as unknown as Record<string, string>)[field.key] ?? "";
          return (
            <div key={field.key} className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">
                {field.label}
                {field.required && <span className="ml-1 text-destructive">*</span>}
              </label>
              {field.multiline ? (
                <textarea
                  value={value}
                  onChange={(e) => onChange(cardIndex, field.key, e.target.value)}
                  placeholder={field.placeholder}
                  rows={3}
                  className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                />
              ) : (
                <input
                  type="text"
                  value={value}
                  onChange={(e) => onChange(cardIndex, field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
