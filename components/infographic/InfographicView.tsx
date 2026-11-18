import type { InfographicCard } from "@/lib/types";
import SpeakButton from "@/components/ui/SpeakButton";

interface InfographicViewProps {
  card: InfographicCard;
  chipBg: string;
  chipFg: string;
  // The entrance animation starts at opacity 0, so rasterising with it on
  // (image export) captures a blank frame.
  animate?: boolean;
}

function Badge({ n, chipBg, chipFg }: { n: number; chipBg: string; chipFg: string }) {
  return (
    <span
      className="flex h-7 w-7 flex-none items-center justify-center rounded-full text-[13px] font-extrabold"
      style={{ background: chipFg, color: chipBg }}
    >
      {n}
    </span>
  );
}

// Draws the infographic from structured items. Layout decides the shape;
// colors come from the category hue like every other mode.
export default function InfographicView({ card, chipBg, chipFg, animate = true }: InfographicViewProps) {
  const { layout, items } = card;
  // On screen the card has a fixed height, so a picture must shrink to fit it;
  // the export render has no height limit and keeps the natural size.
  const fitImage = layout === "image" && animate;

  return (
    <div
      className={fitImage ? "flex min-h-0 flex-1 items-center justify-center" : undefined}
      style={animate ? { animation: "rc-face 0.3s ease" } : undefined}
    >
      {/* Imported pictures show the image alone: the title is just the filename and the badge just says "image". */}
      {layout !== "image" && (
        <>
          <span className="rounded-lg px-2.5 py-1 text-[12px] font-extrabold uppercase" style={{ color: chipFg, background: chipBg }}>
            {layout}
          </span>
          <div className="mt-3 font-serif text-[24px] font-semibold leading-tight text-foreground">{card.title}</div>
        </>
      )}

      {layout === "image" && card.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={card.image}
          alt=""
          className={fitImage ? "min-h-0 max-h-full max-w-full rounded-2xl object-contain" : "h-auto w-full rounded-2xl"}
        />
      )}

      {layout === "process" && (
        <ol className="mt-5">
          {items.map((it, i) => (
            <li key={i} className="relative flex gap-3.5 pb-5 last:pb-0">
              {i < items.length - 1 && (
                <span className="absolute left-[13px] top-8 bottom-0 w-0.5" style={{ background: chipBg }} aria-hidden />
              )}
              <Badge n={i + 1} chipBg={chipBg} chipFg={chipFg} />
              <div className="min-w-0 flex-1 rounded-2xl p-3" style={{ background: chipBg }}>
                <div className="flex items-center gap-2 text-[16px] font-bold text-foreground">
                  <span className="text-[24px] leading-none">{it.emoji}</span>
                  {it.heading}
                </div>
                {it.body && <div className="mt-1 text-[14px] leading-relaxed text-foreground-2">{it.body}</div>}
              </div>
            </li>
          ))}
        </ol>
      )}

      {layout === "vocab" && (
        <div className="mt-5 grid grid-cols-2 gap-3">
          {items.map((it, i) => (
            <div key={i} className="flex flex-col items-center rounded-2xl p-3.5 text-center" style={{ background: chipBg }}>
              <div className="text-[38px] leading-none">{it.emoji}</div>
              <div className="mt-2 font-serif text-[18px] font-semibold text-foreground">{it.heading}</div>
              {it.body && <div className="mt-1 text-[13px] leading-snug text-foreground-2">{it.body}</div>}
              {animate && (
                <div className="mt-2">
                  <SpeakButton text={it.heading} color={chipFg} size={32} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {layout === "story" && (
        <div className="mt-5 space-y-3.5">
          {items.map((it, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border" style={{ borderColor: chipBg }}>
              <div className="flex items-center gap-2.5 px-3.5 py-2" style={{ background: chipBg }}>
                <Badge n={i + 1} chipBg={chipBg} chipFg={chipFg} />
                <span className="text-[14px] font-bold" style={{ color: chipFg }}>
                  {it.heading}
                </span>
              </div>
              <div className="flex items-start gap-3 p-3.5">
                <span className="text-[34px] leading-none">{it.emoji}</span>
                <p className="font-serif text-[15.5px] leading-relaxed text-foreground-2">{it.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
