"use client";
import React, { useState } from "react";

interface SubtleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    href?: string;
    target?: string;
    rel?: string;
}

export default function SubtleButton({
    children,
    className = "",
    href,
    target,
    rel,
    ...props
}: SubtleButtonProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    const baseClasses = `group relative border-[0.5px] flex justify-center items-center gap-3 border-white/10 rounded-full px-8 py-3
                   transition-all duration-500 ease-out hover:border-white hover:shadow-lg hover:shadow-indigo-500/20 
                   hover:scale-105 active:scale-95 overflow-hidden backdrop-blur-sm
                   before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent 
                   before:via-white/5 before:to-transparent before:translate-x-[-100%] 
                   hover:before:translate-x-[100%] before:transition-transform before:duration-700 ${className}`;

    const content = (
        <>
            {/* Subtle glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Text/Content */}
            <span className="text-white font-medium tracking-wide text-sm transition-all duration-300 
                         group-hover:text-indigo-50 relative z-10 flex items-center gap-2">
                {children}
            </span>

            {/* Animated dot/Icon placeholder - repurposing specific dot logic for a consistent accent if needed, 
          but for now relying on children for icons to be flexible */}
            {/* Hover state border animation */}
            <div className="absolute inset-0 rounded-full border-[0.5px] border-indigo-400/0 
                        group-hover:border-indigo-400/30 transition-all duration-500 
                        animate-pulse opacity-0 group-hover:opacity-100"></div>
        </>
    );

    if (href) {
        return (
            <a
                href={href}
                target={target}
                rel={rel}
                className={baseClasses}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                    setIsHovered(false);
                    setIsPressed(false);
                }}
                onMouseDown={() => setIsPressed(true)}
                onMouseUp={() => setIsPressed(false)}
                onClick={(e) => {
                    if (href.startsWith("#")) {
                        e.preventDefault();
                        const targetId = href.substring(1);
                        const targetElement = document.getElementById(targetId);
                        if (targetElement) {
                            // @ts-expect-error: Lenis is added to window
                            if (window.lenis) {
                                // @ts-expect-error: Lenis is added to window
                                window.lenis.scrollTo(targetElement);
                            } else {
                                targetElement.scrollIntoView({ behavior: "smooth" });
                            }
                        }
                    }
                }}
            >
                {content}
            </a>
        );
    }

    return (
        <button
            className={baseClasses}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setIsPressed(false);
            }}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            {...props}
        >
            {content}
        </button>
    );
}
