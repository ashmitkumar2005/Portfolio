"use client";

import { useEffect, useRef } from "react";

interface SmoothScrollOptions {
  duration?: number;
  easing?: (t: number) => number;
  offset?: number;
}

export const useSmoothScroll = (options: SmoothScrollOptions = {}) => {
  const {
    duration = 1200,
    easing = (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1, // cubic-bezier(0.4, 0, 0.2, 1)
    offset = 0,
  } = options;

  const isScrolling = useRef(false);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href^="#"]');
      
      if (!link) return;
      
      e.preventDefault();
      
      const targetId = link.getAttribute('href')?.slice(1);
      if (!targetId) return;
      
      const targetElement = document.getElementById(targetId);
      if (!targetElement) return;
      
      smoothScrollTo(targetElement, offset);
    };

    const smoothScrollTo = (element: Element, offset: number) => {
      if (isScrolling.current) return;
      
      const startY = window.pageYOffset;
      const targetY = element.getBoundingClientRect().top + startY - offset;
      const distance = targetY - startY;
      
      if (Math.abs(distance) < 5) return;
      
      let startTime: number;
      
      const animateScroll = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const easedProgress = easing(progress);
        
        const currentY = startY + (distance * easedProgress);
        window.scrollTo(0, currentY);
        
        if (progress < 1) {
          animationFrameId.current = requestAnimationFrame(animateScroll);
        } else {
          isScrolling.current = false;
        }
      };
      
      isScrolling.current = true;
      animationFrameId.current = requestAnimationFrame(animateScroll);
    };

    document.addEventListener('click', handleLinkClick);
    
    return () => {
      document.removeEventListener('click', handleLinkClick);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [duration, easing, offset]);

  return { isScrolling: () => isScrolling.current };
};
