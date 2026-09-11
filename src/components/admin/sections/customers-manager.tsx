"use client";

import { useEffect, useState } from "react";
import { Loader2, Search, Users, Mail, Phone, ShoppingBag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { api, type AdminCustomer } from "@/lib/api/client";
import { formatPrice } from "@/lib/helpers";

export function CustomersManager() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      const res = await api.getCustomers();
      if (!alive) return;
      if (res.ok) setCustomers(res.data.customers);
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const filtered = customers.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="glass-card rounded-xl p-10 text-center">
        <div className="size-12 rounded-lg bg-foreground/5 mx-auto mb-3 flex items-center justify-center">
          <Users className="size-5 text-muted-foreground" />
        </div>
        <h3 className="font-display font-bold text-base mb-1">
          No customers yet
        </h3>
        <p className="text-sm text-muted-foreground">
          When customers place orders, they'll appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="pl-9 bg-foreground/5 border-border"
          />
        </div>
        <span className="text-xs text-muted-foreground">
          {customers.length} customers
        </span>
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block glass-card rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-foreground/[0.03] border-b border-border/40">
            <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Orders</th>
              <th className="px-4 py-3 font-medium">Last order</th>
              <th className="px-4 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr
                key={c.id}
                className="border-b border-border/30 last:border-0 hover:bg-foreground/[0.02]"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 border border-border flex items-center justify-center text-xs font-bold">
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{c.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {c.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {c.phone || <span className="italic">No phone</span>}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 text-xs">
                    <ShoppingBag className="size-3.5 text-primary" />
                    {c.orderCount} order{c.orderCount === 1 ? "" : "s"}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs">
                  {c.lastOrder ? (
                    <div>
                      <div className="font-mono text-foreground">
                        {c.lastOrder.orderNumber}
                      </div>
                      <div className="text-muted-foreground">
                        {formatPrice(c.lastOrder.amount)} ·{" "}
                        {c.lastOrder.status.replace(/_/g, " ")}
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground italic">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {new Date(c.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden space-y-3">
        {filtered.map((c) => (
          <div key={c.id} className="glass-card rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="size-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 border border-border flex items-center justify-center text-sm font-bold shrink-0">
                {c.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-sm">{c.name}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Mail className="size-3" /> {c.email}
                </div>
                {c.phone && (
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Phone className="size-3" /> {c.phone}
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-border/30 text-xs">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Orders
                </p>
                <p className="font-medium">{c.orderCount}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Joined
                </p>
                <p>
                  {new Date(c.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
