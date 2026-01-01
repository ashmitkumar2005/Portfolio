"use client";
import React, { useRef } from "react";
import { motion } from "framer-motion";


const keyStrengths = [
    "Early hands-on experience with computers and software environments",
    "Strong independent learning ability and technical discipline",
    "Comfort with complexity and unfamiliar problem spaces",
    "Systems-oriented thinking developed through practical exploration",
    "Long-term focus on growth, not shortcuts",
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.03, delayChildren: 0.1 },
    },
};



const steps = [
    {
        title: "Idea-First Exploration",
        desc: "I start with a concrete project idea aligned to the technology I want to master, ensuring every concept I learn serves a real and practical purpose.",
    },
    {
        title: "Blueprint & Planning",
        desc: "Before writing code, I design the project’s structure — defining core features, architecture, and learning checkpoints to enforce clarity before execution.",
    },
    {
        title: "AI-Assisted Scaffolding",
        desc: "I use AI to accelerate initial setup, while consciously reviewing and understanding every generated component instead of treating it as a shortcut.",
    },
    {
        title: "Iterative Building & Learning",
        desc: "I develop the project step by step, learning deeply through implementation, refinement, and problem-solving at each stage.",
    },
    {
        title: "Review, Refinement & Ownership",
        desc: "I finalize projects by cleaning the codebase, improving structure, and revisiting decisions so the outcome reflects engineering discipline, not just completion.",
    },
];

export default function KnowMeSection() {

    return (
        <section id="know-me" className="relative z-10 w-full pt-16 pb-40 sm:pt-20 sm:pb-48 font-sf">
            <div className="w-full max-w-[90%] mx-auto px-4 sm:px-6 md:px-8">
                <div
                    className="relative w-full p-6 sm:p-8 md:p-10"
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

                    {/* Bio Text Card */}
                    <div className="flex justify-center mb-8 relative z-10 w-full mx-auto">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="w-full bg-transparent rounded-[40px] p-8 transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.4)]"
                            role="article"
                            aria-label="About Me Bio"
                        >
                            <div className="text-base sm:text-lg text-gray-300 leading-relaxed text-left space-y-6">
                                <p className="font-bold text-white">
                                    I’m an AI & ML Engineering student who grew into technology through early exposure to computers and continuous self-driven exploration. This background shaped a strong technical intuition and a deep interest in how systems behave in real-world conditions. I value long-term skill building, consistency, and understanding fundamentals that scale with experience.
                                </p>
                                <div>
                                    <h4 className="text-white font-medium mb-3">Key strengths:</h4>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                                        {keyStrengths.map((strength, index) => (
                                            <li key={index} className="flex items-start gap-2 text-sm sm:text-base text-gray-400">
                                                <span className="text-blue-500 mt-1">▹</span>
                                                {strength}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
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
                            My Learning Approach
                        </motion.h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 w-full relative">
                            {steps.map((step, index) => (
                                <StepCard key={index} step={step} index={index} total={steps.length} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section >
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
                className="flex flex-col h-full bg-transparent rounded-[40px] p-6 transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.4)]"
                data-particle-target
                role="article"
                aria-label={`Step ${index + 1}: ${step.title}`}
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
