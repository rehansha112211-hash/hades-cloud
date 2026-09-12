"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { Menu, X, LogIn, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { MinecraftBackground } from "@/components/shared/minecraft-background";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "Panel", href: "/panel" },
  { label: "Budget Plans", href: "/plans/budget" },
  { label: "Performance Plans", href: "/plans/performance" },
  { label: "Bot Hosting", href: "/plans/bot-hosting" },
  { label: "FAQ", href: "/faq" },
];

export function SiteLayout({ children, activePage }: { children: ReactNode; activePage?: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Minecraft animated background — floating blocks + particles */}
      <MinecraftBackground />

      <div className="relative z-10 flex flex-col flex-1">
        <header className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300", scrolled ? "bg-background/70 backdrop-blur-xl border-b border-border/60" : "bg-transparent")}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center justify-between h-16 lg:h-18">
              <Link href="/" className="transition-transform hover:scale-105"><BrandLogo size={34} /></Link>
              <ul className="hidden lg:flex items-center gap-1">
                {NAV_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={cn("px-3 py-2 text-sm font-medium transition-colors rounded-md", activePage === l.href ? "text-primary" : "text-muted-foreground hover:text-foreground hover:bg-foreground/5")}>{l.label}</Link>
                  </li>
                ))}
              </ul>
              <div className="hidden lg:flex items-center gap-2">
                <Link href="/?view=login"><Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground"><LogIn className="size-4" /> Login</Button></Link>
                <Link href="/plans"><Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-emerald"><Zap className="size-4" /> Get Started</Button></Link>
              </div>
              <button type="button" onClick={() => setOpen((o) => !o)} className="lg:hidden p-2 rounded-md hover:bg-foreground/5" aria-label="Menu">{open ? <X className="size-5" /> : <Menu className="size-5" />}</button>
            </nav>
          </div>
          {open && (
            <div className="lg:hidden border-t border-border/60 bg-background/95 backdrop-blur-xl">
              <div className="mx-auto max-w-7xl px-4 py-4 space-y-1">
                {NAV_LINKS.map((l) => (<Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5">{l.label}</Link>))}
                <div className="pt-3 grid grid-cols-2 gap-2">
                  <Link href="/?view=login" onClick={() => setOpen(false)}><Button variant="outline" size="sm" className="w-full"><LogIn className="size-4" /> Login</Button></Link>
                  <Link href="/plans" onClick={() => setOpen(false)}><Button size="sm" className="w-full bg-primary text-primary-foreground glow-emerald"><Zap className="size-4" /> Get Started</Button></Link>
                </div>
              </div>
            </div>
          )}
        </header>
        <main className="flex-1 pt-16">{children}</main>
        <SiteFooter />
      </div>
    </div>
  );
}

function SiteFooter() {
  const DISCORD_URL = process.env.NEXT_PUBLIC_DISCORD_URL || "https://discord.gg/R8dR4t4qWf";
  return (
    <footer className="relative mt-auto border-t border-border/60 overflow-hidden">
      <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 100% at 50% 100%, oklch(0.62 0.22 25 / 0.15), transparent 70%)" }} />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1.5fr] gap-10">
          <div>
            <BrandLogo size={36} />
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-sm">Premium Minecraft server hosting built on high-performance NVMe infrastructure, with DDoS protection and 24/7 monitoring.</p>
            <p className="mt-4 text-xs text-muted-foreground">Minecraft is a trademark of Mojang AB. Hades Cloud is not affiliated with Mojang AB or Microsoft.</p>
            <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 h-9 px-4 text-sm font-semibold rounded-lg bg-[#5865F2] text-white hover:bg-[#4752C4] transition-colors">Join our Discord</a>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/80 mb-4">Plans</p>
            <ul className="space-y-2.5">
              <li><Link href="/plans/budget" className="text-sm text-muted-foreground hover:text-primary transition-colors">Budget Plans</Link></li>
              <li><Link href="/plans/performance" className="text-sm text-muted-foreground hover:text-primary transition-colors">Performance Plans</Link></li>
              <li><Link href="/plans/bot-hosting" className="text-sm text-muted-foreground hover:text-primary transition-colors">Bot Hosting</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/80 mb-4">Pages</p>
            <ul className="space-y-2.5">
              <li><Link href="/features" className="text-sm text-muted-foreground hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="/panel" className="text-sm text-muted-foreground hover:text-primary transition-colors">Panel</Link></li>
              <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/80 mb-4">Stay in the loop</p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">Product updates and community spotlights.</p>
            <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 h-10 px-5 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 glow-emerald transition-colors">Join Discord</a>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Hades Cloud. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Built for builders.</p>
        </div>
      </div>
    </footer>
  );
}
