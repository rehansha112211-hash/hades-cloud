"use client";

import { type ReactNode } from "react";
import { useTilt } from "@/hooks/use-tilt";
import { cn } from "@/lib/utils";

/**
 * 3D tilt card — tilts toward cursor with a subtle glare highlight.
 * Wraps children. Disabled on touch / reduced-motion (falls back to flat).
 */
export function TiltCard({
  children,
  className,
  maxTilt = 6,
  glare = true,
  scale = 1.02,
}: {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
  scale?: number;
}) {
  const { ref, tilt, glare: glarePos, active } = useTilt(maxTilt);

  return (
    <div
      ref={ref}
      className={cn("relative transition-transform duration-200 ease-out will-change-transform", className)}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${active ? scale : 1})`,
      }}
    >
      {children}
      {glare && active && (
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-[inherit] pointer-events-none"
          style={{
            background: `radial-gradient(400px circle at ${glarePos.x}% ${glarePos.y}%, oklch(1 0 0 / 0.08), transparent 40%)`,
          }}
        />
      )}
    </div>
  );
}
