"use client";

/**
 * Word-by-word reveal animation for headlines.
 * Each word fades + slides up with a stagger.
 * Simplified to prevent crashes.
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
    <span className={className || ""}>
      {words.map(function (word, i) {
        const animDelay = delay + i * stagger;
        return (
          <span
            key={i}
            className={"inline-block opacity-0 animate-fade-in-up " + (wordClassName || "")}
            style={{
              animationDelay: animDelay + "ms",
              animationFillMode: "forwards",
              marginRight: "0.25em",
            }}
          >
            {word}
          </span>
        );
      })}
    </span>
  );
}
