"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 3D tilt hook — returns a ref to attach + current rotation values.
 * Tilts the element based on mouse position over it.
 * Resets when mouse leaves. Respects prefers-reduced-motion.
 */
export function useTilt(maxTilt = 8) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const px = x / rect.width; // 0..1
      const py = y / rect.height; // 0..1
      setTilt({
        x: (py - 0.5) * -2 * maxTilt, // rotateX
        y: (px - 0.5) * 2 * maxTilt, // rotateY
      });
      setGlare({ x: px * 100, y: py * 100 });
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
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [maxTilt]);

  return { ref, tilt, glare, active };
}
