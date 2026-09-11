"use client";

import { cn } from "@/lib/utils";

/**
 * Modern HADES CLOUD logo — sleek server/cloud icon with Minecraft pickaxe accent.
 * Pure SVG, no external assets.
 */
export function BrandLogo({ className, size = 36 }: { className?: string; size?: number }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0" aria-hidden="true">
        <defs>
          <linearGradient id="hc-blue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <linearGradient id="hc-white" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
        </defs>
        {/* Rounded square background */}
        <rect x="4" y="4" width="56" height="56" rx="14" fill="#0a0d18" />
        <rect x="4" y="4" width="56" height="56" rx="14" stroke="url(#hc-blue)" strokeWidth="1.5" opacity="0.5" />
        {/* Cloud shape — modern, geometric */}
        <path d="M20 38C16 38 13 35 13 31C13 27 16 24 20 24C21 19 25 16 30 16C36 16 41 21 41 27C45 27 48 30 48 33C48 37 45 38 41 38H20Z" fill="url(#hc-blue)" opacity="0.15" />
        <path d="M20 38C16 38 13 35 13 31C13 27 16 24 20 24C21 19 25 16 30 16C36 16 41 21 41 27C45 27 48 30 48 33C48 37 45 38 41 38H20Z" stroke="url(#hc-blue)" strokeWidth="2" strokeLinejoin="round" />
        {/* Server bars inside cloud */}
        <rect x="22" y="28" width="18" height="2" rx="1" fill="url(#hc-blue)" />
        <rect x="22" y="32" width="14" height="2" rx="1" fill="url(#hc-blue)" opacity="0.7" />
        <rect x="22" y="36" width="10" height="2" rx="1" fill="url(#hc-blue)" opacity="0.5" />
        {/* Spark/dot */}
        <circle cx="48" cy="20" r="3" fill="url(#hc-blue)" />
        <circle cx="48" cy="20" r="5" fill="url(#hc-blue)" opacity="0.2" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[16px] font-bold tracking-[0.18em] text-foreground">HADES</span>
        <span className="font-sans text-[10px] font-medium tracking-[0.42em] text-primary mt-1">CLOUD</span>
      </span>
    </span>
  );
}
