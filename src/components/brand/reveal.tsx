"use client";

/**
 * Reveal component — simplified to a plain div wrapper.
 * No IntersectionObserver, no state, no hooks.
 * CSS animations handle the fade-in.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: React.ElementType;
}) {
  return (
    <Tag className={className || ""} style={delay ? { animationDelay: delay + "ms" } : undefined}>
      {children}
    </Tag>
  );
}
