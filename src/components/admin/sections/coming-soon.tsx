"use client";

import { type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/brand/reveal";

export function ComingSoon({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <Reveal className="max-w-2xl mx-auto text-center py-12">
      <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-primary/10 border border-primary/30 mb-5">
        <Icon className="size-7 text-primary" />
      </div>
      <h2 className="font-display font-bold text-2xl mb-2">{title}</h2>
      <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
        {description}
      </p>
      <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber/10 border border-amber/30 text-amber text-xs font-medium">
        <span className="size-1.5 rounded-full bg-amber animate-pulse-glow" />
        Coming soon
      </div>
    </Reveal>
  );
}
