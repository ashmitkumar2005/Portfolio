"use client";

import React, { useEffect, useRef } from "react";

export default function BackgroundParallax() {
  const topGlowRef = useRef<HTMLDivElement>(null);
  const centerHaloRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const blueBandRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY || window.pageYOffset || 0;

          // 10% of previous factors for very slow background motion
          if (topGlowRef.current) topGlowRef.current.style.transform = `translateY(${y * 0.01}px)`;
          if (centerHaloRef.current) centerHaloRef.current.style.transform = `translateY(${y * 0.015}px)`;
          if (starsRef.current) starsRef.current.style.transform = `translateY(${y * 0.02}px)`;
          if (blueBandRef.current) blueBandRef.current.style.transform = `translateY(${y * 0.025}px)`;

          ticking = false;
        });
        ticking = true;
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Base deepened gradient for higher contrast (fixed) */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#05070f] via-[#060815] to-[#000105]" aria-hidden />

      {/* Soft top glow (parallax) – neutralized to avoid blue behind navbar */}
      <div
        ref={topGlowRef}
        className="pointer-events-none absolute inset-x-0 top-[-10%] h-[60vh] -z-10 blur-2xl transform-gpu will-change-transform"
        aria-hidden
      />

      {/* Center halo behind hero (parallax) */}
      <div
        ref={centerHaloRef}
        className="pointer-events-none absolute left-0 right-0 top-0 h-[150vh] -z-10 transform-gpu will-change-transform [background:radial-gradient(700px_380px_at_50%_35%,rgba(56,189,248,0.15),rgba(59,130,246,0.08)_40%,transparent_70%)]"
        aria-hidden
      />

      {/* Starfield (parallax) */}
      <div
        ref={starsRef}
        className="pointer-events-none absolute left-0 right-0 top-0 h-[200vh] -z-10 opacity-35 transform-gpu will-change-transform"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.7) 50%, transparent 51%)," +
            "radial-gradient(1.5px 1.5px at 30% 70%, rgba(255,255,255,0.6) 50%, transparent 51%)," +
            "radial-gradient(1px 1px at 60% 40%, rgba(255,255,255,0.5) 50%, transparent 51%)," +
            "radial-gradient(1.2px 1.2px at 80% 25%, rgba(255,255,255,0.65) 50%, transparent 51%)," +
            "radial-gradient(1px 1px at 20% 85%, rgba(255,255,255,0.55) 50%, transparent 51%)," +
            "radial-gradient(1px 1px at 75% 75%, rgba(255,255,255,0.5) 50%, transparent 51%)," +
            "radial-gradient(1px 1px at 45% 55%, rgba(255,255,255,0.6) 50%, transparent 51%)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "auto",
        }}
      />

      {/* Vignette (fixed) */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        aria-hidden
        style={{
          background:
            "radial-gradient(120% 100% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Blue nebula band (parallax) */}
      <div
        ref={blueBandRef}
        className="pointer-events-none absolute left-0 right-0 top-[120vh] h-[55vh] -z-10 blur-3xl transform-gpu will-change-transform"
        aria-hidden
        style={{
          background:
            "radial-gradient(65% 55% at 50% 85%, rgba(37,99,235,0.12), rgba(37,99,235,0.06) 45%, transparent 70%)",
        }}
      />
    </>
  );
}
