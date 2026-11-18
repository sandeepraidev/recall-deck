"use client";

import { useRef, useState } from "react";
import type { Card } from "@/lib/types";
import CardContent from "@/components/review/CardContent";
import StackPeek from "@/components/review/StackPeek";

interface StudyCardProps {
  card: Card;
  chipBg: string;
  chipFg: string;
  exiting: boolean;
  remaining: number;
  canGoPrev: boolean;
  onSwipeNext: () => void;
  onSwipePrev: () => void;
}

const SWIPE_THRESHOLD = 40; // px of horizontal drag that commits the swipe
const FLICK_MIN_PX = 15; // a quick flick commits from this distance
const FLICK_VELOCITY = 0.3; // px/ms that counts as a quick flick
const FLY_MS = 220;

export default function StudyCard({
  card,
  chipBg,
  chipFg,
  exiting,
  remaining,
  canGoPrev,
  onSwipeNext,
  onSwipePrev,
}: StudyCardProps) {
  const [dx, setDx] = useState(0);
  const [phase, setPhase] = useState<"idle" | "drag" | "fly">("idle");
  const start = useRef<{ x: number; y: number; t: number } | null>(null);
  const dragged = useRef(false);
  // Mirrors dx so a fast flick that ends before the next render still commits.
  const dxRef = useRef(0);

  function reset() {
    start.current = null;
    dxRef.current = 0;
    setPhase("idle");
    setDx(0);
  }

  function fly(dir: -1 | 1) {
    setPhase("fly");
    setDx(dir * window.innerWidth * 1.2);
    setTimeout(() => {
      if (dir < 0) onSwipeNext();
      else onSwipePrev();
      reset();
    }, FLY_MS);
  }

  function onPointerDown(e: React.PointerEvent) {
    if (phase === "fly" || exiting) return;
    start.current = { x: e.clientX, y: e.clientY, t: e.timeStamp };
    dragged.current = false;
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!start.current) return;
    const mx = e.clientX - start.current.x;
    const my = e.clientY - start.current.y;
    if (!dragged.current) {
      if (Math.abs(my) > 10 && Math.abs(my) > Math.abs(mx)) {
        start.current = null; // vertical scroll, leave it to the browser
        return;
      }
      if (Math.abs(mx) < 10) return;
      dragged.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      setPhase("drag");
    }
    // No previous card: resist the right drag so it reads as a dead end.
    dxRef.current = mx > 0 && !canGoPrev ? mx / 4 : mx;
    setDx(dxRef.current);
  }

  function onPointerUp(e: React.PointerEvent) {
    if (!start.current || !dragged.current) {
      start.current = null;
      return;
    }
    const dx = dxRef.current;
    const velocity = Math.abs(e.clientX - start.current.x) / Math.max(e.timeStamp - start.current.t, 1);
    const commits = Math.abs(dx) > SWIPE_THRESHOLD || (Math.abs(dx) > FLICK_MIN_PX && velocity > FLICK_VELOCITY);
    if (commits && dx < 0) fly(-1);
    else if (commits && dx > 0 && canGoPrev) fly(1);
    else reset();
    dragged.current = false;
  }

  const progress = Math.min(Math.abs(dx) / SWIPE_THRESHOLD, 1);
  const dragTransform = `translateX(${dx}px) rotate(${dx / 20}deg)`;

  return (
    <div className="relative min-h-0 flex-1">
      {card.mode === "stack" && <StackPeek remaining={remaining} />}
      {dx !== 0 && (
        <div
          className="pointer-events-none absolute top-6 z-[4] rounded-lg border-2 px-3 py-1 text-[15px] font-extrabold tracking-wide"
          style={{
            opacity: progress,
            ...(dx < 0
              ? { right: 20, color: chipFg, borderColor: chipFg, transform: "rotate(8deg)" }
              : { left: 20, color: "#6b665b", borderColor: "#6b665b", transform: "rotate(-8deg)" }),
          }}
        >
          {dx < 0 ? "NEXT" : "BACK"}
        </div>
      )}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={reset}
        className="relative z-[3] flex h-full touch-pan-y select-none flex-col overflow-y-auto rounded-[26px] border border-border bg-white p-6 shadow-[0_20px_40px_-24px_rgba(40,30,80,0.35)]"
        style={{
          transform: exiting ? "translateX(-120%) rotate(-8deg)" : dragTransform,
          opacity: exiting ? 0 : 1,
          transition: phase === "drag" ? "none" : `transform ${FLY_MS}ms ease, opacity 0.26s ease`,
        }}
      >
        <CardContent card={card} chipBg={chipBg} chipFg={chipFg} />
      </div>
    </div>
  );
}
