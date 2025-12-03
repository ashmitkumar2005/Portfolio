"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type AnimatedTextProps = {
  text: string;
};

export const AnimatedText: React.FC<AnimatedTextProps> = ({ text }) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    // Fire once on initial mount
    setActive(true);
  }, []);

  const letters = useMemo(() => text.split("").map((ch, index) => ({ ch, index })), [
    text,
  ]);

  const baseDelay = 500;
  const minStagger = 80;
  const maxStagger = 120;

  return (
    <div className="hero-text-wrapper">
      <div className={`hero-nebula-glow ${active ? "hero-nebula-glow-active" : ""}`} />
      <span aria-label={text} className="inline-block relative z-10">
        {letters.map(({ ch, index }) => {
          const stagger = minStagger + ((maxStagger - minStagger) * index) / Math.max(letters.length - 1, 1);
          const delay = baseDelay + stagger * index;
          return (
            <span
              key={index}
              className={`hero-letter ${active ? "hero-letter-visible" : ""}`}
              style={{
                transitionDelay: `${delay}ms`,
                // text shadow glow handled by keyframes on visibility
              }}
            >
              {ch === " " ? "\u00A0" : ch}
            </span>
          );
        })}
      </span>
    </div>
  );
};

type AnimatedTaglineProps = {
  children: React.ReactNode;
};

export const AnimatedTagline: React.FC<AnimatedTaglineProps> = ({ children }) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setActive(true), 520);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className={`hero-tagline ${active ? "hero-tagline-active" : ""}`}>
      {children}
    </div>
  );
};

type AnimatedButtonsProps = {
  children: React.ReactNode;
};

export const AnimatedButtons: React.FC<AnimatedButtonsProps> = ({ children }) => {
  const [active, setActive] = useState(false);

  // Start after tagline: name(0) + 250ms + tagline duration (~650ms)
  useEffect(() => {
    const id = window.setTimeout(() => setActive(true), 1320);
    return () => window.clearTimeout(id);
  }, []);

  const items = React.Children.toArray(children);
  const baseDelay = 80;
  const stagger = 180;

  return (
    <div className="flex gap-4 justify-center hero-buttons-wrapper">
      {items.map((child, index) => {
        const delay = baseDelay + stagger * index;
        return (
          <div
            key={index}
            className={`hero-button-shell ${active ? "hero-button-shell-active" : ""}`}
            style={{ transitionDelay: `${delay}ms` }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
};

type ParallaxWrapperProps = {
  children: React.ReactNode;
};

export const ParallaxWrapper: React.FC<ParallaxWrapperProps> = ({ children }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [target, setTarget] = useState({ x: 0, y: 0 });
  const [current, setCurrent] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = (event.clientX - centerX) / rect.width;
      const dy = (event.clientY - centerY) / rect.height;

      const maxX = 6; // px
      const maxY = 4; // px

      setTarget({
        x: Math.max(-1, Math.min(1, dx)) * maxX,
        y: Math.max(-1, Math.min(1, dy)) * maxY,
      });
    };

    let frameId: number;
    const update = () => {
      setCurrent((prev) => {
        const lerp = 0.08;
        const nx = prev.x + (target.x - prev.x) * lerp;
        const ny = prev.y + (target.y - prev.y) * lerp;
        return { x: nx, y: ny };
      });
      frameId = window.requestAnimationFrame(update);
    };

    frameId = window.requestAnimationFrame(update);

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", handleMove);
    };
  }, [target.x, target.y]);

  return (
    <div
      ref={ref}
      className="hero-parallax-wrapper"
      style={{
        transform: `translate3d(${current.x}px, ${current.y}px, 0)`,
      }}
    >
      {children}
    </div>
  );
};
