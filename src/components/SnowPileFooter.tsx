"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import "./snowpile.css";
import type { SnowPileFooterProps, SnowPileFooterHandle } from "../types";
import { computeSnowHeightfield } from "../lib/snowSim";
import WebGLSnowRenderer from "./WebGLSnowRenderer";

// Internal helper: compute UTC day difference deterministically
function daysSince(start: Date, now: Date): number {
  const msPerDay = 86400000;
  const startUTC = Date.UTC(
    start.getUTCFullYear(),
    start.getUTCMonth(),
    start.getUTCDate(),
  );
  const nowUTC = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  );
  return Math.max(0, Math.floor((nowUTC - startUTC) / msPerDay));
}

// Default deployment date (can be adjusted)
const DEFAULT_DEPLOYMENT_DATE = new Date("2025-11-01T00:00:00Z");

const DEFAULT_COLORS = {
  shadow: "#0b1020",
  mid: "#cfe0ff",
  highlight: "#ffffff",
};

const SnowPileFooter = forwardRef<SnowPileFooterHandle, SnowPileFooterProps>(
  (
    {
      startDate,
      width = "100%",
      height = 200,
      dropsPerDay = 2000,
      maxDrops = 200000,
      wind,
      colors = DEFAULT_COLORS,
      meltRatePerDay = 0,
      seedSalt,
      prefersReducedMotion,
      quality = "medium",
      onReady,
    },
    ref,
  ) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [heightfield, setHeightfield] = useState<Float32Array | null>(null);
    const [useWebGL, setUseWebGL] = useState<boolean>(true);
    const [mouseUv, setMouseUv] = useState<{ x: number; y: number } | null>(
      null,
    );

    // Expose exportHeightfield via ref
    useImperativeHandle(
      ref,
      (): SnowPileFooterHandle => ({
        exportHeightfield: () => heightfield,
      }),
      [heightfield],
    );

    // Detect WebGL support once on mount
    useEffect(() => {
      if (typeof document === "undefined") return;
      const testCanvas = document.createElement("canvas");
      const gl =
        testCanvas.getContext("webgl") ||
        testCanvas.getContext("experimental-webgl");
      if (!gl) setUseWebGL(false);
    }, []);

    // Track mouse position over the footer so the pile can react to cursor
    useEffect(() => {
      if (typeof window === "undefined") return;

      const handleMove = (event: MouseEvent) => {
        const el = containerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        if (x >= 0 && x <= 1 && y >= 0 && y <= 1) {
          setMouseUv({ x, y });
        } else {
          setMouseUv(null);
        }
      };

      const handleLeave = () => {
        setMouseUv(null);
      };

      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseleave", handleLeave);

      return () => {
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseleave", handleLeave);
      };
    }, []);

    // Run deterministic simulation once on mount or when inputs change
    useEffect(() => {
      const baseDate =
        typeof startDate === "string"
          ? new Date(startDate)
          : startDate instanceof Date
          ? startDate
          : DEFAULT_DEPLOYMENT_DATE;

      const now = new Date();
      const d = daysSince(baseDate, now);

      const deviceRatio = Math.min(window.devicePixelRatio || 1, 2);
      const baseCells = quality === "high" ? 512 : quality === "low" ? 192 : 320;
      const widthCells = Math.floor(baseCells * deviceRatio);

      const result = computeSnowHeightfield({
        widthCells,
        daysSinceStart: d,
        dropsPerDay,
        maxDrops,
        meltRatePerDay,
        windStrength: wind?.strength ?? 0,
        windDirection: wind?.direction ?? "right",
        seedSalt,
      });

      setHeightfield(result.heightfield);
      if (onReady) onReady();
    }, [startDate, dropsPerDay, maxDrops, meltRatePerDay, quality, wind?.strength, wind?.direction, seedSalt, onReady]);

    // Render heightfield to canvas (2D fallback) when WebGL is not available
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas || !heightfield || useWebGL) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const logicalWidth = canvas.clientWidth || canvas.width;
      const logicalHeight = canvas.clientHeight || canvas.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = logicalWidth * dpr;
      canvas.height = logicalHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.clearRect(0, 0, logicalWidth, logicalHeight);

      const cells = heightfield.length;
      const cellWidth = logicalWidth / cells;

      // Smooth the raw heightfield to remove jagged edges while
      // keeping overall shape from the deterministic sim.
      const smoothed = smoothHeightfield(heightfield, 3);

      const maxH = Math.max(...smoothed);
      const heightScale = 0.1;
      const scale = maxH > 0 ? (logicalHeight * 0.75 * heightScale) / maxH : 0;

      // 3D-ish light direction (x,y,z) – coming from upper-right/front
      const lightDir = { x: 0.3, y: -1, z: 0.4 };
      const lightLen = Math.hypot(lightDir.x, lightDir.y, lightDir.z) || 1;
      lightDir.x /= lightLen;
      lightDir.y /= lightLen;
      lightDir.z /= lightLen;

      // Precompute crest points for the snow surface
      const xs: number[] = new Array(cells);
      const ys: number[] = new Array(cells);
      for (let i = 0; i < cells; i++) {
        const x = i * cellWidth;
        const y = logicalHeight - smoothed[i] * scale;
        xs[i] = x;
        ys[i] = y;
      }

      // --- Base body fill: soft blue-white gradient
      const bodyGrad = ctx.createLinearGradient(
        0,
        logicalHeight * 0.1,
        0,
        logicalHeight,
      );
      bodyGrad.addColorStop(0, colors.highlight);
      bodyGrad.addColorStop(0.55, colors.mid);
      bodyGrad.addColorStop(1, colors.shadow);

      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.moveTo(0, logicalHeight);
      for (let i = 0; i < cells; i++) {
        ctx.lineTo(xs[i], ys[i]);
      }
      ctx.lineTo(logicalWidth, logicalHeight);
      ctx.closePath();
      ctx.fill();

      // --- Shading pass: normals, subsurface scattering, AO
      ctx.save();
      // Clip to the snow body so shading stays within the pile
      ctx.beginPath();
      ctx.moveTo(0, logicalHeight);
      for (let i = 0; i < cells; i++) ctx.lineTo(xs[i], ys[i]);
      ctx.lineTo(logicalWidth, logicalHeight);
      ctx.closePath();
      ctx.clip();

      for (let i = 0; i < cells; i++) {
        const hL = i > 0 ? smoothed[i - 1] : smoothed[i];
        const hC = smoothed[i];
        const hR = i < cells - 1 ? smoothed[i + 1] : smoothed[i];

        // First derivative for slope, second derivative for curvature (AO)
        const dhdx = (hR - hL) * 0.5;
        const curvature = hL - 2 * hC + hR;

        // 3D-ish normal (x is screen, y is up, z is slight facing)
        const nx = -dhdx;
        const ny = 1;
        const nz = 0.35;
        const nLen = Math.hypot(nx, ny, nz) || 1;
        const nxl = nx / nLen;
        const nyl = ny / nLen;
        const nzl = nz / nLen;

        let ndotl = nxl * lightDir.x + nyl * lightDir.y + nzl * lightDir.z;
        ndotl = clamp01(ndotl);

        // Map with smoothstep for softer transition
        const lit = smoothstep(0.15, 0.95, ndotl);

        // Ambient occlusion: valleys get slightly darker
        const ao = clamp01(curvature * 0.15);
        const shade = clamp01(lit * (1 - 0.4 * ao));

        // Sub-surface scattering tint
        const warm = { r: 255, g: 244, b: 230 };
        const cool = { r: 190, g: 210, b: 250 };
        const base = mixColor(cool, warm, shade * 0.8 + 0.2);

        ctx.fillStyle = `rgba(${base.r},${base.g},${base.b},${0.32 + shade * 0.35})`;

        // Slightly blur columns by overlapping a bit
        const x = xs[i] - cellWidth * 0.25;
        const yTop = ys[i];
        const w = cellWidth * 1.5;
        ctx.fillRect(x, yTop, w, logicalHeight - yTop + 2);
      }

      // Rim light: gentle highlight right at the crest
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = "rgba(255,255,255,0.9)";
      ctx.shadowBlur = 6;
      ctx.shadowColor = "rgba(255,255,255,0.4)";
      ctx.beginPath();
      for (let i = 0; i < cells; i++) {
        const x = xs[i];
        const y = ys[i] - 0.5; // nudge up slightly
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Micro noise / sparkle on crest – deterministic per-cell hash
      for (let i = 0; i < cells; i++) {
        const x = xs[i];
        const y = ys[i];
        const n = hash01(i * 9187.31);
        if (n < 0.55) continue;
        const jitterX = (hash01(i * 13.37) - 0.5) * cellWidth * 0.6;
        const jitterY = (hash01(i * 91.1) - 0.5) * 3;
        const r = 0.4 + hash01(i * 7.1) * 0.9;
        ctx.fillStyle = `rgba(255,255,255,${0.18 + hash01(i * 23.3) * 0.25})`;
        ctx.beginPath();
        ctx.arc(x + jitterX, y + jitterY + 1, r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // Soft contact shadow at the bottom of the page
      ctx.globalAlpha = 0.42;
      ctx.fillStyle = colors.shadow;
      const shadowH = logicalHeight * 0.22;
      ctx.beginPath();
      ctx.ellipse(
        logicalWidth / 2,
        logicalHeight,
        logicalWidth * 0.62,
        shadowH,
        0,
        0,
        Math.PI,
      );
      ctx.fill();
      ctx.globalAlpha = 1;
    }, [heightfield, useWebGL, colors.highlight, colors.mid, colors.shadow]);

    const style: React.CSSProperties = {
      width: typeof width === "number" ? `${width}px` : width,
      height,
    };

    return (
      <div className="snowpile-footer-root" aria-hidden>
        <div
          className="snowpile-footer-inner"
          style={style}
          ref={containerRef}
        >
          {heightfield && useWebGL ? (
            <WebGLSnowRenderer
              heightfield={heightfield}
              widthPx={
                typeof width === "number"
                  ? width
                  : (typeof window !== "undefined" ? window.innerWidth : 1024)
              }
              heightPx={height}
              colors={colors}
              mouseUv={mouseUv}
            />
          ) : (
            <canvas ref={canvasRef} className="snowpile-canvas" />
          )}
        </div>
      </div>
    );
  },
);

SnowPileFooter.displayName = "SnowPileFooter";

export default SnowPileFooter;

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function smoothHeightfield(src: Float32Array, radius: number): Float32Array {
  const n = src.length;
  const dst = new Float32Array(n);
  const r = Math.max(1, radius | 0);
  const window = 2 * r + 1;
  for (let i = 0; i < n; i++) {
    let sum = 0;
    let count = 0;
    for (let k = -r; k <= r; k++) {
      const idx = i + k;
      if (idx >= 0 && idx < n) {
        sum += src[idx];
        count++;
      }
    }
    dst[i] = count > 0 ? sum / count : src[i];
  }
  // Simple second pass for a slightly more Gaussian feel
  if (r > 1) {
    return smoothHeightfield(dst, 1);
  }
  return dst;
}

type RGB = { r: number; g: number; b: number };

function mixColor(a: RGB, b: RGB, t: number): RGB {
  const k = clamp01(t);
  return {
    r: Math.round(a.r + (b.r - a.r) * k),
    g: Math.round(a.g + (b.g - a.g) * k),
    b: Math.round(a.b + (b.b - a.b) * k),
  };
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function hash01(n: number): number {
  const x = Math.sin(n) * 43758.5453123;
  return x - Math.floor(x);
}
