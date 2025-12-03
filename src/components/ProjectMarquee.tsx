"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Repo = {
    id: number;
    name: string;
    description: string | null;
    html_url: string;
    stargazers_count: number;
    language: string | null;
    fork: boolean;
    updated_at: string;
};

export default function ProjectMarquee({ repos }: { repos: Repo[] }) {
    const [isPaused, setIsPaused] = useState(false);
    const scrollerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!scrollerRef.current) return;

        // Clone the content to ensure seamless scrolling
        const scrollerContent = Array.from(scrollerRef.current.children);
        scrollerContent.forEach((item) => {
            const duplicatedItem = item.cloneNode(true);
            (duplicatedItem as HTMLElement).setAttribute("aria-hidden", "true");
            scrollerRef.current?.appendChild(duplicatedItem);
        });
    }, []);

    return (
        <div className="relative w-full overflow-hidden mask-gradient">
            {/* Gradient Masks for smooth fade in/out at edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-black to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-black to-transparent pointer-events-none" />

            <div
                ref={scrollerRef}
                className={`flex w-max gap-6 py-4 animate-scroll ${isPaused ? "paused" : ""
                    }`}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {repos.map((repo) => (
                    <Link
                        key={repo.id}
                        href={repo.html_url}
                        target="_blank"
                        className="group relative flex flex-col justify-between w-[450px] h-[280px] p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2 text-gray-400 group-hover:text-blue-400 transition-colors">
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M2 12h20" />
                                        <path d="M20 2v20" />
                                        <path d="M2 22v-8" />
                                        <path d="M2 2v2" />
                                        <path d="M12 2v2" />
                                    </svg>
                                </div>
                                <div className="flex items-center gap-1 text-sm font-medium text-gray-500 group-hover:text-gray-300 transition-colors">
                                    <span>⭐</span>
                                    <span>{repo.stargazers_count}</span>
                                </div>
                            </div>

                            <h3 className="text-2xl font-semibold text-gray-100 mb-3 group-hover:text-white transition-colors truncate">
                                {repo.name}
                            </h3>

                            <p className="text-base text-gray-400 line-clamp-3 mb-4 h-18">
                                {repo.description || "No description available."}
                            </p>
                        </div>

                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                            <span className="text-xs font-medium text-gray-500">
                                {repo.language || "Code"}
                            </span>
                            <span className="text-xs font-medium text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                View Project →
                            </span>
                        </div>
                    </Link>
                ))}
            </div>

            <style jsx>{`
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        .paused {
          animation-play-state: paused;
        }
        @keyframes scroll {
          to {
            transform: translate(calc(-50% - 12px)); /* 12px is half of gap-6 (24px) */
          }
        }
      `}</style>
        </div>
    );
}
