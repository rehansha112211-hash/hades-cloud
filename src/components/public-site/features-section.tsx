"use client";

import {
  Cpu,
  HardDrive,
  ShieldCheck,
  Clock4,
  Rocket,
  ServerCog,
  Database,
  Globe,
  Lock,
} from "lucide-react";
import { Reveal } from "@/components/brand/reveal";
import { SectionEyebrow } from "@/components/public-site/why-hades-cloud";
import { TiltCard } from "@/components/enhanced/tilt-card";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: HardDrive,
    title: "NVMe Performance",
    description:
      "PCIe Gen4 NVMe storage delivers read/write speeds 10× faster than traditional SSDs. World loads in milliseconds, autosaves complete without TPS drops, and large worlds stay responsive even at high render distances.",
    accent: "emerald" as const,
  },
  {
    icon: Cpu,
    title: "Powerful Processors",
    description:
      "AMD Ryzen 9 CPUs clocked for sustained single-thread performance — the metric that matters most for Minecraft. High clock speed keeps TPS high even with dozens of players, complex redstone and many loaded chunks.",
    accent: "amber" as const,
  },
  {
    icon: ShieldCheck,
    title: "DDoS Protection",
    description:
      "Network-level filtering absorbs volumetric attacks before they reach your server. We monitor for L3/L4/L7 attack patterns targeting Minecraft — you focus on building, not on mitigating floods.",
    accent: "emerald" as const,
  },
  {
    icon: Clock4,
    title: "Reliable Uptime",
    description:
      "Redundant power feeds, network uplinks and storage clusters maintain 99.9%+ uptime. Automatic failover moves your server to healthy hardware if a node degrades — usually before anyone notices.",
    accent: "amber" as const,
  },
  {
    icon: Rocket,
    title: "Fast Deployment",
    description:
      "Most plans are auto-provisioned within 60 seconds of payment confirmation. Pick your Minecraft version, install plugins, invite players and you're live — no manual server setup required.",
    accent: "emerald" as const,
  },
  {
    icon: ServerCog,
    title: "Easy Server Management",
    description:
      "A clean web panel handles the hard parts: file editing, plugin management, scheduled restarts, automated backups and version switching. Console access is one click away with full live tailing.",
    accent: "amber" as const,
  },
];

const STRIP = [
  { icon: Database, label: "Daily backups" },
  { icon: Globe, label: "Global edge network" },
  { icon: Lock, label: "Encrypted at rest" },
  { icon: ShieldCheck, label: "Always-on filtering" },
] as const;

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-20 sm:py-28 overflow-hidden">
      {/* Cave / underground Minecraft atmosphere — VISIBLE */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/minecraft/landscape.jpg"
          alt="Minecraft epic landscape"
          className="w-full h-full object-cover opacity-35"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/75 to-background" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center">
            <SectionEyebrow>Features</SectionEyebrow>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mt-4 leading-tight">
            Every layer tuned
            <br />
            <span className="text-gradient-hades">for Minecraft.</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-base sm:text-lg leading-relaxed">
            We obsess over the things most hosting companies skip — kernel
            scheduling, storage I/O latency, network filtering and console
            ergonomics.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 60}>
              <TiltCard maxTilt={5} className="h-full">
                <FeatureBlock
                  icon={f.icon}
                  title={f.title}
                  description={f.description}
                  accent={f.accent}
                />
              </TiltCard>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14" delay={150}>
          <div className="glass-card rounded-2xl p-6 sm:p-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {STRIP.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center text-center gap-3"
                >
                  <div className="size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <s.icon className="size-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FeatureBlock({
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
    <article className="group relative h-full glass-card rounded-xl p-6 hover-lift hover:border-primary/30 transition-all">
        <div className="flex items-start gap-4 mb-4">
          <div
            className={cn(
              "inline-flex items-center justify-center size-12 rounded-none border transition-colors",
              accent === "emerald"
                ? "bg-primary/10 text-primary border-primary/30 group-hover:glow-emerald"
                : "bg-accent/10 text-accent border-accent/30 group-hover:glow-amber"
            )}
          >
            <Icon className="size-5" />
          </div>
          <h3 className="font-display font-bold text-lg pt-2">{title}</h3>
        </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </article>
  );
}
