"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Word-by-word reveal animation for headlines.
 * Each word fades + slides up with a stagger.
 */
export function AnimatedHeading({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 60,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
}) {
  const words = text.split(" ");

  return (
    <span className={cn("inline-block", className)}>
      {words.map((word, i) => (
        <span
          key={i}
          className={cn("inline-block opacity-0 animate-fade-in-up", wordClassName)}
          style={{
            animationDelay: `${delay + i * stagger}ms`,
            animationFillMode: "forwards",
            marginRight: "0.25em",
          }}
        >
          {word}
        </span>
      ))}
    </span>
  );
}
