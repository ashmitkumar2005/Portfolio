"use client";

import React, { useEffect, useRef, useState } from "react";

// type Star = {
//   x: number;
//   y: number;
//   r: number;
//   baseAlpha: number;
//   phase: number;
//   twinkle: number;
//   depth: number; // 0..1, for parallax factor
//   vx: number;
//   vy: number;
// };

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
    const ctx = canvas.getContext("2d", { alpha: true }) as CanvasRenderingContext2D;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let animationId: number | null = null;
    // let stars: Star[] = [];
    const shooting: ShootingStar[] = [];
    let snow: SnowFlake[] = []; // we will render only snow

    // Cursor position for interactive snow (in canvas coordinates)
    // let mouseX: number | null = null;
    // let mouseY: number | null = null;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * DPR);
      canvas.height = Math.floor(height * DPR);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      // Rebuild stars and snow to match density to area
      initStars();
      initSnow();
    };

    const handleMouseMove = () => {
      if (window.matchMedia("(hover: none)").matches) return;
      // const rect = canvas.getBoundingClientRect();
      // mouseX = event.clientX - rect.left;
      // mouseY = event.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      // mouseX = null;
      // mouseY = null;
    };

    // const STAR_DENSITY = 0; // disable stars
    const initStars = () => {
      // stars = [];
    };

    const initSnow = () => {
      // Reduced density for performance
      const count = Math.max(50, Math.floor((width * height) / 35000));
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
    // const nebula = {
    //   t: 0,
    //   speed: 0.0004,
    // };

    let lastScrollY = window.scrollY || 0;
    const onScroll = () => {
      lastScrollY = window.scrollY || 0;
    };

    // Shooting star helpers
    // const spawnShootingStar = () => {
    //   // disabled
    //   return;
    // };

    // const lastSpawn = 0;
    // const maybeSpawn = (_t: number) => {
    //   // disabled
    //   return;
    // };

    // const drawNebula = () => {
    //   // disabled
    // };

    const update = () => {
      // Clear previous frame (keep full transparency so underlying background shows)
      ctx.clearRect(0, 0, width, height);

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
          // Respawn flake at the top when it leaves the screen
          f.y = -5 - Math.random() * 20;
          f.x = Math.random() * width;
        }
        if (f.x < -10) f.x = width + 10;
        if (f.x > width + 10) f.x = -10;

        const px = f.x + p * 0.01;
        const py = f.y + p * 0.008;

        // Base snow look
        const alpha = 0.38; // make flakes more visible
        const radius = f.r * 1.15; // slightly larger base size

        // Simplified rendering: removed per-particle mouse distance check for performance
        // If cursor is present, we could do a simpler global effect or just skip it to save cycles

        ctx.globalAlpha = alpha;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
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
    setTimeout(() => setReady(true), 0);
    animationId = requestAnimationFrame(update);

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      className={`pointer-events-none fixed inset-0 -z-5 transition-opacity duration-1000 ease-out ${ready ? "opacity-100" : "opacity-0"
        }`}
      aria-hidden
    >
      <canvas ref={canvasRef} className="w-full h-full block [transform:translateZ(0)]" />
    </div>
  );
}
