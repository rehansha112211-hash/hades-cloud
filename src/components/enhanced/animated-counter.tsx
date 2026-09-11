"use client";

import { useCountUp } from "@/hooks/use-count-up";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

/**
 * Animated counter — counts up from 0 to `value` when scrolled into view.
 */
export function AnimatedCounter({
  value,
  decimals = 0,
  duration = 2000,
  prefix = "",
  suffix = "",
  className,
}: {
  value: number;
  decimals?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.4 });
  const current = useCountUp(value, { duration, decimals, start: inView });

  const formatted = decimals > 0
    ? current.toFixed(decimals)
    : Math.round(current).toLocaleString();

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}{formatted}{suffix}
    </span>
  );
}
