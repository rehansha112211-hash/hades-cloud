"use client";

import { useEffect, useState } from "react";

/**
 * Tracks which section is currently in view, for nav highlighting.
 * CRASH-FIX: guards against missing elements, uses try/catch.
 */
export function useActiveSection(sectionIds: string[], offset = 100) {
  const [active, setActive] = useState<string>(sectionIds[0] ?? "");

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        try {
          const scrollPos = window.scrollY + offset + window.innerHeight / 3;
          let current = sectionIds[0] ?? "";
          for (const id of sectionIds) {
            const el = document.getElementById(id);
            if (el && el.offsetTop <= scrollPos) {
              current = id;
            }
          }
          if (current !== active) {
            setActive(current);
          }
        } catch {
          // ignore — don't crash on scroll
        }
        ticking = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sectionIds, offset, active]);

  return active;
}
