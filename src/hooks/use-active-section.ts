"use client";

import { useEffect, useState } from "react";

/**
 * Tracks which section is currently in view, for nav highlighting.
 * Pass an array of section IDs (without #).
 */
export function useActiveSection(sectionIds: string[], offset = 100) {
  const [active, setActive] = useState<string>(sectionIds[0] ?? "");

  useEffect(() => {
    const onScroll = () => {
      const scrollPos = window.scrollY + offset + window.innerHeight / 3;
      let current = sectionIds[0] ?? "";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPos) {
          current = id;
        }
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sectionIds, offset]);

  return active;
}
