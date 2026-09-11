"use client";

import { cn } from "@/lib/utils";

/**
 * Brand logo for HADES CLOUD — a stylized emerald pickaxe/gem inside a
 * dark glass square. Pure SVG, no external assets.
 */
export function BrandLogo({
  className,
  size = 36,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="hades-emerald" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#5eead4" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
          <linearGradient id="hades-amber" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
        </defs>
        <rect x="6" y="6" width="52" height="52" rx="12" fill="#0a0d18" />
        <rect
          x="6"
          y="6"
          width="52"
          height="52"
          rx="12"
          stroke="#4ade80"
          strokeWidth="1.5"
          opacity="0.45"
        />
        <path
          d="M32 13L47 21.5V38.5L32 47L17 38.5V21.5L32 13Z"
          stroke="url(#hades-emerald)"
          strokeWidth="2"
          strokeLinejoin="round"
          fill="#14192a"
        />
        <path
          d="M32 13L47 21.5L32 30L17 21.5L32 13Z"
          fill="url(#hades-emerald)"
          opacity="0.9"
        />
        <path d="M32 30V47" stroke="url(#hades-emerald)" strokeWidth="2" />
        <circle cx="32" cy="30" r="3" fill="url(#hades-amber)" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-pixel text-[13px] tracking-[0.18em] text-foreground">
          HADES
        </span>
        <span className="font-pixel text-[8px] tracking-[0.42em] text-primary mt-1">
          CLOUD
        </span>
      </span>
    </span>
  );
}
