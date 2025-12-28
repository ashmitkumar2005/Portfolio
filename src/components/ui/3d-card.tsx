"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Props tailored for a generic Interactive 3D Card.
 */
export interface Interactive3DCardProps {
    title: string;
    subtitle: string;
    imageUrl: string;
    actionText?: string;
    href: string;
    onClick?: () => void;
    onActionClick?: (e: React.MouseEvent) => void;
    className?: string;
    /** Optional language/tech badge text */
    badgeText?: string;
    /** Tech stack icons to display */
    techStack?: string[];
}

/**
 * A responsive and theme-adaptive card with a 3D tilt effect on hover.
 */
export const Interactive3DCard = React.forwardRef<
    HTMLDivElement,
    Interactive3DCardProps
>(
    (
        { title, subtitle, imageUrl, actionText = "View Project", href, onClick, onActionClick, className, badgeText, techStack },
        ref
    ) => {
        // --- 3D Tilt Animation Logic ---
        const mouseX = useMotionValue(0);
        const mouseY = useMotionValue(0);

        const springConfig = { damping: 15, stiffness: 150 };
        const springX = useSpring(mouseX, springConfig);
        const springY = useSpring(mouseY, springConfig);

        const rotateX = useTransform(springY, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
        const rotateY = useTransform(springX, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

        const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const { width, height, left, top } = rect;
            const mouseXVal = e.clientX - left;
            const mouseYVal = e.clientY - top;
            const xPct = mouseXVal / width - 0.5;
            const yPct = mouseYVal / height - 0.5;
            mouseX.set(xPct);
            mouseY.set(yPct);
        };

        const handleMouseLeave = () => {
            mouseX.set(0);
            mouseY.set(0);
        };

        return (
            <motion.div
                ref={ref}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                className={cn(
                    // Base styles for the card container
                    "relative h-[32rem] w-[28rem] rounded-[40px] bg-transparent transition-all duration-200 ease-out cursor-pointer",
                    className
                )}
                onClick={onClick}
            >
                <div
                    style={{
                        transform: "translateZ(50px)",
                        transformStyle: "preserve-3d",
                    }}
                    className="absolute inset-4 flex flex-col h-[calc(100%-2rem)] w-[calc(100%-2rem)] rounded-[40px] border border-white/10 bg-black group transition-all duration-500 ease-out hover:border-white/90 hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] overflow-hidden"
                >
                    {/* Upper Section - Content with Glassmorphism */}
                    <div className="relative z-20 p-8 pb-12 bg-black/40 backdrop-blur-md">
                        {/* Bleed effect gradient from image (simulated) */}
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-black/20 z-minus" />

                        <div className="flex justify-between items-start relative z-10">
                            <div className="flex-1 pr-4">
                                <motion.h2
                                    style={{ transform: "translateZ(50px)" }}
                                    className="text-2xl font-bold text-white tracking-tight"
                                >
                                    {title}
                                </motion.h2>
                                <motion.p
                                    style={{ transform: "translateZ(40px)" }}
                                    className="text-sm text-gray-300 mt-2 line-clamp-2 leading-relaxed"
                                >
                                    {subtitle}
                                </motion.p>
                            </div>

                            <div className="flex gap-2" style={{ transform: "translateZ(40px)" }}>
                                {techStack?.map((tech) => (
                                    <div
                                        key={tech}
                                        className="h-8 w-8 rounded-full bg-black border border-white/20 flex items-center justify-center overflow-hidden p-1.5 shadow-xl"
                                        title={tech}
                                    >
                                        <img
                                            src={`https://cdn.simpleicons.org/${tech}`}
                                            alt={tech}
                                            className="w-full h-full object-contain brightness-0 invert opacity-100"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Lower Section - Image Preview with Top Fade */}
                    <div className="relative flex-1 overflow-hidden -mt-8 z-10">
                        {/* Gradient Transition Overlay */}
                        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-20 pointer-events-none" />

                        <img
                            src={imageUrl}
                            alt={title}
                            className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        />

                        {/* Shadow for depth */}
                        <div className="absolute inset-0 shadow-[inset_0_20px_40px_rgba(0,0,0,0.8)] pointer-events-none z-10" />
                    </div>

                    {/* Footer Explore Text */}
                    <div className="absolute bottom-6 left-8 z-30">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold group-hover:text-blue-400 transition-colors">
                            Explore Project
                        </span>
                    </div>
                </div>
            </motion.div>
        );
    }
);
Interactive3DCard.displayName = "Interactive3DCard";
