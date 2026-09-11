"use client";

import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { cn } from "@/lib/utils";

/**
 * Scroll progress bar — thin gradient line at the very top of the viewport.
 * Fixed position, z-index above navbar.
 */
export function ScrollProgressBar() {
  const progress = useScrollProgress();

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-transparent pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-primary via-accent to-primary transition-[width] duration-150 ease-out"
        style={{ width: `${progress * 100}%` }}
        aria-hidden="true"
      />
      <div
        className={cn(
          "absolute top-0 right-0 h-full w-12 blur-sm",
          "bg-gradient-to-r from-transparent to-accent/60"
        )}
        style={{ opacity: progress > 0.02 ? 1 : 0 }}
        aria-hidden="true"
      />
    </div>
  );
}
