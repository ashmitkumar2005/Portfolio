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
      className="relative z-20 flex w-full items-center justify-center px-4 sm:px-6 md:px-8 py-16 sm:py-20"
    >
      <div className="relative w-full max-w-4xl group contact-wrapper">
        {/* Hover halo outside the card border */}
        <div
          className="pointer-events-none absolute -inset-[6px] rounded-[38px] bg-[radial-gradient(circle_at_50%_50%,transparent_55%,rgba(34,197,94,0.28)_75%,rgba(22,163,74,0.85)_90%,transparent_100%)] opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-[1400ms] ease-out"
          aria-hidden
        />

        <svg className="contact-border-svg" viewBox="0 0 100 100" aria-hidden>
          <rect x="1.5" y="1.5" width="97" height="97" rx="24" ry="24" />
        </svg>

        {/* Card (fades / slides / scales in) */}
        <div
          ref={cardRef}
          className={`relative rounded-[32px] border-[2.5px] border-white/12 group-hover:border-emerald-400 bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-black px-6 sm:px-10 py-10 sm:py-14 shadow-[0_25px_60px_rgba(15,23,42,0.9)] backdrop-blur-2xl overflow-hidden transform-gpu transition-all duration-900 ease-out transition-colors ${
            glowActive
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-6 scale-95"
          }`}
        >
          {/* inner top blue band (fades in on enter) */}
          <div
            className={`pointer-events-none absolute inset-x-0 -top-32 h-52 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.95),transparent_65%)] mix-blend-screen blur-3xl transition-opacity duration-900 ease-out ${
              glowActive ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden
          />

          <div className="relative flex flex-col items-center gap-6 text-center">
            <p className="text-xs sm:text-sm tracking-[0.25em] uppercase text-blue-200/70">Get In Touch</p>

            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white">
                {headline}
              </h2>
              <p className="text-sm sm:text-base text-gray-300/80 max-w-xl mx-auto">
                {subheading}
              </p>
            </div>

            {/* Email pill */}
            <div className="mt-4 flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <div className="flex w-full max-w-md items-center gap-3 rounded-full bg-black/40 border border-white/10 px-3 py-2.5 text-left">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm text-blue-100">
                  ✉
                </span>
                <span className="flex-1 truncate text-xs sm:text-sm text-gray-100/90">
                  {email}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-400 text-white text-xs sm:text-sm font-medium px-5 py-2 shadow-[0_0_25px_rgba(59,130,246,0.7)] transition-colors"
              >
                {copied ? "Copied" : "Copy Email"}
              </button>
            </div>

            {/* Divider */}
            <div className="my-6 h-px w-full max-w-md bg-gradient-to-r from-transparent via-white/15 to-transparent" />

            {/* Links row */}
            <div className="grid w-full max-w-xl grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm text-gray-200/90">
              <a
                href="https://github.com/ashmitkumar2005"
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 hover:border-blue-400/70 hover:bg-blue-500/10 transition-colors"
              >
                <span className="text-lg">💻</span>
                <span className="text-[11px] sm:text-xs font-medium">GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/ashmit-kumar-92551626b"
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 hover:border-blue-400/70 hover:bg-blue-500/10 transition-colors"
              >
                <span className="text-lg">🔗</span>
                <span className="text-[11px] sm:text-xs font-medium">LinkedIn</span>
              </a>
              <a
                href="#"
                className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 hover:border-blue-400/70 hover:bg-blue-500/10 transition-colors"
              >
                <span className="text-lg">📄</span>
                <span className="text-[11px] sm:text-xs font-medium">Resume</span>
              </a>
              <a
                href="mailto:ashmitkumar2005@gmail.com"
                className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 hover:border-blue-400/70 hover:bg-blue-500/10 transition-colors"
              >
                <span className="text-lg">🗓</span>
                <span className="text-[11px] sm:text-xs font-medium">Say Hi</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
