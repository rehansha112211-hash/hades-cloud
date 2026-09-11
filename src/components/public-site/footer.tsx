"use client";

import { BrandLogo } from "@/components/brand/brand-logo";
import { useNav } from "@/stores/nav-store";

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

  const scrollTo = (href: string) => {
    document
      .querySelector(href)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <footer className="relative mt-auto border-t border-border/60 overflow-hidden">
      {/* Nether-inspired dark atmosphere — real Minecraft Nether image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/minecraft/nether-bg.jpg"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-15"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/85 to-background" />
      </div>
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 100% at 50% 100%, oklch(0.62 0.22 25 / 0.18), transparent 70%)",
        }}
      />
      <div className="absolute inset-0 bg-pixel-grid opacity-15 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-10">
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
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
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
