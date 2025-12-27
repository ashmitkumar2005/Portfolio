"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ExpandableLogo from "@/components/ExpandableLogo";
import NavbarMobile from "@/components/NavbarMobile";

import "@/components/navbar-mobile.css";

export default function Navbar() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const elem = document.getElementById(targetId);
    // @ts-expect-error: Lenis is added to window
    if (window.lenis && elem) {
      // @ts-expect-error: Lenis is added to window
      window.lenis.scrollTo(elem);
    } else {
      elem?.scrollIntoView({ behavior: "smooth" });
    }
  };

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
    <>
      {/* Mobile Navbar - Visible only on mobile */}
      <div className="block md:hidden">
        <NavbarMobile />
      </div>

      {/* Desktop Navbar - Visible only on desktop */}
      <div className="hidden md:flex fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full justify-center px-4 pointer-events-none">
        <motion.nav
          className="pointer-events-auto relative w-full max-w-none rounded-full border-[0.5px] border-white/10 bg-black/20 backdrop-blur supports-[backdrop-filter]:bg-black/10 shadow-md px-6 py-2 flex items-center justify-between text-sm text-gray-100"
          animate={{
            paddingTop: 8,
            paddingBottom: 8,
            maxWidth: scrolled ? 750 : 1280,
          }}
          transition={{ type: "spring", stiffness: 260, damping: 30, mass: 0.9 }}
        >
          <Link
            href="/"
            className="flex items-center gap-2"
            onMouseEnter={() => setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
          >
            <ExpandableLogo size={40} isMobile={false} />
          </Link>

          <motion.ul
            className="flex items-center justify-center gap-4 absolute left-1/2 -translate-x-1/2"
            animate={{ x: logoHovered && scrolled ? 122 : 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 30, mass: 0.9 }}
          >
            <li className="relative">
              <Link
                href="#work"
                onClick={(e) => handleScroll(e, "#work")}
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
                <span className="relative font-semibold transition-colors group-hover:text-blue-300">Work</span>
              </Link>
            </li>
            <li className="relative">
              <Link
                href="#know-me"
                onClick={(e) => handleScroll(e, "#know-me")}
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
                <span className="relative font-semibold transition-colors group-hover:text-blue-300">Know Me</span>
              </Link>
            </li>
            <li className="relative">
              <Link
                href="#arena"
                onClick={(e) => handleScroll(e, "#arena")}
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
                <span className="relative font-semibold transition-colors group-hover:text-blue-300">Arena</span>
              </Link>
            </li>
          </motion.ul>

          <motion.div
            animate={{ x: logoHovered && scrolled ? 122 : 0 }}
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
              className="group inline-flex items-center gap-2 rounded-full bg-blue-600/95 text-white px-4 py-1.5 font-medium shadow-md transition-colors overflow-hidden"
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
    </>
  );
}
