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
}

/**
 * A responsive and theme-adaptive card with a 3D tilt effect on hover.
 */
export const Interactive3DCard = React.forwardRef<
    HTMLDivElement,
    Interactive3DCardProps
>(
    (
        { title, subtitle, imageUrl, actionText = "View Project", href, onClick, onActionClick, className, badgeText },
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
                    className="absolute inset-4 flex flex-col h-[calc(100%-2rem)] w-[calc(100%-2rem)] rounded-[40px] border border-white/10 bg-black/40 backdrop-blur-xl group transition-all duration-500 ease-out hover:border-white/90 hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] overflow-hidden"
                >
                    {/* Upper 40% - Content with White Glow */}
                    <div className="relative h-[40%] p-6 z-20 flex flex-col justify-between bg-gradient-to-b from-white/10 to-transparent backdrop-blur-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                {badgeText && (
                                    <motion.span
                                        style={{ transform: "translateZ(30px)" }}
                                        className="inline-block px-3 py-1 mb-3 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/20 backdrop-blur-md"
                                    >
                                        {badgeText}
                                    </motion.span>
                                )}
                                <motion.h2
                                    style={{ transform: "translateZ(50px)" }}
                                    className="text-2xl font-bold text-white tracking-tight"
                                >
                                    {title}
                                </motion.h2>
                                <motion.p
                                    style={{ transform: "translateZ(40px)" }}
                                    className="text-sm text-gray-300 mt-1 line-clamp-2 leading-relaxed"
                                >
                                    {subtitle}
                                </motion.p>
                            </div>

                            <motion.a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.1, rotate: "5deg" }}
                                whileTap={{ scale: 0.9 }}
                                aria-label={`View ${title}`}
                                style={{ transform: "translateZ(60px)" }}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 border border-white/20 backdrop-blur-md hover:bg-white/20 hover:border-white/40 transition-colors"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <ArrowUpRight className="h-5 w-5 text-white" />
                            </motion.a>
                        </div>
                    </div>

                    {/* Lower 60% - Project Preview Image */}
                    <div className="relative h-[60%] overflow-hidden">
                        <img
                            src={imageUrl}
                            alt={title}
                            className="h-full w-full object-cover object-top"
                        />
                    </div>
                </div>
            </motion.div>
        );
    }
);
Interactive3DCard.displayName = "Interactive3DCard";
