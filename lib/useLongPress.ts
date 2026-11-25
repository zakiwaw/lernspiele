"use client";

import { useCallback, useRef } from "react";

export function useLongPress(onLongPress: () => void, onShortPress?: () => void, ms = 700) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fired = useRef(false);

  const start = useCallback(() => {
    fired.current = false;
    timer.current = setTimeout(() => {
      fired.current = true;
      onLongPress();
    }, ms);
  }, [onLongPress, ms]);

  const clear = useCallback((triggerShort: boolean) => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
      if (triggerShort && !fired.current && onShortPress) onShortPress();
    }
  }, [onShortPress]);

  return {
    onPointerDown: start,
    onPointerUp: () => clear(true),
    onPointerLeave: () => clear(false),
    onPointerCancel: () => clear(false),
  };
}
