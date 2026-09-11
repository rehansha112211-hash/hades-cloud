"use client";

import { useEffect, useState } from "react";

/**
 * Tracks mouse position relative to viewport. Used for cursor glow effects.
 * Returns {x, y} in viewport pixels, or null if pointer is not over window.
 */
export function useMousePosition() {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    const onLeave = () => setPos(null);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseout", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
    };
  }, []);

  return pos;
}
