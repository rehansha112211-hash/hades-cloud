"use client";

import { Reveal } from "@/components/brand/reveal";
import { SectionEyebrow } from "@/components/public-site/why-hades-cloud";
import { TiltCard } from "@/components/enhanced/tilt-card";
import { cn } from "@/lib/utils";

const SCREENSHOTS = [
  {
    src: "/images/minecraft/hero-epic.jpg",
    title: "Night Survival",
    biome: "Mountains",
    span: "lg:col-span-2 lg:row-span-2",
  },
  {
    src: "/images/minecraft/village.jpg",
    title: "Village Build",
    biome: "Plains",
    span: "",
  },
  {
    src: "/images/minecraft/panorama.jpg",
    title: "Mountain Panorama",
    biome: "Extreme Hills",
    span: "",
  },
  {
    src: "/images/minecraft/cave-bg.jpg",
    title: "Deep Cave System",
    biome: "Underground",
    span: "",
  },
  {
    src: "/images/minecraft/forest-bg.jpg",
    title: "Dark Forest",
    biome: "Forest",
    span: "lg:col-span-2",
  },
] as const;

export function GallerySection() {
  return (
    <section id="gallery" className="relative py-20 sm:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/minecraft/survival.jpg"
          alt="Minecraft survival world"
          className="w-full h-full object-cover opacity-20"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/85 to-background" />
      </div>
      <div className="absolute inset-0 bg-pixel-grid opacity-15 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl mx-auto text-center mb-12">
          <div className="flex justify-center">
            <SectionEyebrow>World Gallery</SectionEyebrow>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mt-4 leading-tight">
            Worlds your players
            <br />
            <span className="text-gradient-hades">will build.</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-base sm:text-lg leading-relaxed">
            Real Minecraft worlds running on Hades Cloud infrastructure.
            From survival nights to massive village builds — your community's
            next home.
          </p>
        </Reveal>

        {/* Bento-style gallery grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-[180px] sm:auto-rows-[220px]">
          {SCREENSHOTS.map((shot, i) => (
            <Reveal key={shot.title} delay={i * 80} className={cn("group", shot.span)}>
              <TiltCard maxTilt={4} className="h-full">
                <div className="relative h-full overflow-hidden rounded-2xl border border-border/60 group-hover:border-primary/40 transition-colors">
                  <img
                    src={shot.src}
                    alt={`${shot.title} — ${shot.biome} biome`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent" />
                  {/* Title */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-primary mb-1">
                      {shot.biome}
                    </p>
                    <h3 className="font-display font-bold text-base sm:text-lg text-foreground">
                      {shot.title}
                    </h3>
                  </div>
                  {/* Hover icon */}
                  <div className="absolute top-3 right-3 size-8 rounded-full bg-background/60 backdrop-blur-md border border-border/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="size-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200} className="mt-10 text-center">
          <p className="text-sm text-muted-foreground">
            Every world runs on dedicated Ryzen 9 hardware with NVMe storage.
            <span className="text-primary font-medium"> Your world, your rules.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
