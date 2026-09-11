"use client";

import { type ReactNode } from "react";
import { useMousePosition } from "@/hooks/use-mouse-position";
import { cn } from "@/lib/utils";

/**
 * Parallax layer — translates based on cursor position.
 * Use inside a `relative` parent with `overflow-hidden`.
 * `depth` controls intensity (0 = static, 1 = strong parallax).
 */
export function ParallaxLayer({
  children,
  depth = 0.2,
  className,
}: {
  children: ReactNode;
  className?: string;
  depth?: number;
}) {
  const pos = useMousePosition();

  let tx = 0;
  let ty = 0;
  if (pos && typeof window !== "undefined") {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    tx = (pos.x - cx) * depth;
    ty = (pos.y - cy) * depth;
  }

  return (
    <div
      className={cn("transition-transform duration-300 ease-out will-change-transform", className)}
      style={{ transform: `translate3d(${tx}px, ${ty}px, 0)` }}
    >
      {children}
    </div>
  );
}
