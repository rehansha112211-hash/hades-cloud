"use client";

/**
 * Minecraft-themed animated background — pure CSS, no JS hooks.
 * Shows floating Minecraft blocks + pixel particles + dark sky gradient.
 * Replaces the space video with a Minecraft world feel.
 *
 * CRASH-SAFE: No IntersectionObserver, no useState, no useEffect.
 * Just CSS keyframe animations on static elements.
 */

// Minecraft block images we have
const FLOATING_BLOCKS = [
  { src: "/images/minecraft/block-grass.png", style: { top: "8%", right: "6%", width: "90px", animationDelay: "0s", rotate: "12deg" } },
  { src: "/images/minecraft/block-grass.png", style: { top: "35%", left: "4%", width: "65px", animationDelay: "1.5s", rotate: "-15deg" } },
  { src: "/images/minecraft/diamond-ore.png", style: { bottom: "20%", right: "8%", width: "75px", animationDelay: "3s", rotate: "8deg" } },
  { src: "/images/minecraft/dirt-block.jpg", style: { top: "15%", left: "8%", width: "55px", animationDelay: "2s", rotate: "20deg" } },
  { src: "/images/minecraft/stone-block.jpg", style: { bottom: "30%", left: "6%", width: "60px", animationDelay: "4s", rotate: "-10deg" } },
  { src: "/images/minecraft/block-grass.png", style: { top: "55%", right: "3%", width: "50px", animationDelay: "5s", rotate: "5deg" } },
];

export function MinecraftBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Minecraft dark sky gradient */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, #0a0e1a 0%, #0d1117 40%, #0a0e1a 100%)",
      }} />

      {/* Subtle Minecraft-style aurora glow (emerald + blue) */}
      <div className="absolute inset-0">
        <div className="absolute -top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.50 0.15 150 / 0.4), transparent 70%)", animation: "drift-fog 20s ease-in-out infinite alternate" }} />
        <div className="absolute top-1/3 -right-1/4 w-[400px] h-[400px] rounded-full opacity-15 blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.55 0.15 240 / 0.3), transparent 70%)", animation: "drift-fog 25s ease-in-out infinite alternate-reverse" }} />
      </div>

      {/* Floating Minecraft blocks — CSS float animation */}
      {FLOATING_BLOCKS.map((block, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            ...block.style,
            animation: `float-block 6s ease-in-out infinite`,
            // @ts-expect-error CSS custom property
            "--rot": block.rotate,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={block.src}
            alt=""
            className="w-full h-auto object-contain pixelated"
            style={{ opacity: 0.25, filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.5))" }}
          />
        </div>
      ))}

      {/* Pixel particle dots — CSS twinkle */}
      {Array.from({ length: 30 }).map((_, i) => {
        const left = (i * 37 + 11) % 100;
        const top = (i * 53 + 7) % 100;
        const size = 2 + (i % 3);
        const delay = (i * 0.4) % 5;
        const isBlue = i % 4 === 0;
        return (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: left + "%",
              top: top + "%",
              width: size + "px",
              height: size + "px",
              background: isBlue ? "rgba(100, 180, 255, 0.6)" : "rgba(255, 255, 255, 0.4)",
              boxShadow: isBlue ? "0 0 4px rgba(100,180,255,0.5)" : "0 0 3px rgba(255,255,255,0.3)",
              animation: `pulse-glow 3s ease-in-out infinite`,
              animationDelay: delay + "s",
            }}
          />
        );
      })}

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 80% 70% at 50% 40%, oklch(0.05 0.01 250 / 0.5), oklch(0.07 0.015 250 / 0.85) 100%)",
      }} />
    </div>
  );
}
