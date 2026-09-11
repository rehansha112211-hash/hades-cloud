"use client";

import { useEffect, useState } from "react";
import { Loader2, Zap, AlertCircle, Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/brand/reveal";
import { SectionEyebrow } from "@/components/public-site/why-hades-cloud";
import { TiltCard } from "@/components/enhanced/tilt-card";
import { api, type PublicPlan } from "@/lib/api/client";
import { useNav } from "@/stores/nav-store";
import { formatPrice } from "@/lib/helpers";
import { cn } from "@/lib/utils";

export function PlansSection() {
  const [plans, setPlans] = useState<PublicPlan[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { goOrder } = useNav();

  useEffect(() => {
    let alive = true;
    (async () => {
      const res = await api.getPublicPlans();
      if (!alive) return;
      if (res.ok) {
        setPlans(res.data.plans);
      } else {
        setError(res.error);
        setPlans([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section
      id="plans"
      className="relative py-20 sm:py-28 overflow-hidden"
    >
      {/* Stone / block texture atmosphere — real Minecraft block image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/minecraft/forest-bg.jpg"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-12"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/92 to-background" />
      </div>
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, oklch(0.26 0.015 245 / 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 70%, oklch(0.22 0.02 280 / 0.3) 0%, transparent 50%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center">
            <SectionEyebrow>Minecraft Hosting Plans</SectionEyebrow>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mt-3">
            Pick a plan. <span className="text-gradient-hades">Conquer the world.</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-base sm:text-lg leading-relaxed">
            Every plan ships with NVMe storage, DDoS protection and instant
            deployment. Upgrade or cancel anytime.
          </p>
        </Reveal>

        {/* States */}
        {plans === null && !error && <PlansSkeleton />}

        {error && (
          <div className="mt-12 max-w-md mx-auto text-center glass-card rounded-xl p-6">
            <AlertCircle className="size-6 text-destructive mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              Couldn't load plans right now. Please try again in a moment.
            </p>
          </div>
        )}

        {plans !== null && plans.length === 0 && !error && (
          <div className="mt-12 max-w-md mx-auto text-center glass-card rounded-xl p-8">
            <div className="mx-auto mb-4 size-12 rounded-lg bg-foreground/5 flex items-center justify-center">
              <Zap className="size-5 text-muted-foreground" />
            </div>
            <h3 className="font-display font-bold text-base mb-1">
              Plans coming soon
            </h3>
            <p className="text-sm text-muted-foreground">
              We're putting the finishing touches on our plan catalog. Check
              back shortly, or contact us for a custom quote.
            </p>
          </div>
        )}

        {plans !== null && plans.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {plans.map((plan, i) => (
              <Reveal key={plan.id} delay={i * 50}>
                <PlanCard plan={plan} onOrder={() => goOrder(plan.id)} />
              </Reveal>
            ))}
          </div>
        )}

        <Reveal className="mt-12 text-center" delay={200}>
          <p className="text-sm text-muted-foreground">
            Need something bigger?{" "}
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document
                  .querySelector("#contact")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="text-primary hover:underline font-medium"
            >
              Contact us for a custom plan →
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function PlanCard({
  plan,
  onOrder,
}: {
  plan: PublicPlan;
  onOrder: () => void;
}) {
  // Highlight the middle plan (heuristic for "popular")
  const isFeatured =
    plan.name.toUpperCase() === "DIAMOND" ||
    plan.name.toUpperCase() === "IRON";

  return (
    <TiltCard maxTilt={4} scale={1.015} className="h-full">
      <article
        className={cn(
          "group relative h-full glass-card rounded-2xl p-6 flex flex-col overflow-hidden",
          "transition-all duration-300",
          "hover:border-primary/40",
          isFeatured
            ? "ring-1 ring-primary/40 animate-glow-pulse"
            : "border-border/40"
        )}
      >
        {/* Gradient corner glow on hover */}
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/0 group-hover:bg-primary/10 blur-3xl transition-all duration-700 pointer-events-none" />

        {isFeatured && (
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary/20 border border-primary/40 backdrop-blur-md text-[10px] font-bold tracking-[0.2em] uppercase text-primary z-10 flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-primary animate-pulse-glow" />
            Most Popular
          </span>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-5 relative">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-1">
              {plan.category}
            </p>
            <h3 className="font-display font-bold text-2xl tracking-wide">
              {plan.name}
            </h3>
          </div>
          <PlanCategoryBadge category={plan.category} />
        </div>

        {/* Price */}
        <div className="mb-6 relative">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl text-muted-foreground font-display">₹</span>
            <span className="font-display font-bold text-5xl tracking-tight">
              {Math.floor(plan.price)}
            </span>
            <span className="text-sm text-muted-foreground">
              /{plan.duration.toLowerCase().replace("1 ", "")}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1.5">
            <Check className="size-3 text-primary" />
            Billed {plan.duration.toLowerCase()}
          </p>
        </div>

        {/* Specs */}
        <dl className="space-y-2.5 mb-8 flex-1">
          <SpecRow label="RAM" value={plan.ram} highlight />
          <SpecRow label="Storage" value={`${plan.storage} ${plan.storageType}`} />
          <SpecRow label="CPU" value={plan.cpu} />
          <SpecRow label="Processor" value={plan.processor} />
        </dl>

        {/* Inclusion strip */}
        <div className="flex flex-wrap gap-2 mb-5 text-[10px]">
          {["DDoS", "NVMe", "24/7"].map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 rounded-md bg-foreground/5 border border-border/40 text-muted-foreground uppercase tracking-wider"
            >
              {t}
            </span>
          ))}
        </div>

        <Button
          onClick={onOrder}
          className={cn(
            "w-full h-11 group/btn relative overflow-hidden",
            isFeatured
              ? "bg-primary text-primary-foreground hover:bg-primary/90 glow-emerald"
              : "bg-foreground/10 text-foreground hover:bg-foreground/15 border border-border hover:border-primary/40"
          )}
        >
          <Zap className="size-4 transition-transform group-hover/btn:scale-110" />
          Order Now
          <ChevronRight className="size-4 transition-transform group-hover/btn:translate-x-0.5" />
        </Button>
      </article>
    </TiltCard>
  );
}

function SpecRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd
        className={cn(
          "text-sm font-medium",
          highlight && "text-primary"
        )}
      >
        {value}
      </dd>
    </div>
  );
}

function PlanCategoryBadge({ category }: { category: string }) {
  const c = category.toUpperCase();
  const color =
    c === "NETHERITE"
      ? "from-redstone/30 to-amber/30 border-redstone/40 text-redstone"
      : c === "DIAMOND"
      ? "from-diamond/30 to-emerald/30 border-diamond/40 text-diamond"
      : c === "IRON"
      ? "from-muted to-muted border-border text-foreground"
      : c === "STONE"
      ? "from-muted to-muted border-border text-foreground"
      : "from-emerald/20 to-amber/20 border-primary/30 text-primary";

  return (
    <span
      className={cn(
        "inline-flex size-8 rounded-md items-center justify-center text-[10px] font-bold uppercase tracking-wider bg-gradient-to-br border",
        color
      )}
      aria-hidden="true"
    >
      {c.charAt(0)}
    </span>
  );
}

function PlansSkeleton() {
  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="glass-card rounded-2xl p-6 h-[420px] animate-pulse"
        >
          <div className="flex items-start justify-between mb-5">
            <div className="space-y-2">
              <div className="h-3 w-12 bg-foreground/10 rounded" />
              <div className="h-6 w-24 bg-foreground/10 rounded" />
            </div>
            <div className="size-8 bg-foreground/10 rounded-md" />
          </div>
          <div className="h-9 w-32 bg-foreground/10 rounded mb-6" />
          <div className="space-y-3 mb-8">
            {Array.from({ length: 4 }).map((_, j) => (
              <div
                key={j}
                className="flex justify-between py-2 border-b border-border/40"
              >
                <div className="h-3 w-10 bg-foreground/10 rounded" />
                <div className="h-3 w-20 bg-foreground/10 rounded" />
              </div>
            ))}
          </div>
          <div className="h-11 w-full bg-foreground/10 rounded" />
        </div>
      ))}
    </div>
  );
}
