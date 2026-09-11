"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Zap, AlertCircle, Loader2, Check, ChevronRight } from "lucide-react";
import { SiteLayout } from "@/components/shared/site-layout";
import { Button } from "@/components/ui/button";
import { api, type PublicPlan } from "@/lib/api/client";
import { formatPrice } from "@/lib/helpers";
import { cn } from "@/lib/utils";

export function PlansListPage({
  planType,
  title,
  subtitle,
  activePage,
}: {
  planType: string;
  title: string;
  subtitle: string;
  activePage: string;
}) {
  const [plans, setPlans] = useState<PublicPlan[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      const res = await api.getPublicPlans();
      if (!alive) return;
      if (res.ok) {
        // Filter plans by planType (budget: price<=99, performance: price>99, bot: none yet)
        if (planType === "budget") {
          setPlans(res.data.plans.filter((p) => p.price <= 99));
        } else if (planType === "performance") {
          setPlans(res.data.plans.filter((p) => p.price > 99));
        } else {
          setPlans([]); // bot hosting — no plans yet
        }
      } else {
        setPlans([]);
      }
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [planType]);

  const DISCORD_URL = process.env.NEXT_PUBLIC_DISCORD_URL || "https://discord.gg/R8dR4t4qWf";

  const onOrder = () => {
    window.open(DISCORD_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <SiteLayout activePage={activePage}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <Link href="/plans" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ChevronLeft className="size-4" /> Back to Plans
        </Link>

        <div className="mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.25em] uppercase text-primary mb-3">
            <span className="w-6 h-px bg-primary/60" /> {title}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">{title}</h1>
          <p className="mt-3 text-muted-foreground text-base sm:text-lg leading-relaxed max-w-2xl">{subtitle}</p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        )}

        {plans !== null && plans.length === 0 && (
          <div className="glass-card rounded-2xl p-10 text-center">
            <div className="size-12 rounded-lg bg-foreground/5 mx-auto mb-3 flex items-center justify-center">
              <AlertCircle className="size-5 text-muted-foreground" />
            </div>
            <h3 className="font-display font-bold text-base mb-1">No plans available yet</h3>
            <p className="text-sm text-muted-foreground mb-4">We're working on {title.toLowerCase()}. Join our Discord to get notified when they launch.</p>
            <Button onClick={onOrder} className="bg-primary text-primary-foreground glow-emerald">
              Join Discord
            </Button>
          </div>
        )}

        {plans !== null && plans.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {plans.map((plan) => {
              const isFeatured = plan.name.toUpperCase() === "DIAMOND";
              return (
                <article key={plan.id} className={cn("group relative glass-card rounded-2xl p-6 flex flex-col transition-all hover:border-primary/40", isFeatured && "ring-1 ring-primary/40")}>
                  {isFeatured && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary/20 border border-primary/40 backdrop-blur-md text-[10px] font-bold tracking-[0.2em] uppercase text-primary z-10">
                      Most Popular
                    </span>
                  )}
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-1 font-sans">{plan.category}</p>
                      <h3 className="font-display font-bold text-2xl tracking-wide">{plan.name}</h3>
                    </div>
                  </div>
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl text-muted-foreground font-display">₹</span>
                      <span className="font-display font-bold text-5xl tracking-tight">{Math.floor(plan.price)}</span>
                      <span className="text-sm text-muted-foreground font-sans">/{plan.duration.toLowerCase().replace("1 ", "")}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1.5 font-sans">
                      <Check className="size-3 text-primary" /> Billed {plan.duration.toLowerCase()}
                    </p>
                  </div>
                  <dl className="space-y-2.5 mb-8 flex-1">
                    <SpecRow label="RAM" value={plan.ram} highlight />
                    <SpecRow label="Storage" value={`${plan.storage} ${plan.storageType}`} />
                    <SpecRow label="CPU" value={plan.cpu} />
                    <SpecRow label="Processor" value={plan.processor} />
                  </dl>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {["DDoS", "NVMe", "24/7"].map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded-md bg-foreground/5 border border-border/40 text-[10px] font-medium text-muted-foreground uppercase tracking-wider font-sans">{t}</span>
                    ))}
                  </div>
                  <Button onClick={onOrder} className={cn("w-full h-11 rounded-xl font-sans font-semibold text-sm", isFeatured ? "bg-primary text-primary-foreground hover:bg-primary/90 glow-emerald" : "bg-foreground/10 text-foreground hover:bg-foreground/15 border border-border hover:border-primary/40")}>
                    <Zap className="size-4" /> Order Now <ChevronRight className="size-4" />
                  </Button>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}

function SpecRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
      <dt className="text-xs uppercase tracking-wider text-muted-foreground font-sans">{label}</dt>
      <dd className={cn("text-sm font-medium font-sans", highlight && "text-primary")}>{value}</dd>
    </div>
  );
}
