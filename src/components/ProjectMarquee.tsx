"use client";

import Link from "next/link";
import { useState } from "react";

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

    return (
        <div className="relative w-full">
            {/* Mobile View: Tiled (Vertical Stack) */}
            <div className="flex flex-col gap-6 w-full px-4 md:hidden">
                {repos.map((repo) => (
                    <ProjectCard key={repo.id} repo={repo} />
                ))}
            </div>

            {/* Desktop View: Marquee (Infinite Scroll) */}
            <div className="hidden md:block relative w-full overflow-hidden mask-gradient">
                {/* Gradient Masks for smooth fade in/out at edges */}
                <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-black via-black/80 to-transparent pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-black via-black/80 to-transparent pointer-events-none" />

                <div
                    className={`flex w-max gap-8 py-8 animate-scroll will-change-transform ${isPaused ? "paused" : ""
                        }`}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {[...repos, ...repos].map((repo, index) => (
                        <ProjectCard key={`${repo.id}-${index}`} repo={repo} />
                    ))}
                </div>
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
            transform: translate(calc(-50% - 16px)); /* 16px is half of gap-8 (32px) */
          }
        }
      `}</style>
        </div>
    );
}

function ProjectCard({ repo }: { repo: Repo }) {
    return (
        <Link
            href={repo.html_url}
            target="_blank"
            className="group relative flex flex-col justify-between w-full sm:w-[450px] min-h-[240px] h-auto sm:h-[280px] p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 backdrop-blur-md hover:from-white/15 hover:to-white/10 transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_10px_40px_-10px_rgba(59,130,246,0.3)] hover:-translate-y-2 flex-shrink-0"
        >
            <div>
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="p-2.5 rounded-full bg-white/5 border border-white/10 group-hover:bg-blue-500/20 group-hover:border-blue-500/30 transition-colors">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-gray-400 group-hover:text-blue-400 transition-colors"
                        >
                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                        </svg>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                        <span className="text-xs">⭐</span>
                        <span className="text-sm font-medium text-gray-300">{repo.stargazers_count}</span>
                    </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 tracking-tight group-hover:text-blue-200 transition-colors truncate">
                    {repo.name}
                </h3>

                <p className="text-sm sm:text-base text-gray-400 line-clamp-3 mb-4 leading-relaxed">
                    {repo.description || "No description available."}
                </p>
            </div>

            <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/10">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20">
                    {repo.language || "Code"}
                </span>
                <span className="flex items-center gap-2 text-sm font-medium text-gray-400 group-hover:text-white transition-colors">
                    View Project
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transform transition-transform group-hover:translate-x-1"
                    >
                        <path d="M5 12h14" />
                        <path d="M12 5l7 7-7 7" />
                    </svg>
                </span>
            </div>
        </Link>
    );
}
