"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { useNav } from "@/stores/nav-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const DISCORD_URL = process.env.NEXT_PUBLIC_DISCORD_URL || "https://discord.gg/R8dR4t4qWf";

const FOOTER_LINKS = [
  { label: "Home", target: "#home" as const },
  { label: "Minecraft Hosting", target: "#hosting" as const },
  { label: "Plans", target: "#plans" as const },
  { label: "Features", target: "#features" as const },
  { label: "FAQ", target: "#faq" as const },
  { label: "Contact", target: "#contact" as const },
];

const LEGAL_LINKS = [
  { label: "Terms", key: "terms" },
  { label: "Privacy Policy", key: "privacy" },
  { label: "Refund Policy", key: "refund" },
];

export function Footer() {
  const { goPublic } = useNav();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const onSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }
    setSubscribed(true);
    toast.success("Subscribed! Watch your inbox for updates.");
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="relative mt-auto border-t border-border/60 overflow-hidden">
      {/* Nether-inspired dark atmosphere */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 100% at 50% 100%, oklch(0.62 0.22 25 / 0.15), transparent 70%)",
        }}
      />
      <div className="absolute inset-0 bg-pixel-grid opacity-15 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1.5fr] gap-10">
          {/* Brand column */}
          <div>
            <BrandLogo size={36} />
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-sm">
              Premium Minecraft server hosting built on high-performance NVMe
              infrastructure, with DDoS protection and 24/7 monitoring — for
              players, communities and serious server owners.
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              Minecraft is a trademark of Mojang AB. Hades Cloud is an
              independent hosting provider and is not affiliated with Mojang AB
              or Microsoft.
            </p>
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 h-9 px-4 text-sm font-semibold rounded-lg bg-[#5865F2] text-white hover:bg-[#4752C4] transition-colors"
            >
              <MessageCircle className="size-4" />
              Join our Discord
            </a>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/80 mb-4">
              Navigation
            </p>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.map((l) => (
                <li key={l.target}>
                  <a
                    href={l.target}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(l.target);
                    }}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/80 mb-4">
              Legal
            </p>
            <ul className="space-y-2.5">
              {LEGAL_LINKS.map((l) => (
                <li key={l.key}>
                  <button
                    type="button"
                    onClick={() => goPublic()}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors text-left"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/80 mb-4">
              Stay in the loop
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Product updates, performance tips, and community spotlights. No spam.
            </p>
            <form onSubmit={onSubscribe} className="space-y-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                maxLength={254}
                className="bg-foreground/5 border-border h-10"
                disabled={subscribed}
              />
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-emerald h-10"
                disabled={subscribed}
              >
                {subscribed ? "✓ Subscribed" : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Hades Cloud. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built for builders.
          </p>
        </div>
      </div>
    </footer>
  );
}
