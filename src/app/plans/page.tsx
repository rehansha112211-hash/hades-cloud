"use client";

import Link from "next/link";
import { ChevronRight, Wallet, Cpu, Bot } from "lucide-react";
import { SiteLayout } from "@/components/shared/site-layout";

const PLAN_TYPES = [
  {
    title: "Budget Plans",
    description: "Affordable hosting for small communities and starters. Perfect for getting your first server online without breaking the bank.",
    icon: Wallet,
    href: "/plans/budget",
    color: "text-primary",
    bgColor: "bg-primary/10 border-primary/30",
  },
  {
    title: "Performance Plans",
    description: "High-performance servers with more RAM, faster CPUs, and larger storage. Built for growing communities and demanding modpacks.",
    icon: Cpu,
    href: "/plans/performance",
    color: "text-accent",
    bgColor: "bg-accent/10 border-accent/30",
  },
  {
    title: "Bot Hosting",
    description: "Dedicated hosting for Discord bots, Minecraft bots, and automation. Keep your bots running 24/7 with reliable uptime.",
    icon: Bot,
    href: "/plans/bot-hosting",
    color: "text-primary",
    bgColor: "bg-primary/10 border-primary/30",
  },
];

export default function PlansPage() {
  return (
    <SiteLayout activePage="/plans">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.25em] uppercase text-primary mb-4">
            <span className="w-6 h-px bg-primary/60" /> Choose Your Plan <span className="w-6 h-px bg-primary/60" />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            Find your perfect
            <br />
            <span className="text-gradient-hades">hosting plan.</span>
          </h1>
          <p className="mt-6 text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
            Three categories of hosting to match every need and budget.
            From starter servers to high-performance builds and bot hosting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLAN_TYPES.map((plan) => (
            <Link key={plan.href} href={plan.href} className="group">
              <div className="glass-card rounded-2xl p-6 h-full flex flex-col hover:border-primary/40 transition-all hover-lift">
                <div className={`inline-flex items-center justify-center size-14 rounded-xl border mb-5 ${plan.bgColor} ${plan.color}`}>
                  <plan.icon className="size-6" />
                </div>
                <h2 className="font-display font-bold text-xl mb-2">{plan.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{plan.description}</p>
                <div className={`mt-6 inline-flex items-center gap-1.5 text-sm font-medium ${plan.color}`}>
                  View Plans
                  <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Not sure which plan is right for you?{" "}
            <a
              href={process.env.NEXT_PUBLIC_DISCORD_URL || "https://discord.gg/R8dR4t4qWf"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              Join our Discord and ask →
            </a>
          </p>
        </div>
      </div>
    </SiteLayout>
  );
}
