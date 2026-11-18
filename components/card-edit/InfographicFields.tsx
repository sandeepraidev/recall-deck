import type { InfographicItem, InfographicLayout } from "@/lib/types";
import { emptyInfographic } from "@/lib/cardForm";

const LAYOUTS: { id: InfographicLayout; label: string }[] = [
  { id: "process", label: "Process" },
  { id: "vocab", label: "Vocabulary" },
  { id: "story", label: "Story" },
];

const ITEM_NOUN: Record<InfographicLayout, string> = { process: "STEP", vocab: "WORD", story: "PANEL", image: "IMAGE" };

interface InfographicFieldsProps {
  image?: string;
  layout: InfographicLayout;
  items: InfographicItem[];
  onLayoutChange: (layout: InfographicLayout) => void;
  onItemsChange: (items: InfographicItem[]) => void;
}

export default function InfographicFields({ image, layout, items, onLayoutChange, onItemsChange }: InfographicFieldsProps) {
  function patch(i: number, changes: Partial<InfographicItem>) {
    onItemsChange(items.map((it, idx) => (idx === i ? { ...it, ...changes } : it)));
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onItemsChange(next);
  }

  // Imported pictures have no structured items; the title is all that's editable.
  if (layout === "image") {
    return (
      <div>
        <div className="mb-2 text-[12px] font-bold tracking-wide text-muted">IMAGE</div>
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="w-full rounded-2xl border border-border" />
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-2 text-[12px] font-bold tracking-wide text-muted">LAYOUT</div>
      <div className="flex gap-2">
        {LAYOUTS.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => {
              onLayoutChange(l.id);
              // Swap the starter example when the editor is still untouched.
              if (items.length === 0) onItemsChange(emptyInfographic(l.id));
            }}
            className={`flex-1 rounded-xl border py-2 text-[14px] font-semibold ${
              layout === l.id ? "border-accent bg-white text-accent" : "border-border bg-white text-muted"
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div className="mb-2 mt-[22px] text-[12px] font-bold tracking-wide text-muted">{ITEM_NOUN[layout]}S</div>
      <div className="space-y-3">
        {items.map((it, i) => (
          <div key={i} className="rounded-2xl border border-border bg-white p-3">
            <div className="flex items-center gap-2">
              <span className="w-12 flex-none text-[11px] font-extrabold tracking-wide text-muted-2">
                {ITEM_NOUN[layout]} {i + 1}
              </span>
              <input
                value={it.emoji}
                onChange={(e) => patch(i, { emoji: e.target.value })}
                aria-label="Emoji"
                maxLength={4}
                className="w-12 rounded-lg border border-border p-1.5 text-center text-[20px] outline-none"
              />
              <input
                value={it.heading}
                onChange={(e) => patch(i, { heading: e.target.value })}
                placeholder={layout === "vocab" ? "Word" : "Heading"}
                className="min-w-0 flex-1 rounded-lg border border-border p-2 text-[15px] font-semibold text-foreground-2 outline-none"
              />
            </div>
            <textarea
              value={it.body}
              onChange={(e) => patch(i, { body: e.target.value })}
              placeholder={layout === "vocab" ? "Meaning" : "Details"}
              rows={2}
              className="mt-2 w-full resize-none rounded-lg border border-border p-2 text-[14.5px] leading-relaxed text-foreground-2 outline-none"
            />
            <div className="mt-1.5 flex justify-end gap-4 text-[13px] font-semibold text-muted">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="disabled:opacity-30">
                Up
              </button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="disabled:opacity-30">
                Down
              </button>
              <button type="button" onClick={() => onItemsChange(items.filter((_, idx) => idx !== i))} className="text-destructive">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onItemsChange([...items, { emoji: "", heading: "", body: "" }])}
        className="mt-3 w-full rounded-2xl border border-dashed border-border py-3 text-[14px] font-semibold text-accent"
      >
        + Add {ITEM_NOUN[layout].toLowerCase()}
      </button>
    </div>
  );
}
