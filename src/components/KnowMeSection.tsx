"use client";
import React, { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { ParticleCard } from "./ui/ParticleCard";

const bioPart1 = [
    { text: "AI", highlight: true },
    { text: "&", highlight: true },
    { text: "ML", highlight: true },
    { text: "Engineering", highlight: true },
    { text: "student", highlight: false },
    { text: "building", highlight: false },
    { text: "robust,", highlight: false },
    { text: "production-grade", highlight: true },
    { text: "systems,", highlight: true },
    { text: "prioritizing", highlight: false },
    { text: "real-world", highlight: false },
    { text: "impact", highlight: false },
    { text: "over", highlight: false },
    { text: "academic", highlight: false },
    { text: "demos.", highlight: false },
];

const bioPart2 = [
    { text: "Deeply", highlight: false },
    { text: "curious", highlight: false },
    { text: "about", highlight: false },
    { text: "system", highlight: true },
    { text: "internals", highlight: true },
    { text: "and", highlight: false },
    { text: "architecture,", highlight: true },
    { text: "mastering", highlight: false },
    { text: "scalability,", highlight: true },
    { text: "data", highlight: true },
    { text: "flow,", highlight: true },
    { text: "and", highlight: false },
    { text: "failure", highlight: true },
    { text: "patterns.", highlight: true },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.03, delayChildren: 0.1 },
    },
};

const wordVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring" as const,
            damping: 15,
            stiffness: 150,
        },
    },
};

const steps = [
    {
        title: "Understand the Core",
        desc: "I begin by understanding the fundamental concepts behind a problem — including data flow, constraints, trade-offs, and potential failure points — before relying on tools or frameworks.",
    },
    {
        title: "Build from Scratch",
        desc: "Once the core idea is clear, I build a minimal version from scratch. This helps me understand what abstractions hide and how each component actually works.",
    },
    {
        title: "Test Failure & Edge Cases",
        desc: "I intentionally test edge cases, limitations, and failure scenarios to see how the system behaves under real-world conditions, not just ideal ones.",
    },
    {
        title: "Refine and Document",
        desc: "Finally, I optimize the solution, clean up the design, and document decisions clearly so the system is maintainable and understandable for others.",
    },
];

export default function KnowMeSection() {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        x.set(clientX - left);
        y.set(clientY - top);
    }

    const maskImage = useMotionTemplate`radial-gradient(200px at ${mouseX}px ${mouseY}px, white, transparent)`;
    const style = { maskImage, WebkitMaskImage: maskImage };

    return (
        <section id="know-me" className="relative z-10 w-full pt-16 pb-40 sm:pt-20 sm:pb-48 font-sf">
            <div className="w-full max-w-[90%] mx-auto px-4 sm:px-6 md:px-8">
                <ParticleCard
                    className="w-full p-6 sm:p-8 md:p-10"
                    particleCount={2000}
                >
                    {/* Header */}
                    <div className="flex flex-col items-center text-center mb-10 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            <span className="text-sm font-medium text-blue-400 tracking-widest uppercase mb-2 block">
                                About Me
                            </span>
                            <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-none">
                                Know Me<span className="text-blue-500">.</span>
                            </h2>
                        </motion.div>
                    </div>

                    {/* Bio Text */}
                    <div className="flex justify-center mb-8 relative z-10">
                        <div className="max-w-4xl">
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                className="text-base sm:text-lg text-gray-300 leading-normal space-y-4 font-light text-center"
                            >
                                <p className="flex flex-wrap justify-center gap-x-2 gap-y-1">
                                    {bioPart1.map((word, index) => (
                                        <motion.span
                                            variants={wordVariants}
                                            key={index}
                                            className={word.highlight ? "text-white font-medium" : "transition-colors group-hover:text-gray-200"}
                                        >
                                            {word.text}
                                        </motion.span>
                                    ))}
                                </p>
                                <p className="flex flex-wrap justify-center gap-x-2 gap-y-1">
                                    {bioPart2.map((word, index) => (
                                        <motion.span
                                            variants={wordVariants}
                                            key={index}
                                            className={word.highlight ? "text-white font-medium" : "transition-colors group-hover:text-gray-200"}
                                        >
                                            {word.text}
                                        </motion.span>
                                    ))}
                                </p>
                            </motion.div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

                    {/* Learning Approach Subection */}
                    <div className="flex flex-col items-center relative z-10">
                        <motion.h3
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-xl sm:text-2xl font-bold text-white mb-8 text-center"
                        >
                            My 4-Step Learning Approach
                        </motion.h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full relative">
                            {steps.map((step, index) => (
                                <StepCard key={index} step={step} index={index} total={steps.length} />
                            ))}
                        </div>
                    </div>
                </ParticleCard>
            </div>
        </section>
    );
}



function StepCard({ step, index, total }: { step: { title: string; desc: string }; index: number; total: number }) {
    return (
        <div className="relative flex flex-col items-center w-full h-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex flex-col h-full bg-transparent rounded-xl p-6 transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.4)]"
                data-particle-target
            >
                <div className="text-4xl font-bold text-white/30 mb-4 font-mono select-none">
                    0{index + 1}
                </div>
                <h4 className="text-lg font-bold text-white mb-3 hover:text-blue-400 transition-colors">
                    {step.title}
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                    {step.desc}
                </p>
            </motion.div>

            {/* Arrow (Desktop: Right, Mobile: Down) */}
            {index < total - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-30 opacity-30 text-white">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" />
                        <path d="M12 5l7 7-7 7" />
                    </svg>
                </div>
            )}
            {index < total - 1 && (
                <div className="lg:hidden my-4 opacity-30 text-white flex justify-center w-full">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-90">
                        <path d="M5 12h14" />
                        <path d="M12 5l7 7-7 7" />
                    </svg>
                </div>
            )}
        </div>
    );
}
