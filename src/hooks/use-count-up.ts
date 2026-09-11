"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animated count-up hook.
 * Counts from `from` to `to` over `duration` ms when `start` becomes true.
 * Uses requestAnimationFrame with easeOutExpo easing.
 */
export function useCountUp(
  to: number,
  options: { from?: number; duration?: number; start?: boolean; decimals?: number } = {}
) {
  const { from = 0, duration = 2000, start = true, decimals = 0 } = options;
  const [value, setValue] = useState(from);
  const rafRef = useRef<number | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!start || startedRef.current) return;
    startedRef.current = true;

    const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);
      const current = from + (to - from) * eased;
      setValue(decimals > 0 ? parseFloat(current.toFixed(decimals)) : Math.floor(current));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setValue(to);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [start, to, from, duration, decimals]);

  return value;
}
