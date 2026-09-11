"use client";

import {
  Play,
  Square,
  RotateCw,
  Terminal,
  FolderTree,
  Archive,
  Settings2,
  Activity,
  Cpu,
  MemoryStick,
  HardDrive,
  Wifi,
  CircleDot,
} from "lucide-react";
import { Reveal } from "@/components/brand/reveal";
import { SectionEyebrow } from "@/components/public-site/why-hades-cloud";
import { LiveConsole } from "@/components/enhanced/live-console";
import { AnimatedStatBar } from "@/components/enhanced/animated-stat-bar";
import { cn } from "@/lib/utils";

/**
 * Pure visual mockup of the Hades Cloud control panel.
 * Labeled clearly as a concept — no claim that a real panel is integrated.
 */
export function ControlPanelSection() {
  return (
    <section
      id="panel"
      className="relative py-20 sm:py-28 overflow-hidden"
    >
      {/* Subtle purple glow for panel section */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% 100%, oklch(0.65 0.22 280 / 0.12), transparent 70%)",
        }}
      />
      <div className="absolute inset-0 bg-pixel-grid opacity-15 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <SectionEyebrow>Control Panel</SectionEyebrow>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mt-4 leading-tight">
            One panel.
            <br />
            <span className="text-gradient-hades">Total control.</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-base sm:text-lg leading-relaxed">
            Start, stop, restart, manage files and roll back to backups — all
            from a clean web console built for Minecraft server owners.
          </p>
        </Reveal>

        <Reveal className="mt-12" delay={100}>
          <PanelMockup />
        </Reveal>

        <Reveal className="mt-8 text-center" delay={150}>
          <p className="text-xs text-muted-foreground italic">
            Concept mockup — actual panel integration connects here when your
            server is provisioned.
          </p>
        </Reveal>

        {/* Capability strip */}
        <Reveal className="mt-16" delay={200}>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {CAPS.map((c) => (
              <div
                key={c.label}
                className="glass-card rounded-lg p-3 flex flex-col items-center gap-2 text-center hover-lift hover:border-primary/30 transition-colors"
              >
                <c.icon className="size-4 text-primary" />
                <span className="text-[11px] font-medium text-muted-foreground">
                  {c.label}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const CAPS = [
  { icon: Play, label: "Start" },
  { icon: Square, label: "Stop" },
  { icon: RotateCw, label: "Restart" },
  { icon: Terminal, label: "Console" },
  { icon: FolderTree, label: "Files" },
  { icon: Archive, label: "Backups" },
  { icon: Settings2, label: "Manage" },
] as const;

function PanelMockup() {
  return (
    <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl">
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/60 bg-foreground/5">
        <div className="flex gap-1.5">
          <span className="size-3 rounded-full bg-redstone/70" />
          <span className="size-3 rounded-full bg-amber/70" />
          <span className="size-3 rounded-full bg-primary/70" />
        </div>
        <div className="ml-3 text-xs text-muted-foreground font-mono">
          panel.hadescloud.local/server/HC-2026-AB12CD
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-[10px] text-primary">
          <CircleDot className="size-3 animate-pulse-glow" />
          ONLINE
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] min-h-[520px]">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col border-r border-border/60 bg-foreground/[0.02] p-4 gap-1">
          <PanelSidebarLink icon={Activity} label="Overview" active />
          <PanelSidebarLink icon={Terminal} label="Console" />
          <PanelSidebarLink icon={FolderTree} label="Files" />
          <PanelSidebarLink icon={Archive} label="Backups" />
          <PanelSidebarLink icon={Settings2} label="Settings" />
          <PanelSidebarLink icon={Wifi} label="Network" />

          <div className="mt-auto pt-4 border-t border-border/60">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
              Server
            </p>
            <div className="text-xs text-foreground/80 font-mono">
              mc.hadescloud.local
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5">
              25565 · Java 21
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="p-5 space-y-5">
          {/* Action bar */}
          <div className="flex flex-wrap items-center gap-2">
            <MockButton icon={Play} label="Start" tone="primary" />
            <MockButton icon={Square} label="Stop" tone="danger" />
            <MockButton icon={RotateCw} label="Restart" tone="default" />
            <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
              <CircleDot className="size-3 text-primary" />
              Running · 1h 24m
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <AnimatedStatBar
              icon={Cpu}
              label="CPU"
              value="23%"
              detail="Ryzen 9 · 6 vCPU"
              percent={23}
            />
            <AnimatedStatBar
              icon={MemoryStick}
              label="Memory"
              value="5.8 GB"
              detail="of 8 GB"
              percent={72}
              delay={100}
            />
            <AnimatedStatBar
              icon={HardDrive}
              label="Storage"
              value="142 GB"
              detail="of 180 GB"
              percent={78}
              delay={200}
            />
            <AnimatedStatBar
              icon={Wifi}
              label="Network"
              value="↑ 14 ↓ 89"
              detail="Mbps · 6 players"
              percent={32}
              delay={300}
            />
          </div>

          {/* Console preview — live typing */}
          <div className="glass-card rounded-lg overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-border/40 bg-foreground/[0.03]">
              <Terminal className="size-3.5 text-primary" />
              <span className="text-xs font-medium">Console</span>
              <span className="ml-auto text-[10px] text-muted-foreground flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                Live tail
              </span>
            </div>
            <LiveConsole />
          </div>
        </div>
      </div>
    </div>
  );
}

function PanelSidebarLink({
  icon: Icon,
  label,
  active,
}: {
  icon: typeof Activity;
  label: string;
  active?: boolean;
}) {
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
        active
          ? "bg-primary/10 text-primary border border-primary/30"
          : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
      )}
    >
      <Icon className="size-4" />
      {label}
    </a>
  );
}

function MockButton({
  icon: Icon,
  label,
  tone,
}: {
  icon: typeof Play;
  label: string;
  tone: "primary" | "danger" | "default";
}) {
  const cls =
    tone === "primary"
      ? "bg-primary/15 text-primary border-primary/30 hover:bg-primary/25"
      : tone === "danger"
      ? "bg-redstone/15 text-redstone border-redstone/30 hover:bg-redstone/25"
      : "bg-foreground/5 text-foreground border-border hover:bg-foreground/10";
  return (
    <button
      type="button"
      tabIndex={-1}
      className={cn(
        "inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-xs font-medium border transition-colors",
        cls
      )}
    >
      <Icon className="size-3.5" />
      {label}
    </button>
  );
}
