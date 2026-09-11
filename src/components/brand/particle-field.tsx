"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Lightweight particle field — small floating "embers" / dust motes.
 * Pure CSS animation, no canvas, no heavy libs.
 * Pause on prefers-reduced-motion.
 */
export function ParticleField({
  className,
  count = 24,
}: {
  className?: string;
  count?: number;
}) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setEnabled(true);
    }
  }, []);

  if (!enabled) return null;

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => {
        const left = (i * 37 + 11) % 100;
        const duration = 12 + ((i * 7) % 18);
        const delay = (i * 1.7) % 12;
        const size = 2 + ((i * 13) % 3);
        const isAmber = i % 3 === 0;
        return (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${left}%`,
              bottom: `-10px`,
              width: `${size}px`,
              height: `${size}px`,
              background: isAmber
                ? "oklch(0.78 0.16 75 / 0.7)"
                : "oklch(0.74 0.18 145 / 0.55)",
              boxShadow: isAmber
                ? "0 0 6px oklch(0.78 0.16 75 / 0.6)"
                : "0 0 6px oklch(0.74 0.18 145 / 0.5)",
              animation: `float-particle ${duration}s linear ${delay}s infinite`,
            }}
          />
        );
      })}
    </div>
  );
}
