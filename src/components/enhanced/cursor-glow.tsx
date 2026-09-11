"use client";

import { useMousePosition } from "@/hooks/use-mouse-position";

/**
 * Cursor glow — a large radial gradient that follows the cursor.
 * Purely decorative. Hidden on touch / reduced-motion.
 * Place at the top of a section, position: absolute, pointer-events: none.
 */
export function CursorGlow({
  color = "oklch(0.74 0.18 145 / 0.08)",
  size = 600,
  className = "",
}: {
  color?: string;
  size?: number;
  className?: string;
}) {
  const pos = useMousePosition();

  if (!pos) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-[1] overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(${size}px ${size}px at ${pos.x}px ${pos.y}px, ${color}, transparent 60%)`,
      }}
    />
  );
}
