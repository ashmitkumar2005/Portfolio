"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ExpandableLogo from "@/components/ExpandableLogo";

export default function Navbar() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const textFrontVariants = {
    initial: { y: 0, rotateX: 0 },
    hover: { y: "-100%", rotateX: -80 },
  };

  const textBackVariants = {
    initial: { y: "100%", rotateX: 80 },
    hover: { y: 0, rotateX: 0 },
  };

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const y = window.scrollY || window.pageYOffset || 0;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(y > 32); // small threshold before compact mode
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex w-full justify-center px-4 pointer-events-none">
      <motion.nav
        className="pointer-events-auto relative w-full max-w-none rounded-full border-[0.5px] border-white/10 bg-black/40 backdrop-blur supports-[backdrop-filter]:bg-black/30 shadow-lg px-4 py-1.5 flex items-center justify-between text-sm text-gray-100"
        animate={{
          paddingTop: 5,
          paddingBottom: 5,
          maxWidth: scrolled ? 600 : 1280,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 30, mass: 0.9 }}
      >
        <Link href="/" className="flex items-center gap-2">
          <ExpandableLogo size={40} />
        </Link>

        <ul className="flex items-center gap-4 absolute left-1/2 -translate-x-1/2 -ml-[10px]">
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
                    className="absolute inset-0 rounded-full bg-blue-500/40"
                    transition={{ type: "spring", stiffness: 500, damping: 40, mass: 1 }}
                    aria-hidden
                  />
                )}
                <span className="relative font-semibold transition-colors group-hover:text-blue-300">Work</span>
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
                <span className="relative font-semibold transition-colors group-hover:text-blue-300">Know Me</span>
              </Link>
            </li>
          </ul>

        <Link
          href="mailto:ashmitkumar2005@gmail.com"
          className="group inline-flex items-center gap-2 rounded-full bg-blue-600/95 hover:bg-blue-500 text-white px-4 py-1.5 font-medium shadow-md transition-colors overflow-hidden"
        >
          <motion.div
            className="relative h-[1.1rem] flex items-center transform-gpu"
            variants={{}}
            initial="initial"
            whileHover="hover"
          >
            <motion.span
              className="block"
              variants={textFrontVariants}
              transition={{ type: "spring", stiffness: 260, damping: 30, mass: 0.9 }}
            >
              Let’s Connect
            </motion.span>
            <motion.span
              className="absolute inset-0 block"
              variants={textBackVariants}
              transition={{ type: "spring", stiffness: 260, damping: 30, mass: 0.9 }}
              aria-hidden
            >
              Let’s Connect
            </motion.span>
          </motion.div>
          <span aria-hidden>↗</span>
        </Link>
      </motion.nav>
    </div>
  );
}
