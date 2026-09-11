"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll-driven background photo changer.
 * Fixed full-screen layer behind all content. As the user scrolls into
 * each named section, the corresponding Minecraft photo crossfades in.
 *
 * Uses a throttled scroll listener (rAF + dirty flag) for performance.
 * Images are loaded lazily by the browser via CSS background-image.
 */
const SECTION_BG_MAP: Array<{ id: string; src: string }> = [
  { id: "home", src: "/images/minecraft/hero-epic.jpg" },
  { id: "hosting", src: "/images/minecraft/forest-bg.jpg" },
  { id: "plans", src: "/images/minecraft/village.jpg" },
  { id: "panel", src: "/images/minecraft/cave-bg.jpg" },
  { id: "features", src: "/images/minecraft/landscape.jpg" },
  { id: "gallery", src: "/images/minecraft/survival.jpg" },
  { id: "faq", src: "/images/minecraft/panorama.jpg" },
  { id: "contact", src: "/images/minecraft/hero-bg-2.jpg" },
];

export function ScrollBackgroundChanger() {
  const [currentKey, setCurrentKey] = useState("home");
  const [nextKey, setNextKey] = useState<string | null>(null);
  const tickingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        const mid = window.scrollY + window.innerHeight * 0.4;
        let activeKey = SECTION_BG_MAP[0].id;
        for (const { id } of SECTION_BG_MAP) {
          const el = document.getElementById(id);
          if (el && el.offsetTop <= mid) {
            activeKey = id;
          }
        }
        if (activeKey !== currentKey) {
          setCurrentKey(activeKey);
          setNextKey(activeKey);
          if (timerRef.current) clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => setNextKey(null), 900);
        }
        tickingRef.current = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentKey]);

  const currentSrc = SECTION_BG_MAP.find((s) => s.id === currentKey)?.src ?? SECTION_BG_MAP[0].src;
  const nextSrc = nextKey ? SECTION_BG_MAP.find((s) => s.id === nextKey)?.src : null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Base color fallback */}
      <div className="absolute inset-0 bg-background" />

      {/* Current background image */}
      <div
        className="absolute inset-0 transition-opacity duration-[900ms] ease-in-out"
        style={{
          backgroundImage: `url(${currentSrc})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: nextSrc ? 0 : 1,
        }}
      />

      {/* Incoming background image — fades in */}
      {nextSrc && (
        <div
          className="absolute inset-0 transition-opacity duration-[900ms] ease-in-out"
          style={{
            backgroundImage: `url(${nextSrc})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 1,
          }}
        />
      )}

      {/* Dark overlay for readability — radial spotlight on center */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 85% 75% at 50% 45%, oklch(0.05 0.02 265 / 0.82), oklch(0.07 0.02 265 / 0.92) 100%)",
        }}
      />
      {/* Top + bottom fade for navbar/footer transitions */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}


