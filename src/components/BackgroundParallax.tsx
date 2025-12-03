"use client";

import React, { useEffect, useRef } from "react";

export default function BackgroundParallax() {
  const heroImageRef = useRef<HTMLDivElement>(null);
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

          // Hero wallpaper: smooth, subtle parallax (slower than content)
          if (heroImageRef.current) {
            const offset = y * -0.15;
            heroImageRef.current.style.transform = `translate3d(0, ${offset}px, 0)`;
          }

          // Top glow: almost fixed (very far back)
          if (topGlowRef.current) {
            const offset = y * -0.04;
            topGlowRef.current.style.transform = `translate3d(0, ${offset}px, 0)`;
          }

          // Starfield: in-between layer
          if (starsRef.current) {
            const offset = y * -0.09;
            starsRef.current.style.transform = `translate3d(0, ${offset}px, 0)`;
          }

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
      {/* Base hero image + strong fade to pitch-black (parallax) */}
      <div
        ref={heroImageRef}
        className="pointer-events-none fixed inset-0 -z-20 bg-black will-change-transform"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(0,0,0,0) 45%, rgba(0,0,0,0.85) 75%, #000 100%), url('/back.png')",
          backgroundPosition: "top center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#000",
        }}
      />

      {/* Soft top glow (parallax) – very subtle above hero */}
      <div
        ref={topGlowRef}
        className="pointer-events-none absolute inset-x-0 top-[-10%] h-[60vh] -z-10 blur-2xl transform-gpu will-change-transform"
        aria-hidden
      />


      {/* Starfield (parallax) */}
      <div
        ref={starsRef}
        className="pointer-events-none fixed left-0 right-0 top-0 h-[120vh] -z-10 opacity-35 transform-gpu will-change-transform"
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

    </>
  );
}
