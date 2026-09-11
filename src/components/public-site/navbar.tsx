"use client";

import { useEffect, useState } from "react";
import { Menu, X, LogIn, Zap } from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNav } from "@/stores/nav-store";

const LINKS = [
  { label: "Home", href: "#home" },
  { label: "Minecraft Hosting", href: "#hosting" },
  { label: "Plans", href: "#plans" },
  { label: "Features", href: "#features" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { goLogin } = useNav();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onLink = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className={cn("fixed top-0.5 left-0 right-0 z-50 transition-all duration-300", scrolled ? "bg-background/70 backdrop-blur-xl border-b border-border/60" : "bg-transparent")}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16 lg:h-18" aria-label="Primary">
          <a href="#home" onClick={(e) => { e.preventDefault(); onLink("#home"); }} aria-label="Hades Cloud home" className="transition-transform hover:scale-105">
            <BrandLogo size={34} />
          </a>
          <ul className="hidden lg:flex items-center gap-1">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={(e) => { e.preventDefault(); onLink(l.href); }} className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-foreground/5">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="hidden lg:flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={goLogin} className="text-muted-foreground hover:text-foreground">
              <LogIn className="size-4" /> Login
            </Button>
            <Button size="sm" onClick={() => onLink("#plans")} className="bg-primary text-primary-foreground hover:bg-primary/90 glow-emerald group">
              <Zap className="size-4 transition-transform group-hover:scale-110" /> Get Started
            </Button>
          </div>
          <button type="button" onClick={() => setOpen((o) => !o)} className="lg:hidden p-2 rounded-md hover:bg-foreground/5" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </nav>
      </div>
      {open && (
        <div className="lg:hidden border-t border-border/60 bg-background/95 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 py-4 space-y-1">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={(e) => { e.preventDefault(); onLink(l.href); }} className="block px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5">
                {l.label}
              </a>
            ))}
            <div className="pt-3 grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => { setOpen(false); goLogin(); }}>
                <LogIn className="size-4" /> Login
              </Button>
              <Button size="sm" onClick={() => { setOpen(false); onLink("#plans"); }} className="bg-primary text-primary-foreground glow-emerald">
                <Zap className="size-4" /> Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
