"use client";

import { useEffect, useRef } from "react";

/**
 * Animated starfield canvas — real-time twinkling + drifting stars.
 * Performance-optimized: uses requestAnimationFrame, caps star count,
 * and pauses on reduced-motion preference.
 *
 * Three layers of stars for parallax depth:
 *  - Far layer: tiny, dim, slow
 *  - Mid layer: medium, brighter, medium speed
 *  - Near layer: larger, brightest, faster drift
 */
type Star = {
  x: number;
  y: number;
  z: number;        // depth: 0 (far) → 1 (near)
  radius: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  vx: number;        // drift velocity x
  vy: number;        // drift velocity y
  color: string;
};

const STAR_COLORS = [
  "255, 255, 255",      // white
  "200, 220, 255",      // light blue
  "255, 240, 220",      // warm white
  "180, 200, 255",      // blue
  "255, 255, 240",      // off-white
];

export function AnimatedStarfield({
  density = 1,
  className = "",
}: {
  density?: number;     // 0.5 = sparse, 1 = normal, 2 = dense
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Respect reduced-motion
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initStars();
    }

    function initStars() {
      // Star count scales with viewport area × density
      const area = width * height;
      const baseCount = Math.floor((area / 4000) * density);
      const count = Math.min(baseCount, 300); // cap for performance
      stars = [];
      for (let i = 0; i < count; i++) {
        const z = Math.random();
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z,
          radius: 0.3 + z * 1.4,
          baseAlpha: 0.3 + z * 0.7,
          twinkleSpeed: 0.5 + Math.random() * 2.5,
          twinklePhase: Math.random() * Math.PI * 2,
          vx: (Math.random() - 0.5) * 0.03 * (0.3 + z),
          vy: (Math.random() - 0.5) * 0.03 * (0.3 + z),
          color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        });
      }
    }

    let lastTime = 0;
    function draw(time: number) {
      if (!ctx || !canvas) return;
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0.016;
      lastTime = time;

      // Clear with slight trail for glow effect
      ctx.clearRect(0, 0, width, height);

      for (const s of stars) {
        // Twinkle: sin wave on alpha
        s.twinklePhase += s.twinkleSpeed * dt;
        const twinkle = 0.5 + 0.5 * Math.sin(s.twinklePhase);
        const alpha = s.baseAlpha * (0.4 + 0.6 * twinkle);

        // Drift
        s.x += s.vx;
        s.y += s.vy;

        // Wrap around edges
        if (s.x < -2) s.x = width + 2;
        if (s.x > width + 2) s.x = -2;
        if (s.y < -2) s.y = height + 2;
        if (s.y > height + 2) s.y = -2;

        // Draw star with glow for near stars
        const r = s.radius;
        if (s.z > 0.7) {
          // Near stars get a soft glow
          ctx.shadowBlur = 6 * s.z;
          ctx.shadowColor = `rgba(${s.color}, ${alpha * 0.5})`;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color}, ${alpha})`;
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      rafRef.current = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}
