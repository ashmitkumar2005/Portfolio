"use client";

import { useEffect, useRef, useState } from "react";
import "./contact-section.css";

type ContactSectionProps = {
  headline?: string;
  subheading?: string;
  email?: string;
};

export default function ContactSection({
  headline = "Let's Collaborate",
  subheading = "Open to full time roles, project collabs, or conversations.",
  email = "ashmitkumar2005@gmail.com",
}: ContactSectionProps) {
  const [copied, setCopied] = useState(false);
  const [glowActive, setGlowActive] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  useEffect(() => {
    if (!cardRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setGlowActive(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        threshold: 0.25,
      },
    );

    observer.observe(cardRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="contact"
      className="relative z-20 flex w-full items-center justify-center px-4 sm:px-6 md:px-8 py-24 sm:py-32"
    >
      <div className="relative w-full max-w-4xl group contact-wrapper">
        {/* Card */}
        <div
          ref={cardRef}
          className={`relative rounded-[32px] border border-white/10 bg-black/40 backdrop-blur-xl px-6 sm:px-12 py-16 sm:py-20 overflow-hidden transform-gpu will-change-transform transition-all duration-500 ease-out group-hover:border-white/90 group-hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] group-hover:-translate-y-2 ${glowActive
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-8 scale-95"
            }`}
          style={{ backfaceVisibility: "hidden", WebkitFontSmoothing: "subpixel-antialiased", transform: "translateZ(0)" }}
        >
          <div className="relative flex flex-col items-center text-center z-10">
            {/* Label */}
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <span className="text-sm font-medium text-gray-400 tracking-wide">Get in Touch</span>
            </div>

            {/* Headline */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-4 drop-shadow-lg">
              {headline}
            </h2>
            <p className="text-base sm:text-lg text-gray-400 max-w-xl mx-auto mb-12">
              {subheading}
            </p>

            {/* Email Input & Button */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xl mx-auto mb-16">
              <div className="flex-1 flex items-center justify-between w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 transition-colors hover:bg-white/10 group/input">
                <div className="flex items-center gap-3 text-gray-300">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <span className="text-base sm:text-lg font-medium">{email}</span>
                </div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-500 group-hover/input:text-white transition-colors transform group-hover/input:translate-x-0.5 group-hover/input:-translate-y-0.5"
                >
                  <path d="M7 17L17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </div>

              <button
                onClick={handleCopy}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-8 py-4 rounded-full transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] active:scale-95 whitespace-nowrap"
              >
                <span>{copied ? "Copied!" : "Copy Email"}</span>
                {!copied && (
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
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                  </svg>
                )}
              </button>
            </div>

            {/* Social Icons Row */}
            <div className="flex items-center justify-center gap-8 sm:gap-12">
              <SocialLink href="https://www.linkedin.com/in/ashmitkumar2005" icon="linkedin" />
              <div className="w-px h-6 bg-white/10" />
              <SocialLink href="https://github.com/ashmitkumar2005" icon="github" />
              <div className="w-px h-6 bg-white/10" />
              <SocialLink href="#" icon="resume" />
              <div className="w-px h-6 bg-white/10" />
              <SocialLink href="mailto:ashmitkumar2005@gmail.com" icon="calendar" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialLink({ href, icon }: { href: string; icon: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform duration-200"
    >
      {icon === "linkedin" && (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      )}
      {icon === "github" && (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
      )}
      {icon === "resume" && (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M16 13H8" />
          <path d="M16 17H8" />
          <path d="M10 9H8" />
        </svg>
      )}
      {icon === "calendar" && (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
          <line x1="16" x2="16" y1="2" y2="6" />
          <line x1="8" x2="8" y1="2" y2="6" />
          <line x1="3" x2="21" y1="10" y2="10" />
        </svg>
      )}
    </a>
  );
}
