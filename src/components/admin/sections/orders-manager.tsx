"use client";

import { useEffect, useState } from "react";
import { Loader2, Search, ShoppingCart, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api, type AdminOrder } from "@/lib/api/client";
import { formatPrice } from "@/lib/helpers";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STATUS_TONES: Record<string, string> = {
  PENDING_PAYMENT: "bg-amber/10 text-amber border-amber/30",
  AWAITING_PAYMENT: "bg-amber/10 text-amber border-amber/30",
  PAID: "bg-primary/10 text-primary border-primary/30",
  FAILED: "bg-redstone/10 text-redstone border-redstone/30",
  CANCELLED: "bg-muted text-muted-foreground border-border",
  REFUNDED: "bg-diamond/10 text-diamond border-diamond/30",
};

const STATUSES = [
  "PENDING_PAYMENT",
  "AWAITING_PAYMENT",
  "PAID",
  "FAILED",
  "CANCELLED",
  "REFUNDED",
];

export function OrdersManager() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const refresh = async () => {
    const res = await api.getOrders();
    if (res.ok) setOrders(res.data.orders);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const onStatusChange = async (id: string, status: string) => {
    const prev = orders;
    setOrders((arr) =>
      arr.map((o) => (o.id === id ? { ...o, status } : o))
    );
    const res = await api.updateOrderStatus(id, status);
    if (res.ok) {
      toast.success("Order status updated");
    } else {
      toast.error(res.error);
      setOrders(prev);
    }
  };

  const filtered = orders.filter((o) => {
    if (statusFilter !== "ALL" && o.status !== statusFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      o.orderNumber.toLowerCase().includes(q) ||
      o.customer.name.toLowerCase().includes(q) ||
      o.customer.email.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="glass-card rounded-xl p-10 text-center">
        <div className="size-12 rounded-lg bg-foreground/5 mx-auto mb-3 flex items-center justify-center">
          <ShoppingCart className="size-5 text-muted-foreground" />
        </div>
        <h3 className="font-display font-bold text-base mb-1">No orders yet</h3>
        <p className="text-sm text-muted-foreground">
          When customers place orders, they'll appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order #, name, email..."
              className="pl-9 bg-foreground/5 border-border w-full sm:w-80"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-foreground/5 border-border w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All statuses</SelectItem>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <span className="text-xs text-muted-foreground">
          {filtered.length} of {orders.length} orders
        </span>
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block glass-card rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-foreground/[0.03] border-b border-border/40">
            <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3 font-medium">Order #</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Plan</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr
                key={o.id}
                className="border-b border-border/30 last:border-0 hover:bg-foreground/[0.02]"
              >
                <td className="px-4 py-3 font-mono text-xs">{o.orderNumber}</td>
                <td className="px-4 py-3">
                  <div className="font-medium">{o.customer.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {o.customer.email}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {o.plan ? (
                    <div>
                      <div className="font-medium">{o.plan.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {o.plan.category} · {o.plan.duration}
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground italic">
                      Plan removed
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 font-mono">
                  {formatPrice(o.amount)}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {new Date(o.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3">
                  <Select
                    value={o.status}
                    onValueChange={(v) => onStatusChange(o.id, v)}
                  >
                    <SelectTrigger
                      className={cn(
                        "h-8 w-44 text-xs border font-medium",
                        STATUS_TONES[o.status]
                      )}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden space-y-3">
        {filtered.map((o) => (
          <div key={o.id} className="glass-card rounded-xl p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-mono text-xs text-muted-foreground">
                  {o.orderNumber}
                </p>
                <p className="font-medium text-sm mt-0.5">{o.customer.name}</p>
                <p className="text-xs text-muted-foreground">
                  {o.customer.email}
                </p>
              </div>
              <span
                className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border",
                  STATUS_TONES[o.status]
                )}
              >
                {o.status.replace(/_/g, " ")}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs mb-3 pt-3 border-t border-border/30">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Plan
                </p>
                <p className="font-medium">
                  {o.plan?.name ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Amount
                </p>
                <p className="font-mono font-medium">
                  {formatPrice(o.amount)}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Date
                </p>
                <p className="text-muted-foreground">
                  {new Date(o.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <Select
              value={o.status}
              onValueChange={(v) => onStatusChange(o.id, v)}
            >
              <SelectTrigger
                className={cn(
                  "h-9 text-xs border font-medium",
                  STATUS_TONES[o.status]
                )}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </div>
  );
}
