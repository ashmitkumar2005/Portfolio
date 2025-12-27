"use client";

import React, { useRef, useEffect, useState } from "react";

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    homeX: number; // Random wander center
    homeY: number; // Random wander center
    phase: number; // For sine wave wandering
    isActive: boolean; // Current state
    targetX?: number; // Active target
    targetY?: number;
}

interface TargetInfo {
    index: number;
    rect: DOMRect;
    relativeRect: { x: number; y: number; width: number; height: number; cx: number; cy: number };
}

export const ParticleCard = ({ children, className = "", particleCount = 200 }: { children: React.ReactNode; className?: string; particleCount?: number }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseRef = useRef({ x: -1, y: -1 });

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        let targets: TargetInfo[] = [];

        // Configuration
        const BORDER_PARTICLE_COUNT = 300; // Force this many particles to form the border. High density.
        const BORDER_RADIUS = 12; // Matches rounded-xl
        const RECRUIT_SPEED = 0.12; // Faster snap
        const RELEASE_SPEED = 0.05; // Slower release

        const resize = () => {
            const { width, height } = container.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);

            initParticles(width, height);
            // Re-fetch targets on resize to ensure rects are correct
            updateTargets();
        };

        const updateTargets = () => {
            const containerRect = container.getBoundingClientRect();
            const targetElements = Array.from(container.querySelectorAll('[data-particle-target]'));

            targets = targetElements.map((el, idx) => {
                const rect = el.getBoundingClientRect();
                const x = rect.left - containerRect.left;
                const y = rect.top - containerRect.top;
                return {
                    index: idx,
                    rect,
                    relativeRect: {
                        x,
                        y,
                        width: rect.width,
                        height: rect.height,
                        cx: x + rect.width / 2,
                        cy: y + rect.height / 2
                    }
                };
            });
        };

        const initParticles = (width: number, height: number) => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: 0,
                    vy: 0,
                    homeX: Math.random() * width,
                    homeY: Math.random() * height,
                    phase: Math.random() * Math.PI * 2,
                    isActive: false
                });
            }
        };

        // Robust SDF Nearest Point on Rounded Rect
        const getNearestBorderPoint = (px: number, py: number, t: TargetInfo["relativeRect"]) => {
            const r = BORDER_RADIUS;
            const halfInnerW = (t.width / 2) - r;
            const halfInnerH = (t.height / 2) - r;

            const dx = px - t.cx;
            const dy = py - t.cy;

            // Clamp to inner box
            let clampedX = Math.max(-halfInnerW, Math.min(halfInnerW, dx));
            let clampedY = Math.max(-halfInnerH, Math.min(halfInnerH, dy));

            let rx = 0;
            let ry = 0;

            // If inside inner box, snap to nearest edge and set normal outwards
            if (clampedX > -halfInnerW && clampedX < halfInnerW && clampedY > -halfInnerH && clampedY < halfInnerH) {
                const dLeft = clampedX + halfInnerW;
                const dRight = halfInnerW - clampedX;
                const dTop = clampedY + halfInnerH;
                const dBottom = halfInnerH - clampedY;
                const min = Math.min(dLeft, dRight, dTop, dBottom);

                if (min === dLeft) {
                    clampedX = -halfInnerW;
                    rx = -1;
                } else if (min === dRight) {
                    clampedX = halfInnerW;
                    rx = 1;
                } else if (min === dTop) {
                    clampedY = -halfInnerH;
                    ry = -1;
                } else {
                    clampedY = halfInnerH;
                    ry = 1;
                }
            } else {
                // Outside inner box: Vector from clamped point to P points outwards
                const vecX = dx - clampedX;
                const vecY = dy - clampedY;
                const len = Math.sqrt(vecX * vecX + vecY * vecY);

                if (len > 0) {
                    rx = vecX / len;
                    ry = vecY / len;
                }
            }

            return {
                x: t.cx + clampedX + rx * r,
                y: t.cy + clampedY + ry * r
            };
        };

        const update = () => {
            const { width, height } = container.getBoundingClientRect();
            ctx.clearRect(0, 0, width, height);

            // Update targets every frame to handle animations/transforms
            updateTargets();

            // 1. Determine Active Target
            let activeTarget: TargetInfo | null = null;
            if (mouseRef.current.x !== -1) {
                // Expanding hit area slightly for better feel
                const hitPadding = 10;
                for (const t of targets) {
                    if (mouseRef.current.x >= t.relativeRect.x - hitPadding &&
                        mouseRef.current.x <= t.relativeRect.x + t.relativeRect.width + hitPadding &&
                        mouseRef.current.y >= t.relativeRect.y - hitPadding &&
                        mouseRef.current.y <= t.relativeRect.y + t.relativeRect.height + hitPadding) {
                        activeTarget = t;
                        break;
                    }
                }
            }

            // 2. Assign Particles
            // Strategy: "Greedy Recruitment".
            // If active target, find the K closest particles and FORCE them to be active.

            // Reset status first
            particles.forEach(p => p.isActive = false);

            if (activeTarget) {
                // Determine distances
                const withDist = particles.map((p, i) => {
                    const dx = p.x - activeTarget!.relativeRect.cx;
                    const dy = p.y - activeTarget!.relativeRect.cy;
                    return { index: i, distSq: dx * dx + dy * dy };
                });

                // Sort by distance (closest first)
                // Optimization: Partial sort or just sort all (1000 items is cheap)
                withDist.sort((a, b) => a.distSq - b.distSq);

                // Recruit top N
                // We recruit slightly more than needed to account for density
                const recruitCount = Math.min(BORDER_PARTICLE_COUNT, particles.length);

                for (let i = 0; i < recruitCount; i++) {
                    const pIdx = withDist[i].index;
                    particles[pIdx].isActive = true;
                    // Calculate target position on border
                    const borderPt = getNearestBorderPoint(particles[pIdx].x, particles[pIdx].y, activeTarget.relativeRect);
                    particles[pIdx].targetX = borderPt.x;
                    particles[pIdx].targetY = borderPt.y;
                }
            }

            const time = Date.now() * 0.001;

            particles.forEach(p => {
                let destX, destY;
                let speed;

                if (p.isActive) {
                    destX = p.targetX!;
                    destY = p.targetY!;

                    // Add micro-jitter for organic border look
                    destX += (Math.random() - 0.5) * 2;
                    destY += (Math.random() - 0.5) * 2;

                    speed = RECRUIT_SPEED;
                } else {
                    // Wander logic
                    const wanderX = Math.sin(time + p.phase) * 30; // Wider wander
                    const wanderY = Math.cos(time + p.phase * 0.9) * 30;

                    destX = p.homeX + wanderX;
                    destY = p.homeY + wanderY;
                    speed = RELEASE_SPEED;
                }

                // Physics: Lerp
                const dx = destX - p.x;
                const dy = destY - p.y;

                p.vx = dx * speed;
                p.vy = dy * speed;

                p.x += p.vx;
                p.y += p.vy;

                // Draw
                // Draw
                // Active to 0.6 for higher visibility + subtle glow
                ctx.beginPath();
                if (p.isActive) {
                    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
                    ctx.shadowColor = "rgba(255, 255, 255, 0.2)";
                    ctx.shadowBlur = 4;
                    ctx.arc(p.x, p.y, 1.0, 0, Math.PI * 2);
                    ctx.fill();
                    // Reset shadow
                    ctx.shadowBlur = 0;
                } else {
                    ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
                    ctx.arc(p.x, p.y, 1.0, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            animationFrameId = requestAnimationFrame(update);
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        };

        const handleMouseLeave = () => {
            mouseRef.current = { x: -1, y: -1 };
        };

        // ResizeObserver to handle layout shifts (better than window.resize)
        const resizeObserver = new ResizeObserver(() => resize());
        resizeObserver.observe(container);

        container.addEventListener("mousemove", handleMouseMove);
        container.addEventListener("mouseleave", handleMouseLeave);

        // Initial setup
        resize();
        update();

        return () => {
            resizeObserver.disconnect();
            container.removeEventListener("mousemove", handleMouseMove);
            container.removeEventListener("mouseleave", handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className={`relative ${className}`}
        >
            <canvas
                ref={canvasRef}
                className="absolute inset-0 pointer-events-none z-0"
                style={{ width: "100%", height: "100%" }}
            />
            {/* Ensure content is above canvas */}
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
};
