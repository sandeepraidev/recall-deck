import type { CardMode, InfographicItem, InfographicLayout } from "@/lib/types";
import { MODES } from "@/lib/modes";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import InfographicFields from "@/components/card-edit/InfographicFields";

interface CardEditFormProps {
  mode: CardMode;
  front: string;
  back: string;
  tags: string;
  addToReview: boolean;
  onFrontChange: (v: string) => void;
  onBackChange: (v: string) => void;
  onTagsChange: (v: string) => void;
  onToggleAddToReview: () => void;
  // Only used by the vocab mode, which keeps one input per example.
  examples?: string[];
  onExamplesChange?: (v: string[]) => void;
  // Only used by the infographic mode, whose body is a structured editor.
  infographic?: { layout: InfographicLayout; items: InfographicItem[]; image?: string };
  onInfographicChange?: (value: { layout: InfographicLayout; items: InfographicItem[]; image?: string }) => void;
}

export default function CardEditForm({
  mode,
  front,
  back,
  tags,
  addToReview,
  onFrontChange,
  onBackChange,
  onTagsChange,
  onToggleAddToReview,
  examples,
  onExamplesChange,
  infographic,
  onInfographicChange,
}: CardEditFormProps) {
  const m = MODES[mode];
  const exampleInputs = examples && examples.length > 0 ? examples : [""];

  return (
    <div>
      <div className="mb-2 text-[12px] font-bold tracking-wide text-muted">{m.editFrontLabel}</div>
      <textarea
        value={front}
        onChange={(e) => onFrontChange(e.target.value)}
        placeholder={m.editFrontPlaceholder}
        className="min-h-[84px] w-full resize-none rounded-2xl border border-border bg-white p-3.5 text-[16px] leading-relaxed text-foreground-2 outline-none"
      />

      {mode === "infographic" && infographic && onInfographicChange ? (
        <div className="mt-[22px]">
          <InfographicFields
            image={infographic.image}
            layout={infographic.layout}
            items={infographic.items}
            onLayoutChange={(layout) => onInfographicChange({ ...infographic, layout })}
            onItemsChange={(items) => onInfographicChange({ ...infographic, items })}
          />
        </div>
      ) : (
        <>
          <div className="mb-2 mt-[22px] text-[12px] font-bold tracking-wide text-muted">{m.editBackLabel}</div>
          <textarea
            value={back}
            onChange={(e) => onBackChange(e.target.value)}
            placeholder={m.editBackPlaceholder}
            className="min-h-[120px] w-full resize-none rounded-2xl border border-border bg-white p-3.5 text-[16px] leading-relaxed text-foreground-2 outline-none"
          />
          {mode === "vocab" && onExamplesChange && (
            <>
              <div className="mb-2 mt-[22px] text-[12px] font-bold tracking-wide text-muted">EXAMPLES</div>
              <div className="space-y-2">
                {exampleInputs.map((value, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      value={value}
                      onChange={(e) => onExamplesChange(exampleInputs.map((v, j) => (j === i ? e.target.value : v)))}
                      placeholder="An example sentence"
                      className="min-w-0 flex-1 rounded-2xl border border-border bg-white p-3.5 text-[16px] text-foreground-2 outline-none"
                    />
                    <button
                      type="button"
                      aria-label="Remove example"
                      onClick={() => onExamplesChange(exampleInputs.filter((_, j) => j !== i))}
                      className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-[20px] text-muted"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => onExamplesChange([...exampleInputs, ""])}
                className="mt-2.5 text-[14px] font-semibold text-accent"
              >
                + Add example
              </button>
            </>
          )}
        </>
      )}

      <div className="mb-2 mt-[22px] text-[12px] font-bold tracking-wide text-muted">TAGS</div>
      <input
        value={tags}
        onChange={(e) => onTagsChange(e.target.value)}
        placeholder="Add tags, comma separated"
        className="w-full rounded-2xl border border-border bg-white p-3.5 text-[15px] text-foreground-2 outline-none"
      />

      <div
        onClick={onToggleAddToReview}
        className="mt-6 flex w-full cursor-pointer items-center justify-between rounded-2xl border border-border bg-white p-3.5 text-left"
      >
        <div>
          <div className="text-[15px] font-semibold text-foreground-2">Add to today&rsquo;s review</div>
          <div className="mt-0.5 text-[12.5px] text-muted-2">Show this card in the next session</div>
        </div>
        <ToggleSwitch checked={addToReview} onChange={onToggleAddToReview} />
      </div>
    </div>
  );
}
