"use client";

import Link from "next/link";
import ExpandableLogo from "@/components/ExpandableLogo";
import "@/components/navbar-mobile.css";

const navItems = [
    { href: "#work", svg: <><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></> },
    { href: "#know-me", svg: <><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></> },
    { href: "#arena", svg: <><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></> }
];

export default function NavbarMobile() {
    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex w-full justify-center px-4 pointer-events-none">
            <nav className="pointer-events-auto relative w-auto max-w-none rounded-full border-[0.5px] border-white/10 bg-black/20 backdrop-blur supports-[backdrop-filter]:bg-black/10 shadow-md px-3 py-2 flex items-center justify-center gap-[20px] text-sm text-gray-100 mobile-fixed-nav">
                <Link href="/" className="flex items-center justify-center">
                    <ExpandableLogo size={32} isMobile={true} />
                </Link>

                <ul className="flex items-center justify-center gap-[20px] static">
                    {navItems.map((item) => (
                        <li key={item.href} className="relative">
                            <Link
                                href={item.href}
                                onClick={(e) => {
                                    e.preventDefault();
                                    const targetId = item.href.replace("#", "");
                                    const elem = document.getElementById(targetId);
                                    // @ts-expect-error: Lenis is added to window
                                    if (window.lenis && elem) {
                                        // @ts-expect-error: Lenis is added to window
                                        window.lenis.scrollTo(elem);
                                    } else {
                                        elem?.scrollIntoView({ behavior: "smooth" });
                                    }
                                }}
                                className="group relative block px-2 py-1.5 rounded-full text-gray-300 transition-colors"
                            >
                                <span className="block text-gray-300 group-hover:text-blue-300">
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        {item.svg}
                                    </svg>
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>

                <div>
                    <Link
                        href="#contact"
                        onClick={(e) => {
                            e.preventDefault();
                            // @ts-expect-error: Lenis is added to window
                            if (window.lenis) {
                                // @ts-expect-error: Lenis is added to window
                                window.lenis.scrollTo("#contact", {
                                    duration: 2.0,
                                    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                                });
                            } else {
                                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                            }
                        }}
                        className="group inline-flex items-center gap-2 rounded-full bg-blue-600/95 text-white p-2 font-medium shadow-md transition-colors overflow-hidden"
                    >
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M7 17L17 7" />
                            <path d="M7 7h10v10" />
                        </svg>
                    </Link>
                </div>
            </nav>
        </div>
    );
}
