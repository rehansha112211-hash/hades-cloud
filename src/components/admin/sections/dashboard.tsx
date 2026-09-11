"use client";

import { useEffect, useState } from "react";
import {
  Package,
  Eye,
  EyeOff,
  ShoppingCart,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Reveal } from "@/components/brand/reveal";
import { api, type AdminStats } from "@/lib/api/client";
import { formatPrice } from "@/lib/helpers";
import { cn } from "@/lib/utils";

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      const res = await api.getStats();
      if (!alive) return;
      if (res.ok) setStats(res.data.stats);
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-20 text-muted-foreground text-sm">
        Couldn't load dashboard stats. Please refresh.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top stat cards */}
      <Reveal>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          <StatCard
            icon={Package}
            label="Total Plans"
            value={String(stats.totalPlans)}
            tone="default"
          />
          <StatCard
            icon={Eye}
            label="Visible Plans"
            value={String(stats.visiblePlans)}
            tone="primary"
          />
          <StatCard
            icon={EyeOff}
            label="Hidden Plans"
            value={String(stats.hiddenPlans)}
            tone="muted"
          />
          <StatCard
            icon={ShoppingCart}
            label="Total Orders"
            value={String(stats.totalOrders)}
            tone="default"
          />
          <StatCard
            icon={Users}
            label="Customers"
            value={String(stats.totalCustomers)}
            tone="default"
          />
        </div>
      </Reveal>

      {/* Secondary stats */}
      <Reveal delay={100}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <SecondaryStat
            icon={Clock}
            label="Pending payment orders"
            value={String(stats.pendingPaymentOrders)}
            description="Orders waiting for payment confirmation"
            tone="amber"
          />
          <SecondaryStat
            icon={CheckCircle2}
            label="Paid orders"
            value={String(stats.paidOrders)}
            description="Successfully completed orders"
            tone="emerald"
          />
          <SecondaryStat
            icon={TrendingUp}
            label="Revenue (paid)"
            value={formatPrice(stats.revenue)}
            description="Total collected from paid orders"
            tone="emerald"
          />
        </div>
      </Reveal>

      {/* Quick info */}
      <Reveal delay={150}>
        <div className="glass-card rounded-xl p-5">
          <h3 className="font-display font-bold text-sm mb-3">
            Quick actions
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Jump straight into the most common admin tasks.
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              • <span className="text-foreground">Plans</span> — create, edit,
              hide or delete hosting plans
            </li>
            <li>
              • <span className="text-foreground">Categories</span> — add new
              categories that appear automatically in the plan form
            </li>
            <li>
              • <span className="text-foreground">Orders</span> — mark orders as
              paid once payment is confirmed manually
            </li>
            <li>
              • <span className="text-foreground">Settings</span> — update
              support email, Discord link and check integration status
            </li>
          </ul>
        </div>
      </Reveal>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Package;
  label: string;
  value: string;
  tone: "primary" | "muted" | "default";
}) {
  const accent =
    tone === "primary"
      ? "text-primary bg-primary/10 border-primary/30"
      : tone === "muted"
      ? "text-muted-foreground bg-foreground/5 border-border"
      : "text-foreground bg-foreground/5 border-border";
  return (
    <div className="glass-card rounded-xl p-4">
      <div
        className={cn(
          "inline-flex items-center justify-center size-9 rounded-md border mb-3",
          accent
        )}
      >
        <Icon className="size-4" />
      </div>
      <div className="font-display font-bold text-2xl leading-none">{value}</div>
      <p className="text-[11px] text-muted-foreground mt-1.5 uppercase tracking-wider">
        {label}
      </p>
    </div>
  );
}

function SecondaryStat({
  icon: Icon,
  label,
  value,
  description,
  tone,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
  description: string;
  tone: "emerald" | "amber";
}) {
  const accent =
    tone === "emerald"
      ? "text-primary bg-primary/10 border-primary/30"
      : "text-accent bg-accent/10 border-accent/30";
  return (
    <div className="glass-card rounded-xl p-5 flex items-start gap-4">
      <div
        className={cn(
          "inline-flex items-center justify-center size-11 rounded-lg border shrink-0",
          accent
        )}
      >
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">
          {label}
        </p>
        <div className="font-display font-bold text-2xl leading-none">
          {value}
        </div>
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
