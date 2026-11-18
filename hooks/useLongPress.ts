"use client";

import { useCallback, useEffect, useRef } from "react";
import type { MouseEvent, PointerEvent, TouchEvent } from "react";

const DELAY_MS = 700;
const MOVE_TOLERANCE_PX = 8;

export function useLongPress(onLongPress?: () => void) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const origin = useRef<{ x: number; y: number } | null>(null);
  const fired = useRef(false);
  const scrollListener = useRef<(() => void) | null>(null);

  const cancel = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    origin.current = null;
    if (scrollListener.current) {
      window.removeEventListener("scroll", scrollListener.current, true);
      scrollListener.current = null;
    }
  }, []);

  useEffect(() => cancel, [cancel]);

  const movedTooFar = (x: number, y: number) =>
    origin.current !== null && Math.hypot(x - origin.current.x, y - origin.current.y) > MOVE_TOLERANCE_PX;

  const onPointerDown = (e: PointerEvent) => {
    if (!onLongPress) return;
    cancel();
    fired.current = false;
    origin.current = { x: e.clientX, y: e.clientY };
    // Any scroll anywhere on the page means the user is scrolling, not holding.
    // Capture is needed because scroll events from inner containers don't bubble.
    const onScroll = () => cancel();
    scrollListener.current = onScroll;
    window.addEventListener("scroll", onScroll, { capture: true, passive: true });
    timer.current = setTimeout(() => {
      cancel();
      fired.current = true;
      navigator.vibrate?.(10);
      onLongPress();
    }, DELAY_MS);
  };

  const onPointerMove = (e: PointerEvent) => {
    if (movedTooFar(e.clientX, e.clientY)) cancel();
  };

  // Android's WebView sends pointercancel (then pointerleave) both when it takes
  // over a touch to scroll and, on a still finger, when its own long-press
  // fires at ~500ms, followed by touchcancel. Those events can't tell a scroll
  // from a hold, so they are ignored: a scroll is caught by touchmove (which
  // keeps arriving while the page scrolls) and the scroll listener, and lifting
  // the finger by pointerup/touchend.
  const onTouchMove = (e: TouchEvent) => {
    const t = e.touches[0];
    if (t && movedTooFar(t.clientX, t.clientY)) cancel();
  };

  // Suppresses the click that follows a long press so the link doesn't navigate.
  const onClick = (e: MouseEvent) => {
    if (fired.current) {
      e.preventDefault();
      fired.current = false;
    }
  };

  const onContextMenu = (e: MouseEvent) => {
    if (onLongPress) e.preventDefault();
  };

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp: cancel,
    // Only a mouse leaving the element means the press ended; see above for touch.
    onPointerLeave: (e: PointerEvent) => {
      if (e.pointerType === "mouse") cancel();
    },
    onTouchMove,
    onTouchEnd: cancel,
    onClick,
    onContextMenu,
  };
}
