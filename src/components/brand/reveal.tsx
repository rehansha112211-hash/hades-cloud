"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reveal-on-scroll wrapper. Fades + slides up when scrolled into view.
 * Simplified to prevent crashes during rapid scroll (mount/unmount).
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
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    try {
      const obs = new IntersectionObserver(
        function (entries) {
          for (let i = 0; i < entries.length; i++) {
            if (entries[i].isIntersecting) {
              setVisible(true);
              obs.disconnect();
              break;
            }
          }
        },
        { threshold: 0.1 }
      );
      obs.observe(el);
      return function () {
        try { obs.disconnect(); } catch (e) { /* ignore */ }
      };
    } catch (e) {
      setVisible(true);
    }
  }, []);

  const baseClass = visible
    ? "opacity-100 translate-y-0"
    : "opacity-0 translate-y-4";

  return (
    <Tag
      ref={ref}
      className={(baseClass + " transition-all duration-700 ease-out " + (className || "")).trim()}
      style={{ transitionDelay: delay + "ms" }}
    >
      {children}
    </Tag>
  );
}
