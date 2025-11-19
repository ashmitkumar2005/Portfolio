"use client";

import React, { useEffect, useRef, useState } from "react";

type Star = {
  x: number;
  y: number;
  r: number;
  baseAlpha: number;
  phase: number;
  twinkle: number;
  depth: number; // 0..1, for parallax factor
  vx: number;
  vy: number;
};

type ShootingStar = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; // frames left
  maxLife: number;
  length: number;
  width: number;
  hue: number; // for blue/cyan tone
};

type SnowFlake = {
  x: number;
  y: number;
  r: number;
  vy: number;
  drift: number;
  phase: number;
};

export default function GalaxyBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let animationId: number | null = null;
    let stars: Star[] = [];
    let shooting: ShootingStar[] = [];
    let snow: SnowFlake[] = []; // we will render only snow

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * DPR);
      canvas.height = Math.floor(height * DPR);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      // Rebuild stars to match density to area
      initStars();
      initSnow();
    };

    const STAR_DENSITY = 0; // disable stars
    const initStars = () => {
      stars = [];
    };

    const initSnow = () => {
      const count = Math.max(110, Math.floor((width * height) / 21000));
      snow = new Array(count).fill(0).map(() => {
        const r = 0.45 + Math.random() * 0.85;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          r,
          vy: 0.2 + Math.random() * 0.4,
          drift: (Math.random() - 0.5) * 0.15,
          phase: Math.random() * Math.PI * 2,
        } as SnowFlake;
      });
    };

    // Nebula parameters
    const nebula = {
      t: 0,
      speed: 0.0004,
    };

    let lastScrollY = window.scrollY || 0;
    const onScroll = () => {
      lastScrollY = window.scrollY || 0;
    };

    // Shooting star helpers
    const spawnShootingStar = () => {
      return; // disable shooting stars
      // Fixed direction for all stars (down-right ~30°), varied start positions along the left edge
      const margin = 100;
      const startX = -margin;
      const startY = Math.random() * height; // different positions

      const angle = 30 * (Math.PI / 180); // fixed direction
      const speed = 3 + Math.random() * 3; // slow and graceful
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const len = 150 + Math.random() * 220;
      const widthPx = 0.9 + Math.random() * 1.2;
      const life = 110 + Math.floor(Math.random() * 110); // shorter life to reduce concurrency
      const hue = 195 + Math.random() * 30; // blue to cyan
      shooting.push({ x: startX, y: startY, vx, vy, life, maxLife: life, length: len, width: widthPx, hue });
    };

    let lastSpawn = 0;
    const maybeSpawn = (t: number) => {
      // Reduced overall number: slower spawn and lower concurrent cap
      const now = t;
      const interval = 1400 + Math.random() * 1400; // ~1.4–2.8s
      if (now - lastSpawn > interval && shooting.length < 4) {
        spawnShootingStar();
        lastSpawn = now;
      }
    };

    const drawNebula = () => {
      return; // disable nebula
      // Soft overlapping radial gradients in blue/cyan tones with additive blending
      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      const baseX = width * 0.5;
      const baseY = height * 0.55;
      const offset = Math.sin(nebula.t) * 30; // slow subtle drift
      // Very slow scroll parallax for nebula
      const nx = baseX + lastScrollY * 0.01;
      const ny = baseY + lastScrollY * 0.008;

      const circles = [
        { x: nx - 220 + offset * 0.6, y: ny - 120, r: Math.max(width, height) * 0.6, c: "rgba(0,80,160,0.018)" },
        { x: nx + 160 - offset * 0.4, y: ny + 40, r: Math.max(width, height) * 0.5, c: "rgba(10,70,160,0.02)" },
        { x: nx, y: ny - 40 + offset * 0.2, r: Math.max(width, height) * 0.7, c: "rgba(0,110,140,0.016)" },
      ];

      for (const g of circles) {
        const grad = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, g.r);
        grad.addColorStop(0, g.c);
        grad.addColorStop(0.35, g.c);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    const update = (t: number) => {
      // Fill pitch-black background each frame
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, width, height);

      // Parallax factor (very subtle): background moves slower than content
      const p = lastScrollY;

      // Skip shooting stars and stars
      // maybeSpawn(t); // disabled

      // Stars disabled

      // Snow layer (above stars, below overlays)
      for (let i = 0; i < snow.length; i++) {
        const f = snow[i];
        f.phase += 0.01;
        f.y += f.vy;
        f.x += f.drift * Math.sin(f.phase);

        if (f.y - f.r > height) {
          f.y = -5 - Math.random() * 20;
          f.x = Math.random() * width;
        }
        if (f.x < -10) f.x = width + 10;
        if (f.x > width + 10) f.x = -10;

        const px = f.x + p * 0.01;
        const py = f.y + p * 0.008;

        ctx.globalAlpha = 0.22;
        ctx.fillStyle = "#e5f0ff";
        ctx.beginPath();
        ctx.arc(px, py, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Shooting stars disabled
      if (false) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        for (let i = shooting.length - 1; i >= 0; i--) {
          const m = shooting[i];
          m.x += m.vx;
          m.y += m.vy;
          m.life -= 1;

          // Fade out toward end of life with very low overall brightness for almost-black background
          const lifeK = Math.max(0, Math.min(1, m.life / m.maxLife));
          const alpha = 0.12 + 0.28 * lifeK;

          // Parallax offset
          const px = m.x + p * 0.015;
          const py = m.y + p * 0.012;

          // Tail direction opposite velocity
          const angle = Math.atan2(m.vy, m.vx);
          const ex = px - Math.cos(angle) * m.length;
          const ey = py - Math.sin(angle) * m.length;

          // Tail gradient
          const grad = ctx.createLinearGradient(px, py, ex, ey);
          grad.addColorStop(0, `hsla(${m.hue}, 90%, 62%, ${alpha})`);
          grad.addColorStop(1, `hsla(${m.hue}, 90%, 62%, 0)`);

          ctx.lineWidth = m.width;
          ctx.strokeStyle = grad as unknown as string;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(ex, ey);
          ctx.stroke();

          // Bright head (still very subdued for dark sky)
          ctx.shadowBlur = 8;
          ctx.shadowColor = `hsla(${m.hue}, 90%, 55%, ${alpha})`;
          ctx.fillStyle = `hsla(${m.hue}, 90%, 72%, ${alpha})`;
          ctx.beginPath();
          ctx.arc(px, py, 1.4 * m.width, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          // Remove if out of screen or life ended
          if (m.life <= 0 || px < -200 || px > width + 200 || py < -200 || py > height + 200) {
            shooting.splice(i, 1);
          }
        }
        ctx.restore();
      }

      // Nebula disabled

      animationId = requestAnimationFrame(update);
    };

    resize();
    setReady(true);
    animationId = requestAnimationFrame(update);

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      className={`pointer-events-none fixed inset-0 -z-10 transition-opacity duration-1000 ease-out ${
        ready ? "opacity-100" : "opacity-0"
      } bg-black`}
      aria-hidden
    >
      <canvas ref={canvasRef} className="w-full h-full block [transform:translateZ(0)]" />
    </div>
  );
}
