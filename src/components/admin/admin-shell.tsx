"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Server,
  Receipt,
  CreditCard,
  ChevronRight,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNav, type AdminSection } from "@/stores/nav-store";
import { api } from "@/lib/api/client";
import { toast } from "sonner";

import { AdminDashboard } from "@/components/admin/sections/dashboard";
import { PlansManager } from "@/components/admin/sections/plans-manager";
import { CategoriesManager } from "@/components/admin/sections/categories-manager";
import { OrdersManager } from "@/components/admin/sections/orders-manager";
import { CustomersManager } from "@/components/admin/sections/customers-manager";
import { SettingsManager } from "@/components/admin/sections/settings-manager";
import { LegalManager } from "@/components/admin/sections/legal-manager";
import { ComingSoon } from "@/components/admin/sections/coming-soon";

const NAV: Array<{
  id: AdminSection;
  label: string;
  icon: typeof Package;
  group: "main" | "future";
}> = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, group: "main" },
  { id: "plans", label: "Plans", icon: Package, group: "main" },
  { id: "categories", label: "Categories", icon: Tags, group: "main" },
  { id: "orders", label: "Orders", icon: ShoppingCart, group: "main" },
  { id: "customers", label: "Customers", icon: Users, group: "main" },
  { id: "settings", label: "Settings", icon: Settings, group: "main" },
  { id: "legal", label: "Legal Pages", icon: FileText, group: "main" },
  { id: "servers", label: "Servers", icon: Server, group: "future" },
  { id: "billing", label: "Billing", icon: CreditCard, group: "future" },
  { id: "invoices", label: "Invoices", icon: Receipt, group: "future" },
];

const SECTION_TITLES: Record<AdminSection, { title: string; subtitle: string }> = {
  dashboard: { title: "Dashboard", subtitle: "Overview of your hosting operation" },
  plans: { title: "Plans", subtitle: "Create, edit, hide and delete hosting plans" },
  categories: { title: "Categories", subtitle: "Organize plans into custom categories" },
  orders: { title: "Orders", subtitle: "All customer orders and their status" },
  customers: { title: "Customers", subtitle: "Customer accounts and order history" },
  settings: { title: "Settings", subtitle: "Public site settings and integration status" },
  legal: { title: "Legal Pages", subtitle: "Edit Terms, Privacy Policy, and Refund Policy" },
  servers: { title: "Servers", subtitle: "Minecraft server provisioning" },
  billing: { title: "Billing", subtitle: "Payment gateway and billing rules" },
  invoices: { title: "Invoices", subtitle: "Generated invoices and tax records" },
};

export function AdminShell() {
  const { view, goAdmin, goLogin, goPublic } = useNav();
  const [authChecked, setAuthChecked] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const section =
    view.name === "admin" ? view.section : ("dashboard" as AdminSection);

  // Auth guard — call our session endpoint, redirect to login if not authed
  useEffect(() => {
    let alive = true;
    (async () => {
      const res = await api.checkSession();
      if (!alive) return;
      if (res.ok && res.data.authenticated) {
        setAuthed(true);
      } else {
        goLogin();
      }
      setAuthChecked(true);
    })();
    return () => {
      alive = false;
    };
  }, [goLogin]);

  const onLogout = async () => {
    await signOut({ redirect: false });
    toast.success("Signed out");
    goPublic();
  };

  const onNav = (s: AdminSection) => {
    goAdmin(s);
    setDrawerOpen(false);
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="size-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }

  if (!authed) return null; // redirecting to login

  const header = SECTION_TITLES[section];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border/60 bg-sidebar/50 backdrop-blur-xl sticky top-0 h-screen">
        <SidebarContent
          section={section}
          onNav={onNav}
          onLogout={onLogout}
        />
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-sidebar/95 backdrop-blur-xl border-r border-border/60 flex flex-col animate-fade-in-up">
            <div className="flex items-center justify-between p-4 border-b border-border/40">
              <BrandLogo size={32} />
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 rounded-md hover:bg-foreground/5"
                aria-label="Close menu"
              >
                <X className="size-5" />
              </button>
            </div>
            <SidebarContent
              section={section}
              onNav={onNav}
              onLogout={onLogout}
              embedded
            />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 h-16 px-4 sm:px-6 border-b border-border/60 bg-background/70 backdrop-blur-xl">
          <button
            onClick={() => setDrawerOpen(true)}
            className="lg:hidden p-2 rounded-md hover:bg-foreground/5"
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
          <div className="lg:hidden">
            <BrandLogo size={28} />
          </div>
          <div className="hidden lg:block">
            <h1 className="font-display font-bold text-lg leading-tight">
              {header.title}
            </h1>
            <p className="text-xs text-muted-foreground">{header.subtitle}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={goPublic}
              className="text-muted-foreground hover:text-foreground"
            >
              View site
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="border-border bg-foreground/5"
            >
              <LogOut className="size-4" />
              Logout
            </Button>
          </div>
        </header>

        {/* Mobile page title */}
        <div className="lg:hidden px-4 pt-4">
          <h1 className="font-display font-bold text-xl leading-tight">
            {header.title}
          </h1>
          <p className="text-xs text-muted-foreground">{header.subtitle}</p>
        </div>

        {/* Section content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {section === "dashboard" && <AdminDashboard />}
          {section === "plans" && <PlansManager />}
          {section === "categories" && <CategoriesManager />}
          {section === "orders" && <OrdersManager />}
          {section === "customers" && <CustomersManager />}
          {section === "settings" && <SettingsManager />}
          {section === "legal" && <LegalManager />}
          {section === "servers" && (
            <ComingSoon
              icon={Server}
              title="Server Provisioning"
              description="Minecraft server provisioning integration (Pterodactyl / Wings) will be wired up here. Orders will be able to spawn real, isolated game servers once this is live."
            />
          )}
          {section === "billing" && (
            <ComingSoon
              icon={CreditCard}
              title="Billing"
              description="Payment gateway integration (Razorpay / Stripe) lives here. Once credentials are set in environment variables, orders will move from PENDING_PAYMENT to PAID automatically on webhook."
            />
          )}
          {section === "invoices" && (
            <ComingSoon
              icon={Receipt}
              title="Invoices"
              description="Generated tax invoices for paid orders. Will be created automatically once billing is wired up."
            />
          )}
        </main>
      </div>
    </div>
  );
}

function SidebarContent({
  section,
  onNav,
  onLogout,
  embedded,
}: {
  section: AdminSection;
  onNav: (s: AdminSection) => void;
  onLogout: () => void;
  embedded?: boolean;
}) {
  const main = NAV.filter((n) => n.group === "main");
  const future = NAV.filter((n) => n.group === "future");

  return (
    <>
      {!embedded && (
        <div className="p-5 border-b border-border/40">
          <BrandLogo size={32} />
        </div>
      )}

      <nav className="flex-1 overflow-y-auto p-3 space-y-6">
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground/70">
            Manage
          </p>
          {main.map((item) => (
            <SidebarLink
              key={item.id}
              active={section === item.id}
              onClick={() => onNav(item.id)}
              icon={item.icon}
              label={item.label}
            />
          ))}
        </div>

        <div className="space-y-1">
          <p className="px-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground/70">
            Coming soon
          </p>
          {future.map((item) => (
            <SidebarLink
              key={item.id}
              active={section === item.id}
              onClick={() => onNav(item.id)}
              icon={item.icon}
              label={item.label}
              future
            />
          ))}
        </div>
      </nav>

      <div className="p-3 border-t border-border/40">
        <div className="mb-3 px-3 py-2 rounded-md bg-foreground/[0.03] border border-border/40 flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5 text-primary" />
          <span>Server-side protected</span>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-redstone hover:bg-redstone/5 transition-colors"
        >
          <LogOut className="size-4" />
          Sign out
        </button>
      </div>
    </>
  );
}

function SidebarLink({
  active,
  onClick,
  icon: Icon,
  label,
  future,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Package;
  label: string;
  future?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-all relative group",
        active
          ? "bg-primary/10 text-primary border border-primary/30"
          : "text-muted-foreground hover:text-foreground hover:bg-foreground/5 border border-transparent"
      )}
    >
      <Icon className="size-4 shrink-0" />
      <span className="flex-1 text-left">{label}</span>
      {future && (
        <span className="text-[9px] uppercase tracking-wider text-muted-foreground/60 px-1.5 py-0.5 rounded bg-foreground/5">
          Soon
        </span>
      )}
      {active && (
        <ChevronRight className="size-3.5 text-primary" />
      )}
    </button>
  );
}
