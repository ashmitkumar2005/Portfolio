"use client";

import { useEffect, useRef, useState } from "react";

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export const SmoothScrollProvider: React.FC<SmoothScrollProviderProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const lastScrollY = useRef(0);
  const rafId = useRef<number | null>(null);
  const momentumRef = useRef({ velocity: 0, target: 0, current: 0 });

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.pageYOffset;
      const delta = currentScrollY - lastScrollY.current;
      
      setScrollY(currentScrollY);
      setScrollVelocity(delta);
      
      // Update momentum
      momentumRef.current.velocity = delta * 0.8; // Damping
      momentumRef.current.target = currentScrollY;
      
      lastScrollY.current = currentScrollY;
    };

    const momentumScroll = () => {
      if (Math.abs(momentumRef.current.velocity) > 0.1) {
        momentumRef.current.velocity *= 0.95; // Friction
        momentumRef.current.current += momentumRef.current.velocity;
        
        // Apply momentum scroll
        if (containerRef.current) {
          containerRef.current.style.transform = `translateY(${-momentumRef.current.current}px)`;
        }
        
        rafId.current = requestAnimationFrame(momentumScroll);
      } else {
        momentumRef.current.velocity = 0;
        momentumRef.current.current = momentumRef.current.target;
      }
    };

    let scrollTimeout: NodeJS.Timeout;
    const debouncedMomentum = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        rafId.current = requestAnimationFrame(momentumScroll);
      }, 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('scroll', debouncedMomentum, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', debouncedMomentum);
      clearTimeout(scrollTimeout);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  // Custom scroll-to function with momentum
  useEffect(() => {
    (window as any).smoothScrollTo = (targetY: number, duration: number = 1000) => {
      const startY = window.pageYOffset;
      const distance = targetY - startY;
      let startTime: number;

      const animateScroll = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // Cubic easing
        const easeProgress = progress < 0.5 
          ? 4 * progress * progress * progress 
          : (progress - 1) * (2 * progress - 2) * (2 * progress - 2) + 1;
        
        const currentY = startY + (distance * easeProgress);
        window.scrollTo(0, currentY);
        
        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };

      requestAnimationFrame(animateScroll);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="smooth-scroll-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          transform: `translateY(${scrollY}px)`,
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
};
