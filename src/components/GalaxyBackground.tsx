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
    };

    const STAR_DENSITY = 0.35; // stars per 1000 px^2 (slightly richer field)
    const initStars = () => {
      const areaK = (width * height) / 1000;
      const count = Math.max(300, Math.floor(areaK * STAR_DENSITY));
      stars = new Array(count).fill(0).map(() => {
        const depth = Math.random();
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.max(0.2, Math.pow(Math.random(), 2) * 1.0) * (0.5 + depth),
          baseAlpha: 0.35 + Math.random() * 0.5,
          phase: Math.random() * Math.PI * 2,
          twinkle: 0.001 + Math.random() * 0.003, // subtler twinkle
          depth,
          vx: (Math.random() - 0.5) * 0.004 * (0.3 + depth), // tinier movement
          vy: (Math.random() - 0.5) * 0.004 * (0.3 + depth),
        } as Star;
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
        { x: nx - 220 + offset * 0.6, y: ny - 120, r: Math.max(width, height) * 0.6, c: "rgba(0,150,255,0.06)" },
        { x: nx + 160 - offset * 0.4, y: ny + 40, r: Math.max(width, height) * 0.5, c: "rgba(30,120,255,0.07)" },
        { x: nx, y: ny - 40 + offset * 0.2, r: Math.max(width, height) * 0.7, c: "rgba(0,200,200,0.05)" },
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
      ctx.clearRect(0, 0, width, height);

      // Parallax factor (very subtle): background moves slower than content
      const p = lastScrollY;

      // Maybe spawn a shooting star
      maybeSpawn(t);

      // Draw stars (in layers by depth)
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.phase += s.twinkle;
        s.x += s.vx;
        s.y += s.vy;

        // wrap around
        if (s.x < -5) s.x = width + 5;
        if (s.x > width + 5) s.x = -5;
        if (s.y < -5) s.y = height + 5;
        if (s.y > height + 5) s.y = -5;

        const alpha = Math.max(0, Math.min(1, s.baseAlpha * (0.7 + 0.3 * Math.sin(s.phase))));
        const px = s.x + p * (0.02 * s.depth);
        const py = s.y + p * (0.015 * s.depth);
        // Subtle wobble so every star moves a tiny bit even without drift
        const wobbleX = Math.sin(s.phase * 0.6 + s.depth * 5) * 0.4;
        const wobbleY = Math.cos(s.phase * 0.6 + s.depth * 5) * 0.35;
        // Gentle size pulsation for a breathing effect
        const pulse = 0.92 + 0.08 * Math.sin(s.phase * 0.9);
        const r = Math.max(0.12, s.r * pulse);

        ctx.globalAlpha = alpha;
        ctx.fillStyle = "#cfe8ff";
        ctx.beginPath();
        ctx.arc(px + wobbleX, py + wobbleY, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Slight star glint pass for brighter ones
      ctx.globalAlpha = 0.3;
      ctx.strokeStyle = "rgba(180,210,255,0.35)";
      for (let i = 0; i < stars.length; i += 24) {
        const s = stars[i];
        const px = s.x + p * (0.02 * s.depth) + Math.sin(s.phase * 0.6 + s.depth * 5) * 0.4;
        const py = s.y + p * (0.015 * s.depth) + Math.cos(s.phase * 0.6 + s.depth * 5) * 0.35;
        ctx.beginPath();
        ctx.moveTo(px - s.r * 2, py);
        ctx.lineTo(px + s.r * 2, py);
        ctx.moveTo(px, py - s.r * 2);
        ctx.lineTo(px, py + s.r * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Draw/update shooting stars (above stars, below nebula)
      if (shooting.length) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        for (let i = shooting.length - 1; i >= 0; i--) {
          const m = shooting[i];
          m.x += m.vx;
          m.y += m.vy;
          m.life -= 1;

          // Fade out toward end of life with slightly higher visibility
          const lifeK = Math.max(0, Math.min(1, m.life / m.maxLife));
          const alpha = 0.35 + 0.65 * lifeK;

          // Parallax offset
          const px = m.x + p * 0.015;
          const py = m.y + p * 0.012;

          // Tail direction opposite velocity
          const angle = Math.atan2(m.vy, m.vx);
          const ex = px - Math.cos(angle) * m.length;
          const ey = py - Math.sin(angle) * m.length;

          // Tail gradient
          const grad = ctx.createLinearGradient(px, py, ex, ey);
          grad.addColorStop(0, `hsla(${m.hue}, 100%, 80%, ${alpha})`);
          grad.addColorStop(1, `hsla(${m.hue}, 100%, 80%, 0)`);

          ctx.lineWidth = m.width;
          ctx.strokeStyle = grad as unknown as string;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(ex, ey);
          ctx.stroke();

          // Bright head
          ctx.shadowBlur = 14;
          ctx.shadowColor = `hsla(${m.hue}, 100%, 75%, ${alpha})`;
          ctx.fillStyle = `hsla(${m.hue}, 100%, 87%, ${alpha})`;
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

      // Nebula glow
      nebula.t += nebula.speed;
      drawNebula();

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
      }`}
      aria-hidden
    >
      <canvas ref={canvasRef} className="w-full h-full block [transform:translateZ(0)]" />
    </div>
  );
}
