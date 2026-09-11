"use client";

import { useEffect, useRef } from "react";

/**
 * Cinematic animated starfield — pure canvas, no images.
 * Fixed full-screen background with twinkling stars, shooting stars, nebula.
 * Performance: capped star count, rAF, DPR-aware, reduced-motion safe.
 * CRASH-FIX: guards against zero-dimension canvas, cleans up properly.
 */
type Star = {
  x: number; y: number; z: number;
  radius: number; baseAlpha: number;
  twinkleSpeed: number; twinklePhase: number;
  vx: number; vy: number;
  color: string;
};

type ShootingStar = {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  length: number;
};

type Nebula = {
  x: number; y: number;
  radius: number;
  color: string;
  alpha: number;
  vx: number; vy: number;
};

const STAR_COLORS = [
  "255, 255, 255",
  "200, 220, 255",
  "255, 240, 220",
  "180, 200, 255",
  "220, 230, 255",
];

const NEBULA_COLORS = [
  "60, 80, 180",
  "100, 60, 160",
  "40, 100, 180",
];

export function AnimatedStarfield({
  density = 1,
  className = "",
}: {
  density?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Respect reduced-motion — don't render at all
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let width = 0;
    let height = 0;
    let dpr = 1;
    let stars: Star[] = [];
    let shootingStars: ShootingStar[] = [];
    let nebulae: Nebula[] = [];
    let lastShootingStarTime = 0;
    let lastTime = 0;

    function initStars() {
      if (width <= 0 || height <= 0) return;
      const area = width * height;
      const count = Math.min(Math.floor((area / 3500) * density), 350);
      stars = [];
      for (let i = 0; i < count; i++) {
        const z = Math.random();
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z,
          radius: 0.3 + z * 1.6,
          baseAlpha: 0.25 + z * 0.75,
          twinkleSpeed: 0.4 + Math.random() * 2.8,
          twinklePhase: Math.random() * Math.PI * 2,
          vx: (Math.random() - 0.5) * 0.04 * (0.3 + z),
          vy: (Math.random() - 0.5) * 0.04 * (0.3 + z),
          color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        });
      }
    }

    function initNebulae() {
      if (width <= 0 || height <= 0) return;
      nebulae = [];
      for (let i = 0; i < 3; i++) {
        nebulae.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 200 + Math.random() * 300,
          color: NEBULA_COLORS[i % NEBULA_COLORS.length],
          alpha: 0.04 + Math.random() * 0.04,
          vx: (Math.random() - 0.5) * 0.08,
          vy: (Math.random() - 0.5) * 0.05,
        });
      }
    }

    function resize() {
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      // Guard against zero dimensions (happens during scroll/resize)
      if (rect.width <= 0 || rect.height <= 0) return;
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initStars();
      initNebulae();
    }

    function spawnShootingStar() {
      if (width <= 0 || height <= 0) return;
      const startX = Math.random() * width * 0.6;
      const startY = Math.random() * height * 0.4;
      const angle = Math.PI * 0.25 + (Math.random() - 0.5) * 0.3;
      const speed = 8 + Math.random() * 6;
      shootingStars.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 0.8 + Math.random() * 0.6,
        length: 80 + Math.random() * 60,
      });
    }

    function draw(time: number) {
      if (!ctx || !mountedRef.current) return;
      // Guard: if canvas has zero dimensions, skip this frame
      if (width <= 0 || height <= 0) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0.016;
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // Draw nebulae
      for (const n of nebulae) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -n.radius) n.x = width + n.radius;
        if (n.x > width + n.radius) n.x = -n.radius;
        if (n.y < -n.radius) n.y = height + n.radius;
        if (n.y > height + n.radius) n.y = -n.radius;

        const r = Math.max(1, n.radius);
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r);
        grad.addColorStop(0, `rgba(${n.color}, ${n.alpha})`);
        grad.addColorStop(1, `rgba(${n.color}, 0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(n.x - r, n.y - r, r * 2, r * 2);
      }

      // Draw stars
      for (const s of stars) {
        s.twinklePhase += s.twinkleSpeed * dt;
        const twinkle = 0.5 + 0.5 * Math.sin(s.twinklePhase);
        const alpha = s.baseAlpha * (0.3 + 0.7 * twinkle);

        s.x += s.vx;
        s.y += s.vy;
        if (s.x < -2) s.x = width + 2;
        if (s.x > width + 2) s.x = -2;
        if (s.y < -2) s.y = height + 2;
        if (s.y > height + 2) s.y = -2;

        if (s.z > 0.65) {
          ctx.shadowBlur = 8 * s.z;
          ctx.shadowColor = `rgba(${s.color}, ${alpha * 0.6})`;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, Math.max(0.1, s.radius), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color}, ${alpha})`;
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // Spawn shooting stars
      if (time - lastShootingStarTime > 3000 + Math.random() * 4000) {
        spawnShootingStar();
        lastShootingStarTime = time;
      }

      // Draw shooting stars
      shootingStars = shootingStars.filter(ss => {
        ss.life += dt;
        ss.x += ss.vx;
        ss.y += ss.vy;
        const lifeRatio = ss.life / ss.maxLife;
        if (lifeRatio >= 1) return false;

        const alpha = lifeRatio < 0.2 ? lifeRatio / 0.2 : (1 - lifeRatio);
        const speed = Math.hypot(ss.vx, ss.vy);
        if (speed <= 0) return false;

        const trailX = ss.x - ss.vx * (ss.length / speed);
        const trailY = ss.y - ss.vy * (ss.length / speed);
        const grad = ctx.createLinearGradient(ss.x, ss.y, trailX, trailY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
        grad.addColorStop(0.4, `rgba(200, 220, 255, ${alpha * 0.5})`);
        grad.addColorStop(1, `rgba(180, 200, 255, 0)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(trailX, trailY);
        ctx.stroke();

        ctx.shadowBlur = 12;
        ctx.shadowColor = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
        ctx.shadowBlur = 0;

        return true;
      });

      rafRef.current = requestAnimationFrame(draw);
    }

    // Debounced resize to avoid rapid re-inits during scroll
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    function debouncedResize() {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 100);
    }

    resize();
    window.addEventListener("resize", debouncedResize);
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      mountedRef.current = false;
      window.removeEventListener("resize", debouncedResize);
      if (resizeTimeout) clearTimeout(resizeTimeout);
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
