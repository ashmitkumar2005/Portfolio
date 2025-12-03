"use client";

import { useEffect } from "react";

export const SmoothScroller = () => {
  useEffect(() => {
    // Enhanced smooth scrolling for anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href^="#"]');
      
      if (!link) return;
      
      e.preventDefault();
      
      const targetId = link.getAttribute('href')?.slice(1);
      if (!targetId) return;
      
      const targetElement = document.getElementById(targetId);
      if (!targetElement) return;
      
      // Smooth scroll with easing
      const startY = window.pageYOffset;
      const targetY = targetElement.getBoundingClientRect().top + startY;
      const distance = targetY - startY;
      const duration = 1200;
      
      let startTime: number;
      
      const animateScroll = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // Cubic easing function
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

    document.addEventListener('click', handleAnchorClick);
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return null;
};
