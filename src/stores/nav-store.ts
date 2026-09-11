"use client";

import { create } from "zustand";

export type View =
  | { name: "public" }
  | { name: "order"; planId: string }
  | { name: "order-success"; orderNumber: string }
  | { name: "login" }
  | { name: "admin"; section: AdminSection };

export type AdminSection =
  | "dashboard"
  | "plans"
  | "categories"
  | "orders"
  | "customers"
  | "settings"
  | "servers"
  | "billing"
  | "invoices";

interface NavState {
  view: View;
  setView: (v: View) => void;
  goPublic: () => void;
  goOrder: (planId: string) => void;
  goOrderSuccess: (orderNumber: string) => void;
  goLogin: () => void;
  goAdmin: (section?: AdminSection) => void;
}

export const useNav = create<NavState>((set) => ({
  view: { name: "public" },
  setView: (v) => set({ view: v }),
  goPublic: () => {
    set({ view: { name: "public" } });
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", "/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  },
  goOrder: (planId) => {
    set({ view: { name: "order", planId } });
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", "/?view=order&plan=" + planId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  },
  goOrderSuccess: (orderNumber) => {
    set({ view: { name: "order-success", orderNumber } });
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", "/?view=order-success&on=" + orderNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  },
  goLogin: () => {
    set({ view: { name: "login" } });
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", "/?view=login");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  },
  goAdmin: (section = "dashboard") => {
    set({ view: { name: "admin", section } });
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `/admin?section=${section}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  },
}));

/**
 * On first client load, sync the store from the URL.
 */
export function initNavFromUrl() {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  const view = url.searchParams.get("view");
  const section = url.searchParams.get("section") as AdminSection | null;
  const path = url.pathname;

  if (path.startsWith("/admin") || view === "admin") {
    useNav.getState().goAdmin(section ?? "dashboard");
  } else if (view === "login") {
    useNav.getState().goLogin();
  } else if (view === "order") {
    const planId = url.searchParams.get("plan");
    if (planId) useNav.getState().goOrder(planId);
  } else if (view === "order-success") {
    const on = url.searchParams.get("on");
    if (on) useNav.getState().goOrderSuccess(on);
  }
}
