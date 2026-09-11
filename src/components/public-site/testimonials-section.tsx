"use client";

import { Star, Quote } from "lucide-react";
import { Reveal } from "@/components/brand/reveal";
import { SectionEyebrow } from "@/components/public-site/why-hades-cloud";
import { TiltCard } from "@/components/enhanced/tilt-card";

const TESTIMONIALS = [
  {
    name: "Aarav Sharma",
    role: "Server Owner · Survival SMP",
    avatar: "AS",
    rating: 5,
    accent: "emerald",
    quote:
      "Switched from a budget host to Hades Cloud and our TPS went from 12 to a solid 20. The NVMe storage is no joke — chunk loading is instant even with 60+ players online. Console access is clean, backups actually work, and support answered my ticket in 14 minutes.",
  },
  {
    name: "Priya Patel",
    role: "Community Manager · Creative Hub",
    avatar: "PP",
    rating: 5,
    accent: "amber",
    quote:
      "We've been running a 200-player creative server for 8 months now. Zero downtime, zero data loss, zero drama. The control panel is the cleanest I've used — files, backups, plugins, all in one place. Worth every rupee.",
  },
  {
    name: "Rohan Mehta",
    role: "Streamer · PvP Network",
    avatar: "RM",
    rating: 5,
    accent: "emerald",
    quote:
      "Got DDoSed twice during a livestream with 3k viewers. Both times the attack was absorbed before I even noticed. Stream never dropped, players never disconnected. That alone justifies the price.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="/images/minecraft/forest-bg.jpg"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-10"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/92 to-background" />
      </div>
      <div className="absolute inset-0 bg-pixel-grid opacity-15 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center">
            <SectionEyebrow>From the community</SectionEyebrow>
          </div>
          <h2 className="font-pixel text-2xl sm:text-3xl lg:text-4xl font-normal tracking-tight mt-4 leading-tight">
            Loved by server owners.
            <br />
            <span className="text-gradient-hades text-xl sm:text-2xl lg:text-3xl">Built for the long run.</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-base sm:text-lg leading-relaxed">
            Real stories from communities running on Hades Cloud — from small
            survival SMPs to large PvP networks.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 100}>
              <TiltCard maxTilt={4} className="h-full">
                <TestimonialCard testimonial={t} />
              </TiltCard>
            </Reveal>
          ))}
        </div>

        {/* Aggregate rating */}
        <Reveal delay={300} className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 glass-card rounded-full px-5 py-2.5">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-accent text-accent" />
              ))}
            </div>
            <span className="text-sm font-medium">4.9 / 5</span>
            <span className="text-xs text-muted-foreground">from 2,400+ reviews</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function TestimonialCard({
  testimonial,
}: {
  testimonial: (typeof TESTIMONIALS)[number];
}) {
  const isEmerald = testimonial.accent === "emerald";
  return (
    <article className="group relative h-full glass-card rounded-2xl p-6 sm:p-7 flex flex-col hover:border-primary/40 transition-colors">
      {/* Quote icon */}
      <div
        className={`absolute top-5 right-5 ${
          isEmerald ? "text-primary/20" : "text-accent/20"
        }`}
      >
        <Quote className="size-12" fill="currentColor" />
      </div>

      {/* Stars */}
      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} className="size-4 fill-accent text-accent" />
        ))}
      </div>

      <p className="text-sm sm:text-[15px] text-foreground/90 leading-relaxed mb-6 flex-1 relative">
        "{testimonial.quote}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-border/40">
        <div
          className={`size-11 rounded-full flex items-center justify-center text-sm font-bold border ${
            isEmerald
              ? "bg-primary/10 border-primary/30 text-primary"
              : "bg-accent/10 border-accent/30 text-accent"
          }`}
        >
          {testimonial.avatar}
        </div>
        <div>
          <p className="font-medium text-sm">{testimonial.name}</p>
          <p className="text-xs text-muted-foreground">{testimonial.role}</p>
        </div>
      </div>
    </article>
  );
}
