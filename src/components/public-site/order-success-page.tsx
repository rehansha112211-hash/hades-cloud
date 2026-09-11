"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Loader2, Copy, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand/brand-logo";
import { useNav } from "@/stores/nav-store";
import { formatPrice } from "@/lib/helpers";
import { toast } from "sonner";

type OrderDetail = {
  id: string;
  orderNumber: string;
  amount: number;
  status: string;
  createdAt: string;
  customer: { name: string; email: string };
  plan: {
    name: string;
    duration: string;
    ram: string;
    storage: string;
    storageType: string;
    cpu: string;
    processor: string;
  };
};

export function OrderSuccessPage({
  orderNumber,
}: {
  orderNumber: string;
}) {
  const { goPublic } = useNav();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`/api/orders/${orderNumber}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (alive && data.order) {
          setOrder(data.order);
        }
      } catch {
        // ignore
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [orderNumber]);

  const copyNumber = () => {
    navigator.clipboard.writeText(orderNumber);
    toast.success("Order number copied");
  };

  return (
    <div className="min-h-screen bg-hades-hero">
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

      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
        {loading ? (
          <div className="text-center">
            <Loader2 className="size-8 animate-spin text-primary mx-auto" />
            <p className="text-sm text-muted-foreground mt-3">
              Loading your order...
            </p>
          </div>
        ) : (
          <div className="text-center">
            <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10 border border-primary/30 mb-6">
              <CheckCircle2 className="size-8 text-primary" />
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              Order received
            </h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Your order has been placed successfully. We've sent a
              confirmation email with the next steps.
            </p>

            <div className="glass-card rounded-2xl p-6 text-left mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-1">
                    Order number
                  </p>
                  <button
                    type="button"
                    onClick={copyNumber}
                    className="inline-flex items-center gap-2 font-mono text-lg font-bold hover:text-primary transition-colors"
                  >
                    {orderNumber}
                    <Copy className="size-3.5" />
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-1">
                    Status
                  </p>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber/10 border border-amber/30 text-amber text-xs font-medium">
                    <span className="size-1.5 rounded-full bg-amber animate-pulse-glow" />
                    {order?.status?.replace(/_/g, " ") ?? "PENDING PAYMENT"}
                  </span>
                </div>
              </div>

              {order && (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-border/40">
                    <Field label="Plan" value={order.plan.name} />
                    <Field label="Duration" value={order.plan.duration} />
                    <Field label="RAM" value={order.plan.ram} />
                    <Field
                      label="Storage"
                      value={`${order.plan.storage} ${order.plan.storageType}`}
                    />
                    <Field label="CPU" value={order.plan.cpu} />
                    <Field label="Processor" value={order.plan.processor} />
                  </div>

                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      Amount due
                    </span>
                    <span className="font-display font-bold text-2xl">
                      {formatPrice(order.amount)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Payment instructions will be emailed to{" "}
                    <span className="text-foreground font-medium">
                      {order.customer.email}
                    </span>{" "}
                    shortly. Your server is provisioned automatically after
                    payment confirmation.
                  </p>
                </>
              )}
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground text-left mb-8">
              <div className="flex items-start gap-3">
                <Server className="size-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground mb-1">
                    What happens next?
                  </p>
                  <ol className="space-y-1 list-decimal list-inside text-xs">
                    <li>You'll receive an email with payment instructions</li>
                    <li>Once paid, your server is provisioned automatically</li>
                    <li>You'll get a control panel link and server IP</li>
                    <li>Invite players and start building</li>
                  </ol>
                </div>
              </div>
            </div>

            <Button
              onClick={goPublic}
              variant="outline"
              className="bg-foreground/5 border-border"
            >
              Back to home
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
