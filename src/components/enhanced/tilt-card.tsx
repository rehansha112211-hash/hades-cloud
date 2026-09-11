"use client";

import { type ReactNode } from "react";

/**
 * TiltCard — simplified to just a div wrapper (no mouse tracking).
 * The 3D tilt was causing crashes during rapid scroll.
 * This keeps the same structure but without event listeners.
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
  return (
    <div className={className || ""}>
      {children}
    </div>
  );
}
