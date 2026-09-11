"use client";

import { type ComponentType } from "react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

type IconType = ComponentType<{ className?: string }>;

/**
 * Animated stat bar — fills from 0 to `percent` when scrolled into view.
 * Includes optional icon, value, label, and detail.
 */
export function AnimatedStatBar({
  percent,
  label,
  value,
  detail,
  icon: Icon,
  className,
  delay = 0,
}: {
  percent: number;
  label?: string;
  value?: string;
  detail?: string;
  icon?: IconType;
  className?: string;
  delay?: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.5 });

  return (
    <div ref={ref} className={cn("glass-card rounded-lg p-3", className)}>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
        {Icon && <Icon className="size-3.5 text-primary" />}
        {value && (
          <span className="font-display font-bold text-lg text-foreground">
            {value}
          </span>
        )}
        {label && <span>{label}</span>}
      </div>
      {detail && (
        <p className="text-[10px] text-muted-foreground mb-2">{detail}</p>
      )}
      <div className="h-1.5 rounded-full bg-foreground/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-[width] duration-1000 ease-out"
          style={{
            width: inView ? `${percent}%` : "0%",
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
    </div>
  );
}
