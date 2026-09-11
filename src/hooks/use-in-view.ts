"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reveal-on-scroll hook using IntersectionObserver.
 * Returns { ref, visible }.
 */
export function useInView<T extends Element = HTMLDivElement>(
  options: { threshold?: number; rootMargin?: string; once?: boolean } = {}
) {
  const { threshold = 0.12, rootMargin = "0px 0px -40px 0px", once = true } = options;
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            if (once) obs.disconnect();
            break;
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { threshold, rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, inView };
}
