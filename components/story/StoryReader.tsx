import type { Card, StoryContent } from "@/lib/types";

interface StoryReaderProps {
  story: StoryContent;
  cards: Card[];
  chipBg: string;
  chipFg: string;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default function StoryReader({ story, cards, chipBg, chipFg }: StoryReaderProps) {
  const wordPattern = story.words.map(escapeRegExp).join("|");
  const re = wordPattern ? new RegExp(`(${wordPattern})`, "gi") : null;

  const paragraphs = story.paras.map((text) =>
    re
      ? text
          .split(re)
          .filter((seg) => seg !== "")
          .map((seg) => ({ text: seg, highlighted: story.words.some((w) => w.toLowerCase() === seg.toLowerCase()) }))
      : [{ text, highlighted: false }]
  );

  const glossary = story.words.map((w) => {
    const card = cards.find((c) => c.mode === "vocab" && c.word.toLowerCase() === w.toLowerCase());
    return { word: w, initial: w[0], def: card && card.mode === "vocab" ? card.def : "" };
  });

  return (
    <div>
      <div className="pt-[18px]">
        <span className="rounded-lg px-2.5 py-1 text-[11px] font-extrabold tracking-[0.1em]" style={{ color: chipFg, background: chipBg }}>
          {story.kicker}
        </span>
        <div className="my-3.5 font-serif text-[27px] font-semibold leading-tight tracking-tight text-foreground">{story.title}</div>
        <div className="text-[11.5px] font-bold tracking-wide text-muted-2">{story.dateline}</div>
      </div>

      <div className="pt-5">
        {paragraphs.map((segs, i) => (
          <p key={i} className="mb-[15px] font-serif text-[17px] leading-[1.62] text-foreground-2">
            {segs.map((s, j) =>
              s.highlighted ? (
                <span key={j} className="rounded px-[3px] font-semibold" style={{ background: chipBg, color: chipFg }}>
                  {s.text}
                </span>
              ) : (
                <span key={j}>{s.text}</span>
              )
            )}
          </p>
        ))}
      </div>

      <div className="mt-3 rounded-[20px] border border-border bg-white p-[18px]">
        <div className="mb-3.5 text-[12px] font-extrabold tracking-wide text-muted">WORDS IN THIS STORY</div>
        {glossary.map((w) => (
          <div key={w.word} className="flex gap-3 border-t border-border/70 py-2.5 first:border-t-0 first:pt-0">
            <div
              className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-[9px] font-serif text-[15px] font-semibold"
              style={{ background: chipBg, color: chipFg }}
            >
              {w.initial}
            </div>
            <div className="flex-1">
              <div className="font-serif text-[16px] font-semibold text-foreground-2">{w.word}</div>
              <div className="mt-0.5 text-[13.5px] leading-snug text-muted">{w.def}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
