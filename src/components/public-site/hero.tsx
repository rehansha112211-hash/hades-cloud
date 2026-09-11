"use client";

import { ChevronRight, Cloud, Server, Zap, Shield, Globe, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedHeading } from "@/components/enhanced/animated-heading";
import { CursorGlow } from "@/components/enhanced/cursor-glow";
import { MagneticButton } from "@/components/enhanced/magnetic-button";
import { AnimatedCounter } from "@/components/enhanced/animated-counter";

/**
 * Cinematic hero with animated starfield + galaxy gradient background.
 */
export function Hero() {
  const scrollToPlans = () =>
    document.querySelector("#plans")?.scrollIntoView({ behavior: "smooth", block: "start" });
  const scrollToFeatures = () =>
    document.querySelector("#features")?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <section
      id="home"
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-hades-hero"
    >
      {/* Layer 1: Galaxy gradient background — not pure black */}
      <div className="absolute inset-0 z-0">
        {/* Deep space gradient with subtle blue glow */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 100% 80% at 50% 0%, oklch(0.15 0.04 250 / 0.9), oklch(0.08 0.02 250) 60%, oklch(0.06 0.015 250) 100%)",
          }}
        />
        {/* Aurora gradient orbs — give depth and color */}
        <div
          className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full opacity-30 blur-3xl animate-aurora"
          style={{ background: "radial-gradient(circle, oklch(0.50 0.18 260 / 0.3), transparent 70%)" }}
        />
        <div
          className="absolute top-1/3 -right-1/4 w-[500px] h-[500px] rounded-full opacity-25 blur-3xl animate-aurora"
          style={{ background: "radial-gradient(circle, oklch(0.55 0.15 240 / 0.25), transparent 70%)", animationDelay: "4s" }}
        />
        <div
          className="absolute -bottom-1/4 left-1/4 w-[550px] h-[550px] rounded-full opacity-20 blur-3xl animate-aurora"
          style={{ background: "radial-gradient(circle, oklch(0.45 0.12 280 / 0.2), transparent 70%)", animationDelay: "8s" }}
        />
      </div>

      {/* Layer 2: Cursor glow */}
      <CursorGlow size={500} color="oklch(0.65 0.20 240 / 0.05)" />

      {/* Layer 3: Dark vignette for text readability — center spotlight */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, oklch(0.06 0.02 250 / 0.6), transparent 70%)",
          }}
        />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Layer 4: Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 text-center pt-24 pb-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-md px-4 py-1.5 text-sm font-medium text-primary mb-8 animate-fade-in-up glow-emerald">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          <span className="font-sans">NVMe storage now standard on every plan</span>
          <span className="text-primary/40">→</span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.05]">
          <AnimatedHeading
            text="POWER YOUR WORLD."
            delay={100}
            stagger={80}
            className="block"
          />
          <span className="block mt-3">
            <AnimatedHeading
              text="WITHOUT LIMITS."
              delay={700}
              stagger={80}
              wordClassName="text-gradient-hades"
            />
          </span>
        </h1>

        {/* Supporting text */}
        <p
          className="mt-8 max-w-2xl mx-auto text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed animate-fade-in-up"
          style={{ animationDelay: "1.4s", animationFillMode: "forwards" }}
        >
          High-performance Minecraft hosting built for players, communities and
          serious server owners. NVMe storage, powerful Ryzen processors, DDoS
          protection and instant deployment — all on Hades Cloud.
        </p>

        {/* CTAs */}
        <div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up"
          style={{ animationDelay: "1.6s", animationFillMode: "forwards" }}
        >
          <MagneticButton
            onClick={scrollToPlans}
            className="w-full sm:w-auto h-12 px-8 text-base font-sans font-semibold bg-primary text-primary-foreground hover:bg-primary/90 glow-emerald rounded-xl inline-flex items-center justify-center gap-2 transition-colors"
          >
            <Zap className="size-4" />
            View Plans
            <ChevronRight className="size-4" />
          </MagneticButton>
          <Button
            size="lg"
            variant="outline"
            onClick={scrollToFeatures}
            className="w-full sm:w-auto h-12 px-8 text-base font-sans font-medium bg-foreground/5 backdrop-blur-md border-border/60 hover:bg-foreground/10 rounded-xl"
          >
            <Cloud className="size-4" />
            Explore Features
          </Button>
        </div>

        {/* Trust strip */}
        <div
          className="mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto animate-fade-in-up"
          style={{ animationDelay: "1.8s", animationFillMode: "forwards" }}
        >
          <TrustStat icon={<Server className="size-4" />} value={<AnimatedCounter value={99.9} decimals={1} suffix="%" />} label="Uptime SLA" />
          <TrustStat icon={<Zap className="size-4" />} value={<><AnimatedCounter value={60} suffix="s" /></>} label="Avg deploy" />
          <TrustStat icon={<Shield className="size-4" />} value={<><AnimatedCounter value={24} />/<AnimatedCounter value={7} /></>} label="Protected" />
        </div>

        {/* Mini stats bar */}
        <div
          className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground animate-fade-in-up font-sans"
          style={{ animationDelay: "2s", animationFillMode: "forwards" }}
        >
          <span className="inline-flex items-center gap-1.5">
            <Globe className="size-3.5 text-primary" />
            <AnimatedCounter value={12} /> data centers
          </span>
          <span className="text-border">•</span>
          <span className="inline-flex items-center gap-1.5">
            <Cpu className="size-3.5 text-primary" />
            AMD Ryzen 9
          </span>
          <span className="text-border">•</span>
          <span className="inline-flex items-center gap-1.5">
            <Server className="size-3.5 text-primary" />
            <AnimatedCounter value={45000} suffix="+" /> servers deployed
          </span>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-2 text-muted-foreground/70 animate-fade-in-up" style={{ animationDelay: "2.2s", animationFillMode: "forwards" }}>
        <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <div className="relative w-px h-10 bg-gradient-to-b from-foreground/40 to-transparent overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary to-transparent animate-pulse-glow" />
        </div>
      </div>
    </section>
  );
}

function TrustStat({ icon, value, label }: { icon: React.ReactNode; value: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 group">
      <div className="flex items-center gap-1.5 text-primary group-hover:scale-110 transition-transform">
        {icon}
        <span className="font-display font-bold text-2xl sm:text-3xl">{value}</span>
      </div>
      <span className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider font-sans">{label}</span>
    </div>
  );
}
