"use client";

import { Reveal } from "@/components/brand/reveal";
import { SectionEyebrow } from "@/components/public-site/why-hades-cloud";
import { TiltCard } from "@/components/enhanced/tilt-card";

/**
 * Gallery section — cosmic cards with CSS gradients and CSS star dots.
 * Simplified to prevent render crashes.
 */
type CardDef = {
  title: string;
  biome: string;
  span: string;
  gradient: string;
  stars: number;
};

const COSMIC_CARDS: CardDef[] = [
  {
    title: "Deep Space",
    biome: "Galaxy",
    span: "lg:col-span-2 lg:row-span-2",
    gradient: "radial-gradient(ellipse at 30% 40%, oklch(0.25 0.15 260 / 0.6), oklch(0.08 0.02 250) 70%)",
    stars: 40,
  },
  {
    title: "Nebula",
    biome: "Cosmic",
    span: "",
    gradient: "radial-gradient(ellipse at 70% 30%, oklch(0.30 0.18 280 / 0.5), oklch(0.08 0.02 250) 70%)",
    stars: 25,
  },
  {
    title: "Stellar",
    biome: "Interstellar",
    span: "",
    gradient: "radial-gradient(ellipse at 50% 60%, oklch(0.25 0.12 240 / 0.5), oklch(0.08 0.02 250) 70%)",
    stars: 20,
  },
  {
    title: "Star Field",
    biome: "Stars",
    span: "",
    gradient: "radial-gradient(ellipse at 20% 70%, oklch(0.22 0.10 200 / 0.5), oklch(0.08 0.02 250) 70%)",
    stars: 30,
  },
  {
    title: "Void",
    biome: "Deep Space",
    span: "lg:col-span-2",
    gradient: "radial-gradient(ellipse at 60% 50%, oklch(0.18 0.08 280 / 0.4), oklch(0.08 0.02 250) 70%)",
    stars: 35,
  },
];

export function GallerySection() {
  return (
    <section id="gallery" className="relative py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 z-0" style={{ background: "radial-gradient(ellipse 60% 50% at 70% 30%, oklch(0.20 0.10 260 / 0.1), transparent 70%)" }} />
      <div className="absolute inset-0 bg-pixel-grid opacity-15 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        <Reveal className="max-w-2xl mx-auto text-center mb-12">
          <div className="flex justify-center">
            <SectionEyebrow>Space Gallery</SectionEyebrow>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mt-4 leading-tight">
            Explore the
            <br />
            <span className="text-gradient-hades">cosmos.</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-base sm:text-lg leading-relaxed">
            Pure CSS-rendered cosmic scenes — galaxies, nebulae, and star fields.
            Every card is generated in real-time, no images needed.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-[180px] sm:auto-rows-[220px]">
          {COSMIC_CARDS.map((card, i) => (
            <Reveal key={card.title} delay={i * 80} className={"group " + card.span}>
              <TiltCard maxTilt={4} className="h-full">
                <div className="relative h-full overflow-hidden rounded-2xl border border-border/60 group-hover:border-primary/40 transition-colors">
                  <div className="absolute inset-0" style={{ background: card.gradient }} />

                  <div className="absolute inset-0">
                    {Array.from({ length: card.stars }).map((_, si) => {
                      const left = (si * 73 + 17) % 100;
                      const top = (si * 91 + 31) % 100;
                      const size = 1 + ((si * 13) % 3);
                      const animDelay = (si * 0.3) % 4;
                      return (
                        <span
                          key={si}
                          className="absolute rounded-full bg-white animate-pulse-glow"
                          style={{
                            left: left + "%",
                            top: top + "%",
                            width: size + "px",
                            height: size + "px",
                            opacity: 0.4 + ((si % 5) * 0.1),
                            animationDelay: animDelay + "s",
                            boxShadow: si % 3 === 0 ? "0 0 4px rgba(200,220,255,0.6)" : "none",
                          }}
                        />
                      );
                    })}
                  </div>

                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: "radial-gradient(circle at 50% 50%, oklch(0.65 0.20 240 / 0.08), transparent 70%)" }} />

                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-primary mb-1">
                      {card.biome}
                    </p>
                    <h3 className="font-display font-bold text-base sm:text-lg text-foreground">
                      {card.title}
                    </h3>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200} className="mt-10 text-center">
          <p className="text-sm text-muted-foreground">
            Every server runs on dedicated Ryzen 9 hardware with NVMe storage.
            <span className="text-primary font-medium"> Your world, your rules.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
