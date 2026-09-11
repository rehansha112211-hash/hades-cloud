"use client";

import {
  Cpu,
  HardDrive,
  ShieldCheck,
  Rocket,
  ServerCog,
  Headset,
} from "lucide-react";
import { Reveal } from "@/components/brand/reveal";
import { TiltCard } from "@/components/enhanced/tilt-card";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: Cpu,
    title: "HIGH PERFORMANCE",
    description:
      "Powerful infrastructure designed for smooth Minecraft server performance, with high-clock Ryzen CPUs and tuned kernels that keep TPS high even under heavy player load.",
    accent: "emerald" as const,
  },
  {
    icon: HardDrive,
    title: "NVMe STORAGE",
    description:
      "Fast NVMe SSD storage for quick world loading and server operations — chunks stream faster, autosaves complete in milliseconds, and backups don't block the main thread.",
    accent: "amber" as const,
  },
  {
    icon: ShieldCheck,
    title: "DDoS PROTECTION",
    description:
      "Infrastructure designed to help protect Minecraft servers from network attacks. Network-level filtering absorbs volumetric floods before they ever reach your server process.",
    accent: "emerald" as const,
  },
  {
    icon: Rocket,
    title: "FAST DEPLOYMENT",
    description:
      "Get your server ready quickly after ordering. Most plans are provisioned automatically within minutes of a successful payment, so you can start building immediately.",
    accent: "amber" as const,
  },
  {
    icon: ServerCog,
    title: "RELIABLE INFRASTRUCTURE",
    description:
      "Stable infrastructure for long-running Minecraft servers. Redundant power, network and storage layers mean your world stays online through maintenance windows and traffic spikes.",
    accent: "emerald" as const,
  },
  {
    icon: Headset,
    title: "24/7 SUPPORT",
    description:
      "Professional support experience. Our team monitors infrastructure around the clock and answers most tickets within a few hours during business days.",
    accent: "amber" as const,
  },
] as const;

export function WhyHadesCloud() {
  return (
    <section
      id="hosting"
      className="relative py-20 sm:py-28 overflow-hidden bg-gradient-to-b from-background via-background/95 to-background"
    >
      {/* Dark Minecraft forest atmosphere — real image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/minecraft/forest-bg.jpg"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-10"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background" />
      </div>
      <div className="absolute inset-0 bg-pixel-grid opacity-20 pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <SectionEyebrow>Why Hades Cloud</SectionEyebrow>
          <h2 className="font-pixel text-2xl sm:text-3xl lg:text-4xl font-normal tracking-tight mt-4 leading-tight">
            Built for serious servers,
            <br />
            <span className="text-gradient-hades text-xl sm:text-2xl lg:text-3xl">tuned for players.</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-base sm:text-lg leading-relaxed">
            Every layer of our stack — from the kernel to the network edge —
            is tuned to keep your Minecraft world fast, stable and protected.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 60}>
              <TiltCard maxTilt={5} scale={1.02} className="h-full">
                <FeatureCard
                  icon={f.icon}
                  title={f.title}
                  description={f.description}
                  accent={f.accent}
                />
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  accent,
}: {
  icon: typeof Cpu;
  title: string;
  description: string;
  accent: "emerald" | "amber";
}) {
  return (
    <article
      className={cn(
        "group relative h-full glass-card rounded-xl p-6 hover-lift",
        "hover:border-primary/30 transition-all"
      )}
    >
      <div
        className={cn(
          "inline-flex items-center justify-center size-12 rounded-lg mb-5",
          "border transition-colors",
          accent === "emerald"
            ? "bg-primary/10 text-primary border-primary/30 group-hover:glow-emerald"
            : "bg-accent/10 text-accent border-accent/30 group-hover:glow-amber"
        )}
      >
        <Icon className="size-5" />
      </div>
      <h3 className="font-pixel text-[11px] tracking-[0.1em] mb-3 leading-relaxed">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
      {/* Corner accent */}
      <div
        className={cn(
          "absolute top-0 right-0 w-16 h-16 rounded-tr-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
          accent === "emerald"
            ? "bg-gradient-to-bl from-primary/10 to-transparent"
            : "bg-gradient-to-bl from-accent/10 to-transparent"
        )}
      />
    </article>
  );
}

export function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 font-pixel text-[9px] tracking-[0.2em] uppercase text-primary">
      <span className="w-6 h-0.5 bg-primary/60" />
      {children}
    </div>
  );
}
