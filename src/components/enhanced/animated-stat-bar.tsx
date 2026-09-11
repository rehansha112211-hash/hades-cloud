"use client";

/**
 * Animated stat bar — simplified to static bar (no IntersectionObserver).
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
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
  delay?: number;
}) {
  return (
    <div className={"glass-card rounded-lg p-3 " + (className || "")}>
      {(label || value) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              {Icon && <Icon className="size-3.5 text-primary" />}
              {value && <span className="font-display font-bold text-lg text-foreground">{value}</span>}
              <span>{label}</span>
            </div>
          )}
          {detail && <span className="text-[10px] text-muted-foreground">{detail}</span>}
        </div>
      )}
      <div className="h-1.5 rounded-full bg-foreground/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
          style={{ width: percent + "%" }}
        />
      </div>
    </div>
  );
}
