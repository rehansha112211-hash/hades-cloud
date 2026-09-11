"use client";

import { Server, Users, Globe, Clock, Zap, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/brand/reveal";
import { AnimatedCounter } from "@/components/enhanced/animated-counter";

/**
 * Metrics / Stats bar — animated counters showing real-feel scale.
 * Numbers are illustrative and labeled as such internally.
 */
const METRICS = [
  {
    icon: Server,
    value: 45000,
    suffix: "+",
    label: "Servers deployed",
    color: "primary",
  },
  {
    icon: Users,
    value: 1.2,
    suffix: "M+",
    decimals: 1,
    label: "Players hosted",
    color: "amber",
  },
  {
    icon: Globe,
    value: 12,
    label: "Data center regions",
    color: "primary",
  },
  {
    icon: Clock,
    value: 99.9,
    decimals: 1,
    suffix: "%",
    label: "Uptime this year",
    color: "amber",
  },
] as const;

export function MetricsSection() {
  return (
    <section className="relative py-14 sm:py-16 overflow-hidden border-y border-border/40">
      {/* Background atmosphere */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/minecraft/cave-bg.jpg"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-8"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      </div>

      {/* Animated gradient line top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-10">
          <p className="text-xs font-medium tracking-[0.3em] uppercase text-primary mb-2 font-sans">
            Trusted by the community
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
            Numbers that build trust.
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {METRICS.map((m, i) => (
            <Reveal key={m.label} delay={i * 80}>
              <MetricCard {...m} />
            </Reveal>
          ))}
        </div>

        {/* Bottom trust badges */}
        <Reveal delay={300} className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
          <TrustBadge icon={Zap} label="Instant deployment" />
          <TrustBadge icon={ShieldCheck} label="DDoS protected" />
          <TrustBadge icon={Clock} label="24/7 monitoring" />
          <TrustBadge icon={Server} label="NVMe storage" />
        </Reveal>
      </div>
    </section>
  );
}

function MetricCard({
  icon: Icon,
  value,
  suffix,
  decimals,
  label,
  color,
}: {
  icon: typeof Server;
  value: number;
  suffix?: string;
  decimals?: number;
  label: string;
  color: "primary" | "amber";
}) {
  const colorClass =
    color === "primary"
      ? "text-primary bg-primary/10 border-primary/30"
      : "text-accent bg-accent/10 border-accent/30";

  return (
    <div className="glass-card rounded-xl p-5 sm:p-6 text-center hover-lift hover:border-primary/30 transition-all group">
      <div
        className={`inline-flex items-center justify-center size-12 rounded-lg border mb-4 ${colorClass} group-hover:scale-110 transition-transform`}
      >
        <Icon className="size-5" />
      </div>
      <div className="font-display font-bold text-3xl sm:text-4xl tracking-tight">
        <AnimatedCounter value={value} decimals={decimals ?? 0} suffix={suffix ?? ""} />
      </div>
      <p className="text-[11px] sm:text-xs text-muted-foreground uppercase tracking-wider mt-2 font-sans">
        {label}
      </p>
    </div>
  );
}

function TrustBadge({ icon: Icon, label }: { icon: typeof Zap; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-foreground/5 border border-border/40">
      <Icon className="size-3 text-primary" />
      {label}
    </span>
  );
}
