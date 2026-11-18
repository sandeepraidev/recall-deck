import type { ReactNode } from "react";
import type { Card } from "@/lib/types";
import InfographicView from "@/components/infographic/InfographicView";
import SpeakButton from "@/components/ui/SpeakButton";

interface CardContentProps {
  card: Card;
  chipBg: string;
  chipFg: string;
}

// Every card shows prompt and answer on one page (no flip). Two-part cards put
// the prompt in a highlighted band at the top and the answer below it.
export default function CardContent({ card, chipBg, chipFg }: CardContentProps) {
  switch (card.mode) {
    case "infographic":
      return <InfographicView card={card} chipBg={chipBg} chipFg={chipFg} />;

    case "vocab":
      return (
        <Page>
          <Band label="WORD" chipBg={chipBg} chipFg={chipFg}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-serif text-[30px] font-semibold leading-tight tracking-tight text-foreground">{card.word}</div>
                {card.pron && <div className="mt-1 text-[14.5px] italic text-muted-2">{card.pron}</div>}
              </div>
              <SpeakButton text={card.word} color={chipFg} />
            </div>
          </Band>
          <Label chipFg={chipFg}>MEANING</Label>
          <div className="mt-1.5">
            {card.def.split("\n").map((line, i) =>
              // Seeded definitions carry the Hindi meaning on its own "हिंदी:" line.
              line.startsWith("हिंदी:") ? (
                <div key={i} className="mt-1 text-[14.5px] text-muted-2">
                  {line}
                </div>
              ) : (
                <div key={i} className="text-[17px] leading-relaxed text-foreground-2">
                  {line}
                </div>
              )
            )}
          </div>
          <ExampleList examples={card.examples} chipFg={chipFg} />
        </Page>
      );

    case "expression":
      return (
        <Page>
          <Band label="SITUATION" chipBg={chipBg} chipFg={chipFg}>
            <div className="font-serif text-[20px] font-medium leading-snug text-foreground">{card.situation}</div>
            {card.hindi && <div className="mt-1.5 text-[14.5px] text-muted-2">हिंदी: {card.hindi}</div>}
          </Band>
          <Label chipFg={chipFg}>SAY IT</Label>
          <div className="mt-1.5 flex items-start justify-between gap-3">
            <div className="font-serif text-[28px] font-semibold leading-snug text-foreground">{card.phrase}</div>
            <SpeakButton text={card.phrase} color={chipFg} />
          </div>
          <ExampleList examples={card.examples} chipFg={chipFg} />
        </Page>
      );

    case "case":
      return (
        <Page>
          <Band label="SCENARIO" chipBg={chipBg} chipFg={chipFg}>
            <div className="font-serif text-[17px] leading-relaxed text-foreground">{card.scenario}</div>
            <div className="mt-3 text-[15px] font-bold" style={{ color: chipFg }}>
              {card.question}
            </div>
          </Band>
          <Label chipFg={chipFg}>MODEL ANSWER</Label>
          <ol className="mt-2.5">
            {card.answer.map((t, i) => (
              <li key={i} className="mb-2.5 flex gap-2.5">
                <div
                  className="mt-px flex h-5 w-5 flex-none items-center justify-center rounded-full text-[11px] font-extrabold"
                  style={{ background: chipBg, color: chipFg }}
                >
                  {i + 1}
                </div>
                <div className="text-[15px] leading-relaxed text-foreground-2">{t}</div>
              </li>
            ))}
          </ol>
        </Page>
      );

    case "pattern":
      return (
        <Page>
          <Band label="PATTERN" chipBg={chipBg} chipFg={chipFg}>
            <div className="font-serif text-[24px] font-medium leading-snug text-foreground">{card.pattern}</div>
            {card.hint && <div className="mt-2 text-[14px] text-muted-2">{card.hint}</div>}
          </Band>
          <Label chipFg={chipFg}>HOW TO USE</Label>
          <ExampleList examples={card.examples} chipFg={chipFg} />
        </Page>
      );

    case "phrase":
      return (
        <Page>
          <Band label="PHRASE" chipBg={chipBg} chipFg={chipFg}>
            <div className="font-serif text-[34px] font-semibold leading-tight text-foreground">{card.phrase}</div>
            {card.romaji && <div className="mt-1.5 text-[16px] text-muted-2">{card.romaji}</div>}
          </Band>
          <Label chipFg={chipFg}>MEANING</Label>
          <div className="mt-1.5 text-[20px] font-bold leading-snug text-foreground-2">{card.meaning}</div>
          {card.literal && <div className="mt-2 text-[14px] italic text-muted-2">{card.literal}</div>}
        </Page>
      );

    case "qa":
      return (
        <Page>
          <Band label="QUESTION" chipBg={chipBg} chipFg={chipFg}>
            <div className="font-serif text-[22px] font-medium leading-snug text-foreground">{card.q}</div>
          </Band>
          <Label chipFg={chipFg}>ANSWER</Label>
          <div className="mt-1.5 font-serif text-[28px] font-semibold leading-snug text-foreground">{card.a}</div>
          {card.note && <div className="mt-3 text-[14.5px] leading-relaxed text-muted-2">{card.note}</div>}
        </Page>
      );

    case "code":
      return (
        <Page>
          <Band label="TASK" chipBg={chipBg} chipFg={chipFg}>
            <div className="text-[19px] font-bold leading-snug text-foreground">{card.task}</div>
          </Band>
          <Label chipFg={chipFg}>SOLUTION</Label>
          <pre className="mt-2 whitespace-pre-wrap rounded-2xl bg-[#201f2a] p-4 font-mono text-[15px] leading-relaxed text-[#e8e6ef]">
            {card.code}
          </pre>
          {card.note && <div className="mt-3.5 text-[14.5px] leading-relaxed text-muted">{card.note}</div>}
        </Page>
      );

    case "email":
      return (
        <Page>
          <Band label="WRITE THIS" chipBg={chipBg} chipFg={chipFg}>
            <div className="font-serif text-[22px] font-semibold leading-snug text-foreground">{card.purpose}</div>
            {card.context && <div className="mt-2 text-[15px] leading-relaxed text-muted-2">{card.context}</div>}
          </Band>
          <Label chipFg={chipFg}>MODEL EMAIL</Label>
          <div className="mt-2 overflow-hidden rounded-2xl border border-border">
            <div className="border-b border-border bg-surface-hover p-3">
              <div className="text-[10.5px] font-extrabold tracking-wide" style={{ color: chipFg }}>
                SUBJECT
              </div>
              <div className="mt-0.5 text-[15px] font-bold text-foreground-2">{card.subject}</div>
            </div>
            <div className="whitespace-pre-wrap p-3.5 text-[15px] leading-relaxed text-foreground-2">{card.body}</div>
          </div>
          {card.tip && (
            <div className="mt-4 rounded-2xl border-l-2 bg-background p-3.5" style={{ borderColor: chipFg }}>
              <div className="text-[11px] font-extrabold tracking-wide" style={{ color: chipFg }}>
                WHY IT WORKS
              </div>
              <div className="mt-1 text-[14.5px] leading-relaxed text-foreground-2">{card.tip}</div>
            </div>
          )}
        </Page>
      );

    case "stack":
      return (
        <Page>
          <Band label="OPERATION" chipBg={chipBg} chipFg={chipFg}>
            <div className="font-serif text-[20px] font-medium leading-snug text-foreground">{card.prompt}</div>
            {card.blocks.length > 0 && (
              <div className="mt-3.5 flex flex-col items-center gap-2">
                {card.blocks.map((b, i) => (
                  <div key={i} className="w-[140px] rounded-[10px] bg-white py-2.5 text-center text-[14px] font-bold" style={{ color: chipFg }}>
                    {b}
                  </div>
                ))}
              </div>
            )}
          </Band>
          <Label chipFg={chipFg}>HOW IT WORKS</Label>
          <div className="mt-1.5 text-[15.5px] leading-relaxed text-foreground-2">{card.fact}</div>
        </Page>
      );

    case "speech":
      return (
        <Page>
          <div className="flex items-center gap-2.5">
            <span className="rounded-lg px-2.5 py-1 text-[12px] font-extrabold" style={{ color: chipFg, background: chipBg }}>
              {card.section}
            </span>
            <span className="text-[12.5px] font-bold text-muted-2">at {card.time}</span>
          </div>
          <div className="mt-[18px] text-[11px] font-extrabold tracking-[0.1em]" style={{ color: chipFg }}>
            YOUR CUE
          </div>
          <div className="mt-1.5 font-serif text-[21px] font-medium leading-relaxed text-foreground-2">{card.cue}</div>
          <div className="my-5 h-px bg-border" />
          <div className="text-[11px] font-extrabold tracking-[0.1em]" style={{ color: chipFg }}>
            YOUR LINE
          </div>
          <div className="mt-2 font-serif text-[24px] font-medium leading-relaxed text-foreground">“{card.line}”</div>
          <div className="mt-5 rounded-2xl p-3.5" style={{ background: chipBg }}>
            <div className="text-[11px] font-extrabold tracking-wide" style={{ color: chipFg }}>
              DELIVERY
            </div>
            <div className="mt-1 text-[14.5px] leading-relaxed text-foreground-2">{card.note}</div>
          </div>
        </Page>
      );

    case "poem":
      return (
        <Page>
          <span className="self-start rounded-lg px-2.5 py-1 text-[12px] font-extrabold" style={{ color: chipFg, background: chipBg }}>
            {card.form}
          </span>
          <div className="mt-5">
            {card.lines.map((ln, i) => (
              <div key={i} className="font-serif text-[23px] font-medium leading-[1.6] text-foreground">
                {ln}
              </div>
            ))}
          </div>
          <div className="my-[22px] h-px bg-border" />
          <div className="text-[11px] font-extrabold tracking-[0.1em]" style={{ color: chipFg }}>
            MEANING
          </div>
          <div className="mt-2 text-[15px] leading-relaxed text-foreground-2">{card.meaning}</div>
        </Page>
      );

    case "story":
      return (
        <Page>
          <span className="self-start rounded-lg px-2.5 py-1 text-[12px] font-extrabold" style={{ color: chipFg, background: chipBg }}>
            {card.genre}
          </span>
          <div className="mt-4 font-serif text-[23px] font-semibold leading-tight text-foreground">{card.title}</div>
          <div className="mt-4">
            {card.text.map((p, i) => (
              <p key={i} className="mb-3.5 font-serif text-[16.5px] leading-relaxed text-foreground-2">
                {p}
              </p>
            ))}
          </div>
          <div className="mt-2 rounded-2xl p-3.5" style={{ background: chipBg }}>
            <div className="text-[11px] font-extrabold tracking-wide" style={{ color: chipFg }}>
              TAKEAWAY
            </div>
            <div className="mt-1 text-[14.5px] leading-relaxed text-foreground-2">{card.takeaway}</div>
          </div>
        </Page>
      );
  }
}

function Page({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col" style={{ animation: "rc-face 0.3s ease" }}>
      {children}
    </div>
  );
}

// The highlighted prompt at the top of a two-part card.
function Band({ label, chipBg, chipFg, children }: { label: string; chipBg: string; chipFg: string; children: ReactNode }) {
  return (
    <div className="min-h-[10%] rounded-2xl p-4" style={{ background: chipBg }}>
      <div className="mb-1.5 text-[11px] font-extrabold tracking-[0.1em]" style={{ color: chipFg }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function Label({ chipFg, children }: { chipFg: string; children: ReactNode }) {
  return (
    <div className="mt-5 text-[11px] font-extrabold tracking-[0.1em]" style={{ color: chipFg }}>
      {children}
    </div>
  );
}

// Numbered example sentences with a coloured rule. Seeded vocab examples may
// carry a tense prefix ("Past: …"), shown as a small label.
function ExampleList({ examples, chipFg }: { examples: string[]; chipFg: string }) {
  if (examples.length === 0) return null;
  return (
    <ol className="mt-4 space-y-2.5">
      {examples.map((line, i) => {
        const m = /^(Present|Past|Future|Perfect|Continuous): (.+)$/.exec(line);
        return (
          <li key={i} className="flex gap-2.5 border-l-2 pl-3" style={{ borderColor: chipFg }}>
            <span className="pt-0.5 text-[12px] font-extrabold" style={{ color: chipFg }}>
              {i + 1}
            </span>
            <span className="font-serif text-[15.5px] italic leading-relaxed text-foreground-2">
              {m && <span className="mr-1.5 font-sans text-[11px] font-bold not-italic uppercase tracking-wide text-muted">{m[1]}</span>}
              “{m ? m[2] : line}”
            </span>
          </li>
        );
      })}
    </ol>
  );
}
