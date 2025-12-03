"use client";

import { useEffect, useRef } from "react";

export const ScrollInertia = () => {
  const isScrolling = useRef(false);
  const scrollVelocity = useRef(0);
  const targetScrollY = useRef(0);
  const currentScrollY = useRef(0);
  const lastScrollTime = useRef(Date.now());
  const animationFrameId = useRef<number | null>(null);
  const lastWheelEvent = useRef<WheelEvent | null>(null);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      // Limit scroll speed - reduce delta for smoother feel
      const maxDelta = 80; // Maximum scroll delta
      const delta = Math.max(-maxDelta, Math.min(maxDelta, e.deltaY));
      
      // Apply damping factor to reduce speed
      const dampingFactor = 0.6; // Reduce this for slower scrolling
      const dampedDelta = delta * dampingFactor;
      
      // Update target position
      targetScrollY.current += dampedDelta;
      
      // Calculate velocity based on wheel speed
      const now = Date.now();
      const timeDelta = now - (lastWheelEvent.current?.timeStamp || lastScrollTime.current);
      scrollVelocity.current = dampedDelta / Math.max(timeDelta, 1);
      lastScrollTime.current = now;
      lastWheelEvent.current = e;
      
      // Constrain to document bounds
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetScrollY.current = Math.max(0, Math.min(maxScroll, targetScrollY.current));
      
      if (!isScrolling.current) {
        isScrolling.current = true;
        animateScroll();
      }
    };

    const animateScroll = () => {
      // Apply inertia with friction
      const friction = 0.88; // Higher = more inertia (slower to stop)
      const lerpFactor = 0.12; // Lower = smoother but slower following
      
      // Update velocity with friction
      scrollVelocity.current *= friction;
      
      // Interpolate towards target position
      const diff = targetScrollY.current - currentScrollY.current;
      currentScrollY.current += diff * lerpFactor;
      
      // Apply velocity for momentum
      currentScrollY.current += scrollVelocity.current;
      
      // Apply to window
      window.scrollTo(0, currentScrollY.current);
      
      // Continue animation if still moving or not at target
      const stillMoving = Math.abs(scrollVelocity.current) > 0.1;
      const notAtTarget = Math.abs(diff) > 0.5;
      
      if (stillMoving || notAtTarget) {
        animationFrameId.current = requestAnimationFrame(animateScroll);
      } else {
        isScrolling.current = false;
        currentScrollY.current = targetScrollY.current = window.pageYOffset;
      }
    };

    const handleTouchStart = () => {
      // Reset on touch start for mobile
      scrollVelocity.current = 0;
      targetScrollY.current = window.pageYOffset;
      currentScrollY.current = window.pageYOffset;
    };

    const handleTouchMove = (e: TouchEvent) => {
      // For touch devices, use native scrolling but with reduced speed
      const touch = e.touches[0];
      const deltaY = touch.clientY - (e as any).lastTouchY || 0;
      (e as any).lastTouchY = touch.clientY;
      
      if (Math.abs(deltaY) > 1) {
        e.preventDefault();
        targetScrollY.current += deltaY * 0.3; // Reduce touch scroll speed
        if (!isScrolling.current) {
          isScrolling.current = true;
          animateScroll();
        }
      }
    };

    // Initialize current positions
    currentScrollY.current = window.pageYOffset;
    targetScrollY.current = window.pageYOffset;

    // Add event listeners
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return null;
};
