"use client";

import { ChevronRight, Cloud, Server, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ParticleField } from "@/components/brand/particle-field";

/**
 * Cinematic Minecraft-themed hero.
 *
 * Background approach:
 * - Real Minecraft night landscape image, downloaded from the internet
 *   and stored locally at /public/images/minecraft/hero-bg.jpg
 * - Layered with a heavy dark gradient so text stays readable
 * - CSS pixel grid + animated embers add subtle motion
 * - On reduced-motion devices, particles auto-disable
 *
 * If the image fails to load, the dark gradient background remains —
 * the hero always looks intentional.
 */
const HERO_BG = "/images/minecraft/hero-bg.jpg";

export function Hero() {
  const scrollToPlans = () => {
    document
      .querySelector("#plans")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToFeatures = () => {
    document
      .querySelector("#features")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="home"
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-hades-hero"
    >
      {/* Background image layer — real Minecraft night landscape */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_BG}
          alt="Minecraft dark night landscape with mountains"
          className="w-full h-full object-cover opacity-30"
          loading="eager"
          fetchPriority="high"
        />
        {/* Dark vignette to ensure text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/75 via-background/65 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80" />
        {/* Pixel grid overlay */}
        <div className="absolute inset-0 bg-pixel-grid opacity-40" />
      </div>

      <ParticleField count={28} />

      {/* Soft cloud / fog layer */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none">
        <div
          className="absolute inset-0 animate-drift"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 100%, oklch(0.74 0.18 145 / 8%), transparent 70%)",
          }}
        />
      </div>

      {/* Decorative floating grass block — real Minecraft image */}
      <div className="absolute top-1/4 right-8 hidden xl:block z-5 pointer-events-none animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
        <img
          src="/images/minecraft/block-grass.png"
          alt=""
          aria-hidden="true"
          className="w-24 h-24 object-contain opacity-40 rotate-12"
          style={{ filter: "drop-shadow(0 0 24px oklch(0.74 0.18 145 / 30%))" }}
        />
      </div>

      {/* Decorative grass block on left — real Minecraft image */}
      <div className="absolute top-1/3 left-8 hidden xl:block z-5 pointer-events-none animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
        <img
          src="/images/minecraft/block-grass.png"
          alt=""
          aria-hidden="true"
          className="w-16 h-16 object-contain opacity-30 -rotate-12"
          style={{ filter: "drop-shadow(0 0 16px oklch(0.78 0.16 75 / 25%))" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 text-center pt-24 pb-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-foreground/5 backdrop-blur-md px-3 py-1.5 text-xs font-medium text-muted-foreground mb-8 animate-fade-in-up">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          New — NVMe storage now standard on all plans
        </div>

        <h1
          className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] animate-fade-in-up"
          style={{ animationDelay: "0.05s" }}
        >
          POWER YOUR WORLD.
          <br />
          <span className="text-gradient-hades">WITHOUT LIMITS.</span>
        </h1>

        <p
          className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed animate-fade-in-up"
          style={{ animationDelay: "0.15s" }}
        >
          High-performance Minecraft hosting built for players, communities and
          serious server owners. NVMe storage, powerful Ryzen processors, DDoS
          protection and instant deployment — all on Hades Cloud.
        </p>

        <div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up"
          style={{ animationDelay: "0.25s" }}
        >
          <Button
            size="lg"
            onClick={scrollToPlans}
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 glow-emerald h-12 px-7 text-base"
          >
            <Zap className="size-4" />
            View Plans
            <ChevronRight className="size-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={scrollToFeatures}
            className="w-full sm:w-auto h-12 px-7 text-base bg-foreground/5 backdrop-blur-md border-border/60"
          >
            <Cloud className="size-4" />
            Explore Features
          </Button>
        </div>

        {/* Trust strip */}
        <div
          className="mt-14 grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          <TrustStat icon={<Server className="size-4" />} value="99.9%" label="Uptime" />
          <TrustStat icon={<Zap className="size-4" />} value="<60s" label="Deploy" />
          <TrustStat icon={<Cloud className="size-4" />} value="24/7" label="Protected" />
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden sm:block">
        <div className="flex flex-col items-center gap-2 text-muted-foreground/60">
          <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-foreground/40 to-transparent" />
        </div>
      </div>
    </section>
  );
}

function TrustStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-1.5 text-primary">
        {icon}
        <span className="font-display font-bold text-lg sm:text-xl">{value}</span>
      </div>
      <span className="text-[11px] sm:text-xs text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}
