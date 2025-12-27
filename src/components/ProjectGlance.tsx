"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Maximize2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface ProjectGlanceProps {
    url: string | null;
    isOpen: boolean;
    onClose: () => void;
    title: string;
}

export default function ProjectGlance({ url, isOpen, onClose, title }: ProjectGlanceProps) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            setLoading(true);
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!url) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 pointer-events-none">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-auto"
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full h-full max-w-7xl bg-[#0a0a0a] rounded-[32px] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col pointer-events-auto"
                    >
                        {/* Toolbar */}
                        <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/10 backdrop-blur-md">
                            <div className="flex items-center gap-4">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                                    <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                                </div>
                                <div className="h-4 w-px bg-white/10 mx-1" />
                                <h3 className="text-sm font-medium text-white/90 truncate max-w-[200px] sm:max-w-md">
                                    {title} <span className="text-white/30 mx-2">—</span> <span className="text-white/50 text-xs font-normal">{url.replace('https://', '')}</span>
                                </h3>
                            </div>

                            <div className="flex items-center gap-3">
                                <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 text-xs font-medium border border-blue-500/20 transition-all hover:scale-105"
                                >
                                    <ExternalLink size={14} />
                                    Open Live
                                </a>
                                <button
                                    onClick={onClose}
                                    className="p-1.5 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                        {/* Iframe content */}
                        <div className="flex-1 relative bg-white">
                            {loading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a] z-10">
                                    <div className="flex flex-col items-center gap-4 text-center px-6">
                                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                                        <div className="space-y-1">
                                            <p className="text-sm text-white/80 font-medium">Loading live preview...</p>
                                            <p className="text-xs text-white/40">
                                                Some sites may block previews. If it takes too long,
                                                <a href={url} target="_blank" rel="noopener" className="text-blue-400 hover:underline mx-1">open in new tab</a>.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <iframe
                                src={url}
                                className="w-full h-full border-none"
                                onLoad={() => setLoading(false)}
                                title={title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
