"use client";

import type { Card, TemplateId, TextAlign } from "@/lib/types";
import { isVocabularyCard, isFlashCard, isDefinitionCard, isWordExamplesCard, isIELTSCard, isSoftwareConceptCard, isPhysicsFormulaCard, isMathProblemCard, isCaseStudyCard, isEnglishGrammarCard } from "@/lib/types";
import { getCardColor } from "@/lib/colors";
import styles from "./StudyCard.module.css";

interface StudyCardProps {
  card: Card;
  templateId: TemplateId;
  colorId: string;
  textAlign: TextAlign;
  isFlipped: boolean;
  onFlip: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  canNext?: boolean;
  canPrev?: boolean;
}

function alignClass(align: TextAlign) {
  if (align === "left") return "text-left items-start";
  if (align === "right") return "text-right items-end";
  return "text-center items-center";
}

/** Render a string with newlines as multiple <p> tags */
function MultilineText({ text, className }: { text: string; className: string }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => (
        <p key={i} className={className}>{line || "\u00A0"}</p>
      ))}
    </>
  );
}

function FrontContent({ card, templateId, subtext, align }: { card: Card; templateId: TemplateId; subtext: string; align: TextAlign }) {
  const cls = alignClass(align);
  if (isVocabularyCard(card, templateId)) {
    return (
      <div className={`flex flex-col gap-2 w-full ${cls}`}>
        <MultilineText text={card.word} className="text-4xl font-bold tracking-tight" />
        {card.partOfSpeech && (
          <p className="text-sm italic" style={{ color: subtext }}>{card.partOfSpeech}</p>
        )}
      </div>
    );
  }
  if (isFlashCard(card, templateId)) {
    return (
      <div className={`flex flex-col gap-1.5 w-full ${cls}`}>
        <MultilineText text={card.front} className="text-2xl font-semibold leading-snug" />
      </div>
    );
  }
  if (isDefinitionCard(card, templateId)) {
    return (
      <div className={`flex flex-col gap-1.5 w-full ${cls}`}>
        <MultilineText text={card.term} className="text-3xl font-bold tracking-tight" />
      </div>
    );
  }
  if (isWordExamplesCard(card, templateId)) {
    return (
      <div className={`flex flex-col gap-2 w-full ${cls}`}>
        <MultilineText text={card.word} className="text-4xl font-bold tracking-tight" />
      </div>
    );
  }
  if (isIELTSCard(card, templateId)) {
    return (
      <div className={`flex flex-col gap-2 w-full ${cls}`}>
        <p className="text-xs font-semibold uppercase tracking-widest opacity-70">{card.questionType}</p>
        <MultilineText text={card.prompt} className="text-xl font-semibold leading-snug" />
      </div>
    );
  }
  if (isSoftwareConceptCard(card, templateId)) {
    return (
      <div className={`flex flex-col gap-2 w-full ${cls}`}>
        <MultilineText text={card.concept} className="text-3xl font-bold tracking-tight" />
      </div>
    );
  }
  if (isPhysicsFormulaCard(card, templateId)) {
    return (
      <div className={`flex flex-col gap-2 w-full ${cls}`}>
        <MultilineText text={card.formulaName} className="text-xl font-semibold opacity-80" />
        <MultilineText text={card.formula} className="text-4xl font-bold tracking-tight font-mono" />
      </div>
    );
  }
  if (isMathProblemCard(card, templateId)) {
    return (
      <div className={`flex flex-col gap-2 w-full ${cls}`}>
        <MultilineText text={card.problem} className="text-xl font-semibold leading-snug" />
        {card.hint && (
          <p className="text-xs italic opacity-60" style={{ color: subtext }}>Hint: {card.hint}</p>
        )}
      </div>
    );
  }
  if (isCaseStudyCard(card, templateId)) {
    return (
      <div className={`flex flex-col gap-2 w-full ${cls}`}>
        <MultilineText text={card.title} className="text-2xl font-bold tracking-tight" />
        <MultilineText text={card.scenario} className="text-sm leading-relaxed opacity-90" />
      </div>
    );
  }
  if (isEnglishGrammarCard(card, templateId)) {
    return (
      <div className={`flex flex-col gap-2 w-full ${cls}`}>
        <MultilineText text={card.rule} className="text-2xl font-bold tracking-tight" />
      </div>
    );
  }
  return null;
}

function BackContent({ card, templateId, subtext, align }: { card: Card; templateId: TemplateId; subtext: string; align: TextAlign }) {
  const cls = alignClass(align);
  if (isVocabularyCard(card, templateId)) {
    return (
      <div className={`flex flex-col gap-3 w-full ${cls}`}>
        <MultilineText text={card.definition} className="text-lg leading-relaxed font-medium" />
        {card.exampleSentence && (
          <div className={`flex flex-col gap-1 pt-3 w-full ${cls}`}
            style={{ borderTop: `1px solid rgba(255,255,255,0.15)` }}>
            <MultilineText text={card.exampleSentence} className="text-sm italic" />
          </div>
        )}
      </div>
    );
  }
  if (isFlashCard(card, templateId)) {
    return (
      <div className={`flex flex-col gap-1.5 w-full ${cls}`}>
        <MultilineText text={card.back} className="text-xl leading-relaxed font-medium" />
      </div>
    );
  }
  if (isDefinitionCard(card, templateId)) {
    return (
      <div className={`flex flex-col gap-1.5 w-full ${cls}`}>
        <MultilineText text={card.definition} className="text-lg leading-relaxed font-medium" />
      </div>
    );
  }
  if (isWordExamplesCard(card, templateId)) {
    const examples = card.examples
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    return (
      <div className={`flex flex-col gap-3 w-full ${cls}`}>
        <MultilineText text={card.meaning} className="text-base font-semibold leading-snug" />
        {examples.length > 0 && (
          <ul className={`flex flex-col gap-1.5 pt-3 w-full ${align === "center" ? "items-center" : ""}`}
            style={{ borderTop: `1px solid rgba(255,255,255,0.15)` }}>
            {examples.map((ex, i) => (
              <li key={i} className={`text-sm italic flex gap-1.5 ${align === "right" ? "flex-row-reverse" : ""}`}
                style={{ color: subtext }}>
                <span className="opacity-60 shrink-0">•</span>
                <span>{ex}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
  if (isIELTSCard(card, templateId)) {
    return (
      <div className={`flex flex-col gap-3 w-full ${cls}`}>
        <MultilineText text={card.modelAnswer} className="text-sm leading-relaxed font-medium" />
        {card.bandTips && (
          <div className={`flex flex-col gap-1 pt-3 w-full ${cls}`}
            style={{ borderTop: `1px solid rgba(255,255,255,0.15)` }}>
            <p className="text-xs font-semibold uppercase tracking-wider opacity-60" style={{ color: subtext }}>Band Tips</p>
            <MultilineText text={card.bandTips} className="text-xs italic" />
          </div>
        )}
      </div>
    );
  }
  if (isSoftwareConceptCard(card, templateId)) {
    return (
      <div className={`flex flex-col gap-3 w-full ${cls}`}>
        <MultilineText text={card.explanation} className="text-sm leading-relaxed font-medium" />
        {card.codeExample && (
          <div className={`w-full pt-3`}
            style={{ borderTop: `1px solid rgba(255,255,255,0.15)` }}>
            <pre className="text-xs font-mono leading-relaxed whitespace-pre-wrap opacity-90"
              style={{ color: subtext }}>{card.codeExample}</pre>
          </div>
        )}
      </div>
    );
  }
  if (isPhysicsFormulaCard(card, templateId)) {
    const variables = card.variables
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    return (
      <div className={`flex flex-col gap-3 w-full ${cls}`}>
        {variables.length > 0 && (
          <ul className={`flex flex-col gap-1 w-full`}>
            {variables.map((v, i) => (
              <li key={i} className="text-sm font-mono">
                <span className="font-bold">{v.split(":")[0]}</span>
                {v.includes(":") && <span className="opacity-80">:{v.split(":").slice(1).join(":")}</span>}
              </li>
            ))}
          </ul>
        )}
        {card.notes && (
          <div className={`pt-3 w-full`}
            style={{ borderTop: `1px solid rgba(255,255,255,0.15)` }}>
            <MultilineText text={card.notes} className="text-xs italic opacity-80" />
          </div>
        )}
      </div>
    );
  }
  if (isMathProblemCard(card, templateId)) {
    const steps = card.solution
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    return (
      <div className={`flex flex-col gap-2 w-full ${cls}`}>
        {steps.map((step, i) => (
          <p key={i} className="text-sm leading-relaxed font-medium">{step}</p>
        ))}
      </div>
    );
  }
  if (isCaseStudyCard(card, templateId)) {
    const takeaways = card.takeaways
      ? card.takeaways.split("\n").map((s) => s.trim()).filter(Boolean)
      : [];
    return (
      <div className={`flex flex-col gap-3 w-full ${cls}`}>
        <MultilineText text={card.analysis} className="text-sm leading-relaxed font-medium" />
        {takeaways.length > 0 && (
          <div className={`pt-3 w-full`}
            style={{ borderTop: `1px solid rgba(255,255,255,0.15)` }}>
            <p className="text-xs font-semibold uppercase tracking-wider opacity-60 mb-1.5" style={{ color: subtext }}>Key Takeaways</p>
            <ul className="flex flex-col gap-1">
              {takeaways.map((t, i) => (
                <li key={i} className={`text-xs flex gap-1.5 ${align === "right" ? "flex-row-reverse" : ""}`}>
                  <span className="opacity-60 shrink-0">→</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
  if (isEnglishGrammarCard(card, templateId)) {
    const examples = card.examples
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    return (
      <div className={`flex flex-col gap-3 w-full ${cls}`}>
        <MultilineText text={card.explanation} className="text-sm leading-relaxed font-medium" />
        {examples.length > 0 && (
          <ul className={`flex flex-col gap-1 pt-3 w-full`}
            style={{ borderTop: `1px solid rgba(255,255,255,0.15)` }}>
            {examples.map((ex, i) => (
              <li key={i} className="text-xs italic flex gap-1.5">
                <span className="opacity-60 shrink-0">•</span>
                <span>{ex}</span>
              </li>
            ))}
          </ul>
        )}
        {card.commonMistake && (
          <div className={`pt-2`}
            style={{ borderTop: `1px solid rgba(255,255,255,0.15)` }}>
            <p className="text-xs font-semibold uppercase tracking-wider opacity-60 mb-1" style={{ color: subtext }}>Common Mistake</p>
            <p className="text-xs italic opacity-80">{card.commonMistake}</p>
          </div>
        )}
      </div>
    );
  }
  return null;
}

export default function StudyCard({ card, templateId, colorId, textAlign, isFlipped, onFlip, onNext, onPrev, canNext = true, canPrev = true }: StudyCardProps) {
  const color = getCardColor(colorId);

  const faceBase: React.CSSProperties = {
    borderRadius: "1.25rem",
    border: `1px solid ${color.border}`,
    color: color.text,
    position: "absolute",
    inset: 0,
  };

  return (
    <div className="relative w-full" style={{ height: "320px" }}>
      {/* Previous button */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onPrev?.(); }}
        disabled={!canPrev}
        aria-label="Previous card"
        className="absolute left-0 top-0 z-20 flex h-full w-12 items-center justify-center disabled:opacity-0"
        style={{ background: "transparent" }}
      >
        <span
          className="flex h-9 w-9 items-center justify-center rounded-full text-lg font-bold shadow-lg"
          style={{ background: "rgba(0,0,0,0.35)", color: "#fff" }}
        >
          ‹
        </span>
      </button>

      {/* Next button */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onNext?.(); }}
        disabled={!canNext}
        aria-label="Next card"
        className="absolute right-0 top-0 z-20 flex h-full w-12 items-center justify-center disabled:opacity-0"
        style={{ background: "transparent" }}
      >
        <span
          className="flex h-9 w-9 items-center justify-center rounded-full text-lg font-bold shadow-lg"
          style={{ background: "rgba(0,0,0,0.35)", color: "#fff" }}
        >
          ›
        </span>
      </button>



      {/* Tappable card */}
      <div
        className={`${styles.container} w-full cursor-pointer select-none`}
        style={{ height: "320px" }}
        onClick={onFlip}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onFlip()}
        aria-label="Flip card"
      >
        <div className={`${styles.inner} ${isFlipped ? styles.flipped : ""}`}>

          {/* Front */}
          <div className={`${styles.face} ${styles.shine} flex flex-col items-center justify-center px-14 py-10`}
            style={{ ...faceBase, background: color.front }}>
            <span className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full opacity-10"
              style={{ background: "rgba(255,255,255,0.4)" }} />
            <span className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full opacity-10"
              style={{ background: "rgba(255,255,255,0.3)" }} />
            <FrontContent card={card} templateId={templateId} subtext={color.subtext} align="center" />
            {!isFlipped && (
              <div className="absolute bottom-4 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                style={{ background: "rgba(255,255,255,0.15)", color: color.subtext }}>
                Tap to flip
              </div>
            )}
          </div>

          {/* Back */}
          <div className={`${styles.face} ${styles.back} ${styles.shine} flex flex-col items-center justify-center px-14 py-10`}
            style={{ ...faceBase, background: color.back }}>
            <span className="pointer-events-none absolute -top-10 -left-10 h-40 w-40 rounded-full opacity-10"
              style={{ background: "rgba(255,255,255,0.4)" }} />
            <span className="pointer-events-none absolute -bottom-8 -right-8 h-32 w-32 rounded-full opacity-10"
              style={{ background: "rgba(255,255,255,0.3)" }} />
            <div className="absolute top-4 right-4 rounded-full px-2.5 py-0.5 text-xs font-semibold"
              style={{ background: "rgba(255,255,255,0.2)", color: color.subtext }}>
              Answer
            </div>
            <BackContent card={card} templateId={templateId} subtext={color.subtext} align={textAlign} />
          </div>

        </div>
      </div>

    </div>
  );
}
