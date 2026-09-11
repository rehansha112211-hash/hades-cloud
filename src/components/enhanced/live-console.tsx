"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Line = {
  ts: string;
  type: "info" | "join" | "warn" | "cmd";
  text: string;
};

const CONSOLE_SCRIPT: Line[] = [
  { ts: "14:32:01", type: "info", text: "Server started in 8.4s" },
  { ts: "14:32:02", type: "info", text: "Loaded 487 advancements" },
  { ts: "14:32:03", type: "info", text: 'Preparing level "world" (seed: -893421984)' },
  { ts: "14:33:14", type: "join", text: "Player Aarav joined the game" },
  { ts: "14:34:51", type: "join", text: "Player Priya joined the game" },
  { ts: "14:35:02", type: "warn", text: "Can't keep up! 1420ms behind, skipping 28 tick(s)" },
  { ts: "14:36:18", type: "info", text: "Auto-save complete in 218ms" },
  { ts: "14:36:42", type: "join", text: "Player Rohan joined the game" },
  { ts: "14:37:11", type: "info", text: "Loaded 12 chunks, 4 entities" },
  { ts: "14:38:24", type: "cmd", text: "[Aarav] /gamemode creative" },
  { ts: "14:38:25", type: "info", text: "Set Aarav's game mode to Creative Mode" },
];

/**
 * Live-typing console mockup.
 * Reveals one line at a time when scrolled into view, then loops.
 */
export function LiveConsole() {
  const [visibleLines, setVisibleLines] = useState<Line[]>([]);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  // Start typing when scrolled into view
  useEffect(() => {
    if (!containerRef) return;
    if (startedRef.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            startedRef.current = true;
            startTyping();
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(containerRef);
    return () => obs.disconnect();
  }, [containerRef]);

  const startTyping = () => {
    let i = 0;
    const tick = () => {
      if (i >= CONSOLE_SCRIPT.length) {
        // Loop after a pause
        setTimeout(() => {
          setVisibleLines([]);
          i = 0;
          tick();
        }, 4000);
        return;
      }
      setVisibleLines((prev) => [...prev, CONSOLE_SCRIPT[i]]);
      i++;
      const delay = 400 + Math.random() * 600;
      setTimeout(tick, delay);
    };
    tick();
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleLines]);

  return (
    <div
      ref={setContainerRef}
      className="p-3 font-mono text-[11px] leading-relaxed space-y-1 max-h-44 overflow-y-auto"
    >
      {visibleLines.length === 0 && (
        <div className="text-muted-foreground/50 flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-primary animate-pulse" />
          Waiting for output...
        </div>
      )}
      {visibleLines.map((line, i) => (
        <ConsoleLine key={i} ts={line.ts} type={line.type}>
          {line.text}
        </ConsoleLine>
      ))}
      {visibleLines.length > 0 && (
        <div className="text-muted-foreground/50 flex items-center gap-1">
          <span className="text-primary">hc@server</span>
          <span className="text-muted-foreground">:~$</span>
          <span className="inline-block w-2 h-3.5 bg-primary animate-cursor-blink" />
        </div>
      )}
    </div>
  );
}

function ConsoleLine({
  ts,
  type,
  children,
}: {
  ts: string;
  type: "info" | "join" | "warn" | "cmd";
  children: React.ReactNode;
}) {
  const color =
    type === "info"
      ? "text-muted-foreground"
      : type === "join"
      ? "text-primary"
      : type === "warn"
      ? "text-amber"
      : "text-accent";
  return (
    <div className="flex gap-2 animate-fade-in-up" style={{ animationDuration: "0.3s" }}>
      <span className="text-muted-foreground/50 shrink-0">[{ts}]</span>
      <span className={cn(color)}>{children}</span>
    </div>
  );
}
