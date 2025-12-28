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
                                <button
                                    onClick={onClose}
                                    className="group relative flex items-center justify-center p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer active:scale-95"
                                    title="Close Preview"
                                >
                                    <div className="w-5 h-5 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 transition-colors border border-black/10 shadow-sm flex items-center justify-center">
                                        <X size={10} className="text-black/60 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={3} />
                                    </div>
                                </button>
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
                            </div>
                        </div>

                        {/* Iframe content */}
                        <div className="flex-1 relative bg-white overflow-hidden">
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

                            {/* Bottom Vignette & Disclaimer */}
                            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-20 flex items-end justify-center pb-4">
                                <p className="text-[10px] sm:text-xs text-white font-bold tracking-wide bg-black/40 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 shadow-lg">
                                    (This is Preview, View live site for full experience)
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
