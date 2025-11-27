"use client";

import React, {
  ForwardedRef,
  ReactNode,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import "./cursor-reactive.css";

export type ParallaxLimits = {
  maxTranslateX: number;
  maxTranslateY: number;
  maxRotateX: number;
  maxRotateY: number;
};

export type ParallaxConfig = {
  enabled?: boolean;
  intensity?: number; // 0..1
  limits?: Partial<ParallaxLimits>;
  lerpFactor?: number; // 0.06 default
  idleDriftAmplitude?: number; // px
  prefersReducedMotionFallback?: boolean;
};

export type ParallaxApi = {
  enable: () => void;
  disable: () => void;
  reset: () => void;
};

const DEFAULT_LIMITS: ParallaxLimits = {
  maxTranslateX: 6,
  maxTranslateY: 4,
  maxRotateX: 2,
  maxRotateY: 3,
};

const hasReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export type ParallaxWrapperProps = ParallaxConfig & {
  children: ReactNode;
  className?: string;
  "data-aria-motion"?: "on" | "off";
};

export const ParallaxWrapper = forwardRef(function ParallaxWrapper(
  {
    children,
    className,
    enabled = true,
    intensity = 1,
    limits,
    lerpFactor = 0.06,
    idleDriftAmplitude = 1.5,
    prefersReducedMotionFallback = true,
    "data-aria-motion": ariaMotion,
  }: ParallaxWrapperProps,
  ref: ForwardedRef<ParallaxApi>,
) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [isEnabled, setIsEnabled] = useState(enabled);

  const stateRef = useRef({
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
    targetRotX: 0,
    targetRotY: 0,
    currentRotX: 0,
    currentRotY: 0,
    active: false,
    hover: false,
    idlePhase: 0,
    lastPointerTs: 0,
  });

  // Expose control API
  useImperativeHandle(
    ref,
    (): ParallaxApi => ({
      enable: () => setIsEnabled(true),
      disable: () => setIsEnabled(false),
      reset: () => {
        const s = stateRef.current;
        s.targetX = s.targetY = s.currentX = s.currentY = 0;
        s.targetRotX = s.targetRotY = s.currentRotX = s.currentRotY = 0;
        const el = rootRef.current;
        if (el) {
          el.style.setProperty("--px", "0");
          el.style.setProperty("--py", "0");
          el.style.setProperty("--cx", "50%");
          el.style.setProperty("--cy", "50%");
          el.dataset.active = "false";
        }
      },
    }),
    [],
  );

  useEffect(() => {
    setIsEnabled(enabled);
  }, [enabled]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const reduced = prefersReducedMotionFallback && hasReducedMotion();
    if (!isEnabled || reduced || ariaMotion === "off") {
      el.style.transform = "translate3d(0,0,0)";
      el.style.setProperty("--cx", "50%");
      el.style.setProperty("--cy", "50%");
      el.dataset.active = "false";
      return;
    }

    const mergedLimits: ParallaxLimits = {
      ...DEFAULT_LIMITS,
      ...(limits || {}),
    } as ParallaxLimits;

    const state = stateRef.current;
    let frameId: number | null = null;

    const updateFromNormalized = (nx: number, ny: number) => {
      const s = stateRef.current;
      s.active = true;
      // Slightly dampened translation for a more physical, card-like motion
      const ix = nx * mergedLimits.maxTranslateX * intensity * 0.7;
      const iy = ny * mergedLimits.maxTranslateY * intensity * 0.7;
      // Rotate so the edge closest to the cursor dips toward the viewer
      const rx = ny * mergedLimits.maxRotateX * intensity;
      const ry = -nx * mergedLimits.maxRotateY * intensity;
      s.targetX = ix;
      s.targetY = iy;
      s.targetRotX = rx;
      s.targetRotY = ry;
      s.lastPointerTs = performance.now();

      const cx = 50 + nx * 35;
      const cy = 50 + ny * 30;
      el.style.setProperty("--cx", `${cx}%`);
      el.style.setProperty("--cy", `${cy}%`);
      el.dataset.active = "true";
    };

    const handlePointerMove = (evt: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (evt.clientX - rect.left) / rect.width - 0.5;
      const y = (evt.clientY - rect.top) / rect.height - 0.5;
      const nx = Math.max(-1, Math.min(1, x));
      const ny = Math.max(-1, Math.min(1, y));
      updateFromNormalized(nx, ny);
    };

    const handlePointerEnter = () => {
      stateRef.current.hover = true;
      el.dataset.hover = "true";
    };

    const handlePointerLeave = () => {
      stateRef.current.hover = false;
      el.dataset.hover = "false";
      updateFromNormalized(0, 0);
    };

    const handleTouchMove = (evt: TouchEvent) => {
      if (!evt.touches.length) return;
      const rect = el.getBoundingClientRect();
      const t = evt.touches[0];
      const x = (t.clientX - rect.left) / rect.width - 0.5;
      const y = (t.clientY - rect.top) / rect.height - 0.5;
      const nx = Math.max(-1, Math.min(1, x));
      const ny = Math.max(-1, Math.min(1, y));
      updateFromNormalized(nx, ny);
    };

    const handleOrientation = (evt: DeviceOrientationEvent) => {
      const g = (evt.gamma ?? 0) / 45; // left-right
      const b = (evt.beta ?? 0) / 45; // front-back
      const nx = Math.max(-0.8, Math.min(0.8, g));
      const ny = Math.max(-0.6, Math.min(0.6, b));
      updateFromNormalized(nx, ny);
    };

    const step = () => {
      const s = stateRef.current;
      const now = performance.now();

      if (!s.active && idleDriftAmplitude > 0) {
        s.idlePhase += 0.0025 * (1 + intensity);
        const idleX = Math.sin(s.idlePhase) * idleDriftAmplitude;
        const idleY = Math.cos(s.idlePhase * 0.9) * idleDriftAmplitude * 0.6;
        s.targetX = idleX;
        s.targetY = idleY;
      }

      const f = lerpFactor;
      s.currentX += (s.targetX - s.currentX) * f;
      s.currentY += (s.targetY - s.currentY) * f;
      s.currentRotX += (s.targetRotX - s.currentRotX) * f;
      s.currentRotY += (s.targetRotY - s.currentRotY) * f;

      const tx = s.currentX.toFixed(3);
      const ty = s.currentY.toFixed(3);
      const rx = s.currentRotX.toFixed(3);
      const ry = s.currentRotY.toFixed(3);

      el.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotateX(${rx}deg) rotateY(${ry}deg)`;

      frameId = window.requestAnimationFrame(step);
    };

    el.addEventListener("pointermove", handlePointerMove, { passive: true });
    el.addEventListener("pointerenter", handlePointerEnter, { passive: true });
    el.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: true });

    if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
      window.addEventListener("deviceorientation", handleOrientation, true);
    }

    frameId = window.requestAnimationFrame(step);

    return () => {
      el.removeEventListener("pointermove", handlePointerMove);
      el.removeEventListener("pointerenter", handlePointerEnter);
      el.removeEventListener("pointerleave", handlePointerLeave);
      el.removeEventListener("touchmove", handleTouchMove);
      if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
        window.removeEventListener("deviceorientation", handleOrientation, true);
      }
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, [isEnabled, intensity, limits, lerpFactor, idleDriftAmplitude, prefersReducedMotionFallback, ariaMotion]);

  return (
    <div ref={rootRef} className={`parallax-root ${className ?? ""}`} data-aria-motion={ariaMotion}>
      <div className="parallax-cursor-glow" aria-hidden />
      {children}
    </div>
  );
});

// --- Button helper for ripple + hover ---

export type ParallaxButtonShellProps = {
  children: ReactNode;
  className?: string;
};

export const ParallaxButtonShell: React.FC<ParallaxButtonShellProps> = ({
  children,
  className,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleEnter = () => {
      el.dataset.hover = "true";
    };
    const handleLeave = () => {
      el.dataset.hover = "false";
      el.dataset.press = "false";
      el.dataset.ripple = "false";
    };
    const handleDown = (evt: MouseEvent | PointerEvent) => {
      el.dataset.press = "true";
      const rect = el.getBoundingClientRect();
      const x = (("clientX" in evt ? evt.clientX : 0) - rect.left) / rect.width;
      const y = (("clientY" in evt ? evt.clientY : 0) - rect.top) / rect.height;
      el.style.setProperty("--bx", `${(x * 100).toFixed(1)}%`);
      el.style.setProperty("--by", `${(y * 100).toFixed(1)}%`);
      el.dataset.ripple = "true";
      window.setTimeout(() => {
        if (!el) return;
        el.dataset.ripple = "false";
      }, 280);
    };
    const handleUp = () => {
      el.dataset.press = "false";
    };

    el.addEventListener("pointerenter", handleEnter);
    el.addEventListener("pointerleave", handleLeave);
    el.addEventListener("pointerdown", handleDown as any);
    el.addEventListener("pointerup", handleUp);

    return () => {
      el.removeEventListener("pointerenter", handleEnter);
      el.removeEventListener("pointerleave", handleLeave);
      el.removeEventListener("pointerdown", handleDown as any);
      el.removeEventListener("pointerup", handleUp);
    };
  }, []);

  return (
    <div ref={ref} className={`parallax-button-shell ${className ?? ""}`}>
      {children}
    </div>
  );
};

export default ParallaxWrapper;
