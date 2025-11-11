"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="sticky top-4 z-50 flex w-full justify-center px-4">
      <nav className="max-w-4xl w-full rounded-full border border-white/10 bg-black/60 backdrop-blur supports-[backdrop-filter]:bg-black/40 shadow-sm px-4 py-2 flex items-center justify-between text-sm text-gray-200">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/10 text-base font-semibold text-white">
            A
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-4">
          <li className="relative">
            <Link
              href="#work"
              onMouseEnter={() => setHovered("work")}
              onMouseLeave={() => setHovered(null)}
              className="group relative px-3 py-1.5 rounded-full text-gray-300 transition-colors"
            >
              {hovered === "work" && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-blue-500/30"
                  transition={{ type: "spring", stiffness: 500, damping: 40, mass: 1 }}
                  aria-hidden
                />
              )}
              <span className="relative transition-colors group-hover:text-blue-300 group-hover:font-semibold">Work</span>
            </Link>
          </li>
          <li className="relative">
            <Link
              href="#know-me"
              onMouseEnter={() => setHovered("know-me")}
              onMouseLeave={() => setHovered(null)}
              className="group relative px-3 py-1.5 rounded-full text-gray-300 transition-colors"
            >
              {hovered === "know-me" && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-blue-500/30"
                  transition={{ type: "spring", stiffness: 500, damping: 40, mass: 1 }}
                  aria-hidden
                />
              )}
              <span className="relative transition-colors group-hover:text-blue-300 group-hover:font-semibold">Know Me</span>
            </Link>
          </li>
        </ul>

        <Link
          href="mailto:ashmitkumar2005@gmail.com"
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 font-medium shadow-sm transition-colors"
        >
          Let’s Connect
          <span aria-hidden>↗</span>
        </Link>
      </nav>
    </div>
  );
}
