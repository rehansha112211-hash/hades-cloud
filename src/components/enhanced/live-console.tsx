"use client";

/**
 * Live typing console mockup — simplified to static lines (no IntersectionObserver).
 * Lines are shown immediately, no typing animation (prevents scroll crash).
 */
const CONSOLE_LINES = [
  { ts: "14:32:01", type: "info", text: "Server started in 8.4s" },
  { ts: "14:32:02", type: "info", text: "Loaded 487 advancements" },
  { ts: "14:32:03", type: "info", text: 'Preparing level "world" (seed: -893421984)' },
  { ts: "14:33:14", type: "join", text: "Player Aarav joined the game" },
  { ts: "14:34:51", type: "join", text: "Player Priya joined the game" },
  { ts: "14:35:02", type: "warn", text: "Can't keep up! 1420ms behind, skipping 28 tick(s)" },
  { ts: "14:36:18", type: "info", text: "Auto-save complete in 218ms" },
  { ts: "14:36:42", type: "join", text: "Player Rohan joined the game" },
];

export function LiveConsole() {
  return (
    <div className="p-3 font-mono text-[11px] leading-relaxed space-y-1 max-h-44 overflow-y-auto">
      {CONSOLE_LINES.map((line, i) => {
        const color =
          line.type === "info" ? "text-muted-foreground"
          : line.type === "join" ? "text-primary"
          : line.type === "warn" ? "text-accent"
          : "text-accent";
        return (
          <div key={i} className="flex gap-2">
            <span className="text-muted-foreground/50 shrink-0">[{line.ts}]</span>
            <span className={color}>{line.text}</span>
          </div>
        );
      })}
      <div className="flex gap-1">
        <span className="text-primary">hc@server</span>
        <span className="text-muted-foreground">:~$</span>
        <span className="inline-block w-2 h-3.5 bg-primary animate-cursor-blink" />
      </div>
    </div>
  );
}
