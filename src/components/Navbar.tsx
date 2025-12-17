"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ExpandableLogo from "@/components/ExpandableLogo";

export default function Navbar() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const textFrontVariants = {
    initial: { y: 0, rotateX: 0 },
    hover: { y: "-100%", rotateX: -80 },
  };

  const textBackVariants = {
    initial: { y: "100%", rotateX: 80 },
    hover: { y: 0, rotateX: 0 },
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
        className="pointer-events-auto relative w-full max-w-none rounded-full border-[0.5px] border-white/10 bg-black/20 backdrop-blur supports-[backdrop-filter]:bg-black/10 shadow-md px-6 py-2 flex items-center justify-between text-sm text-gray-100"
        animate={{
          paddingTop: 8,
          paddingBottom: 8,
          maxWidth: isMobile ? "100%" : (scrolled ? 750 : 1280),
        }}
        transition={isMobile ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 30, mass: 0.9 }}
      >
        <Link
          href="/"
          className="flex items-center gap-2"
          onMouseEnter={() => !isMobile && setLogoHovered(true)}
          onMouseLeave={() => !isMobile && setLogoHovered(false)}
        >
          <ExpandableLogo size={40} />
        </Link>

        <motion.ul
          className="flex items-center justify-evenly md:justify-center md:gap-4 flex-1 md:flex-none static md:absolute md:left-1/2 md:-translate-x-1/2"
          animate={{ x: !isMobile && logoHovered && scrolled ? 122 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 30, mass: 0.9 }}
        >
          <li className="relative">
            <Link
              href="#work"
              onMouseEnter={() => setHovered("work")}
              onMouseLeave={() => setHovered(null)}
              className="group relative block px-3 py-1.5 rounded-full text-gray-300 transition-colors"
            >
              {hovered === "work" && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-blue-500/40"
                  transition={{ type: "spring", stiffness: 500, damping: 40, mass: 1 }}
                  aria-hidden
                />
              )}
              <span className="relative font-semibold transition-colors group-hover:text-blue-300 hidden md:block">Work</span>
              <span className="block md:hidden text-gray-300 group-hover:text-blue-300">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </span>
            </Link>
          </li>
          <li className="relative">
            <Link
              href="#know-me"
              onMouseEnter={() => setHovered("know-me")}
              onMouseLeave={() => setHovered(null)}
              className="group relative block px-3 py-1.5 rounded-full text-gray-300 transition-colors"
            >
              {hovered === "know-me" && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-blue-500/30"
                  transition={{ type: "spring", stiffness: 500, damping: 40, mass: 1 }}
                  aria-hidden
                />
              )}
              <span className="relative font-semibold transition-colors group-hover:text-blue-300 hidden md:block">Know Me</span>
              <span className="block md:hidden text-gray-300 group-hover:text-blue-300">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
            </Link>
          </li>
          <li className="relative">
            <Link
              href="#arena"
              onMouseEnter={() => setHovered("arena")}
              onMouseLeave={() => setHovered(null)}
              className="group relative block px-3 py-1.5 rounded-full text-gray-300 transition-colors"
            >
              {hovered === "arena" && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-blue-500/30"
                  transition={{ type: "spring", stiffness: 500, damping: 40, mass: 1 }}
                  aria-hidden
                />
              )}
              <span className="relative font-semibold transition-colors group-hover:text-blue-300 hidden md:block">Arena</span>
              <span className="block md:hidden text-gray-300 group-hover:text-blue-300">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                  <path d="M4 22h16" />
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                </svg>
              </span>
            </Link>
          </li>
        </motion.ul>

        <motion.div
          animate={{ x: !isMobile && logoHovered && scrolled ? 122 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 30, mass: 0.9 }}
        >
          <Link
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              // @ts-expect-error: Lenis is added to window
              if (window.lenis) {
                // @ts-expect-error: Lenis is added to window
                window.lenis.scrollTo("#contact", {
                  duration: 2.0, // Slower, smoother scroll
                  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                });
              } else {
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="group inline-flex items-center gap-2 rounded-full bg-blue-600/95 text-white p-2 md:px-4 md:py-1.5 font-medium shadow-md transition-colors overflow-hidden"
          >
            <motion.div
              className="relative h-[1.1rem] hidden md:flex items-center transform-gpu"
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
        </motion.div>
      </motion.nav>
    </div>
  );
}
