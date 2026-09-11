"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 3D tilt hook — returns a ref to attach + current rotation values.
 * CRASH-FIX: guards against missing element, try/catch, cleanup.
 */
export function useTilt(maxTilt = 8) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    try {
      if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (window.matchMedia("(pointer: coarse)").matches) return;
    } catch {
      return;
    }

    const onMove = (e: MouseEvent) => {
      try {
        const rect = el.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const px = x / rect.width;
        const py = y / rect.height;
        setTilt({
          x: (py - 0.5) * -2 * maxTilt,
          y: (px - 0.5) * 2 * maxTilt,
        });
        setGlare({ x: px * 100, y: py * 100 });
      } catch {
        // ignore
      }
    };
    const onEnter = () => setActive(true);
    const onLeave = () => {
      setActive(false);
      setTilt({ x: 0, y: 0 });
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      try {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      } catch {
        // ignore
      }
    };
  }, [maxTilt]);

  return { ref, tilt, glare, active };
}
