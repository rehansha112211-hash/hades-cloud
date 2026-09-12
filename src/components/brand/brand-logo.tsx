"use client";

import { cn } from "@/lib/utils";

/**
 * HADES CLOUD brand logo — uses the user-provided logo image.
 * Logo file: /public/images/brand/logo.png (128x128, optimized)
 */
export function BrandLogo({ className, size = 36 }: { className?: string; size?: number }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/brand/logo.png"
        alt="Hades Cloud"
        width={size}
        height={size}
        className="shrink-0 object-contain"
        style={{ width: size + "px", height: size + "px" }}
      />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[16px] font-bold tracking-[0.18em] text-foreground">HADES</span>
        <span className="font-sans text-[10px] font-medium tracking-[0.42em] text-primary mt-1">CLOUD</span>
      </span>
    </span>
  );
}
