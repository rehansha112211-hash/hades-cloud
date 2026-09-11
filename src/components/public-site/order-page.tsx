"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  Loader2,
  Lock,
  Zap,
  AlertCircle,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandLogo } from "@/components/brand/brand-logo";
import { api, type PublicPlan } from "@/lib/api/client";
import { useNav } from "@/stores/nav-store";
import { formatPrice } from "@/lib/helpers";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function OrderPage({ planId }: { planId: string }) {
  const { goPublic, goOrderSuccess } = useNav();
  const [plan, setPlan] = useState<PublicPlan | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const res = await api.getPublicPlans();
      if (!alive) return;
      setLoadingPlan(false);
      if (res.ok) {
        const p = res.data.plans.find((p) => p.id === planId);
        if (p) setPlan(p);
        else setNotFound(true);
      } else {
        setNotFound(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [planId]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plan) return;
    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSubmitting(true);
    const res = await api.createOrder({
      planId: plan.id,
      customer: { name, email, phone: phone || undefined },
      customerNote: note || undefined,
    });
    setSubmitting(false);
    if (res.ok) {
      toast.success("Order created — see details below.");
      goOrderSuccess(res.data.order.orderNumber);
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="min-h-screen bg-hades-hero">
      {/* Top bar */}
      <header className="border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <BrandLogo size={32} />
          <Button
            variant="ghost"
            size="sm"
            onClick={goPublic}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to site
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-foreground/5 px-3 py-1 text-xs text-muted-foreground mb-4">
              <Lock className="size-3" />
              Secure checkout
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Complete your order
            </h1>
            <p className="mt-2 text-muted-foreground">
              You're one step away from launching your Minecraft server.
            </p>
          </div>

          {loadingPlan && <OrderSkeleton />}

          {notFound && (
            <div className="glass-card rounded-2xl p-8 text-center">
              <AlertCircle className="size-8 text-destructive mx-auto mb-3" />
              <h2 className="font-display font-bold text-lg mb-1">
                Plan not found
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                The plan you selected is no longer available.
              </p>
              <Button onClick={goPublic}>Browse all plans</Button>
            </div>
          )}

          {plan && (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6">
              {/* Order summary */}
              <aside className="glass-card rounded-2xl p-6 lg:sticky lg:top-6 self-start">
                <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">
                  Order summary
                </p>
                <h2 className="font-display font-bold text-2xl mb-1">
                  {plan.name}
                </h2>
                <p className="text-xs text-muted-foreground mb-6">
                  {plan.category} · {plan.duration}
                </p>

                <div className="space-y-3 mb-6">
                  <SpecRow label="RAM" value={plan.ram} />
                  <SpecRow label="Storage" value={`${plan.storage} ${plan.storageType}`} />
                  <SpecRow label="CPU" value={plan.cpu} />
                  <SpecRow label="Processor" value={plan.processor} />
                </div>

                <div className="border-t border-border/60 pt-4 mb-6">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <div className="text-right">
                      <div className="font-display font-bold text-3xl">
                        {formatPrice(plan.price)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        one-time · {plan.duration.toLowerCase()}
                      </div>
                    </div>
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-muted-foreground">
                  <Included>DDoS protection included</Included>
                  <Included>NVMe storage standard</Included>
                  <Included>Cancel anytime</Included>
                  <Included>24/7 infrastructure monitoring</Included>
                </ul>
              </aside>

              {/* Checkout form */}
              <section className="glass-card rounded-2xl p-6 sm:p-8">
                <form onSubmit={onSubmit} className="space-y-5">
                  <div>
                    <h3 className="font-display font-bold text-lg mb-1">
                      Your details
                    </h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      We'll send your order confirmation and server setup
                      instructions to this email.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="o-name" className="text-xs uppercase tracking-wider">
                        Full name *
                      </Label>
                      <Input
                        id="o-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        autoComplete="name"
                        maxLength={120}
                        placeholder="Aarav Sharma"
                        className="bg-foreground/5 border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="o-email" className="text-xs uppercase tracking-wider">
                        Email *
                      </Label>
                      <Input
                        id="o-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                        maxLength={254}
                        placeholder="you@example.com"
                        className="bg-foreground/5 border-border"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="o-phone" className="text-xs uppercase tracking-wider">
                      Phone (optional)
                    </Label>
                    <Input
                      id="o-phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      autoComplete="tel"
                      maxLength={30}
                      placeholder="+91 98765 43210"
                      className="bg-foreground/5 border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="o-note" className="text-xs uppercase tracking-wider">
                      Order note (optional)
                    </Label>
                    <Input
                      id="o-note"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      maxLength={500}
                      placeholder="Tell us about your server idea..."
                      className="bg-foreground/5 border-border"
                    />
                  </div>

                  <div className="rounded-lg border border-amber/30 bg-amber/5 p-4 text-xs text-amber leading-relaxed">
                    <p className="font-semibold mb-1">
                      Payment information
                    </p>
                    <p className="text-amber/80">
                      We're finalizing our payment gateway integration. After
                      you place the order, our team will reach out via email
                      with payment instructions and your order reference
                      number. Your card will never be charged without your
                      explicit confirmation.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 glow-emerald text-base"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Placing order...
                      </>
                    ) : (
                      <>
                        <Zap className="size-4" />
                        Place order — {formatPrice(plan.price)}
                      </>
                    )}
                  </Button>

                  <p className="text-[11px] text-muted-foreground text-center">
                    By placing this order you agree to our Terms and Privacy
                    Policy. No payment is processed until you confirm via the
                    follow-up email.
                  </p>
                </form>
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function Included({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2">
      <Check className="size-3 text-primary shrink-0" />
      {children}
    </li>
  );
}

function OrderSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6">
      <div className="glass-card rounded-2xl p-6 h-96 animate-pulse" />
      <div className="glass-card rounded-2xl p-6 h-96 animate-pulse" />
    </div>
  );
}
