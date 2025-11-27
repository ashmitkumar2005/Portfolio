"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import "./typing-subheading.css";

export type TypingSubheadingProps = {
  phrases: string[];
  typingSpeed?: number; // base ms per char
  deletingSpeed?: number; // base ms per char when deleting
  pauseBetween?: number; // base pause after each phrase
  className?: string;
  glow?: boolean;
  parallaxDepth?: number; // px translateZ for subtle depth
};

const DEFAULT_TYPING_SPEED = 88; // ms
const DEFAULT_DELETING_SPEED = 56; // ms
const DEFAULT_PAUSE = 2200; // ms

function jitter(base: number, variation: number) {
  const delta = (Math.random() * 2 - 1) * variation;
  return Math.max(20, base + delta);
}

const TypingSubheading: React.FC<TypingSubheadingProps> = ({
  phrases,
  typingSpeed = DEFAULT_TYPING_SPEED,
  deletingSpeed = DEFAULT_DELETING_SPEED,
  pauseBetween = DEFAULT_PAUSE,
  className,
  glow = true,
  parallaxDepth = 10,
}) => {
  const safePhrases = useMemo(() => (phrases && phrases.length ? phrases : [""]), [
    phrases,
  ]);

  const [mounted, setMounted] = useState(false);
  const [started, setStarted] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [display, setDisplay] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [isTypingBurst, setIsTypingBurst] = useState(false);

  const timeoutRef = useRef<number | null>(null);

  // Initial cinematic dissolve before typing starts
  useEffect(() => {
    setMounted(true);
    const startId = window.setTimeout(() => {
      setStarted(true);
    }, 220); // synced roughly 200–250ms after hero name begins
    return () => window.clearTimeout(startId);
  }, []);

  // Typing loop
  useEffect(() => {
    if (!started) return;

    const currentPhrase = safePhrases[phraseIndex % safePhrases.length];

    const schedule = (delay: number, fn: () => void) => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(fn, delay) as unknown as number;
    };

    if (!deleting && display === currentPhrase) {
      // At full phrase – pause, then start deleting
      schedule(jitter(pauseBetween, 200), () => {
        setDeleting(true);
      });
      return;
    }

    if (deleting && display === "") {
      // Finished deleting – move to next phrase and start typing
      schedule(jitter(160, 40), () => {
        setDeleting(false);
        setPhraseIndex((i) => (i + 1) % safePhrases.length);
      });
      return;
    }

    if (!deleting) {
      // Typing forward
      const nextLength = display.length + 1;
      const nextText = currentPhrase.slice(0, nextLength);
      const delay = jitter(typingSpeed, 12);
      setIsTypingBurst(true);
      schedule(delay, () => {
        setDisplay(nextText);
        setIsTypingBurst(false);
      });
    } else {
      // Deleting
      const nextLength = Math.max(0, display.length - 1);
      const nextText = currentPhrase.slice(0, nextLength);
      const delay = jitter(deletingSpeed, 10);
      schedule(delay, () => {
        setDisplay(nextText);
      });
    }

    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [started, display, deleting, phraseIndex, safePhrases, typingSpeed, deletingSpeed, pauseBetween]);

  const depthStyle: React.CSSProperties = {
    transform: `translate3d(0, 0, 0)`,
  };

  return (
    <div
      className={`typing-subheading-wrapper ${mounted ? "typing-subheading-mounted" : ""} ${
        started ? "typing-subheading-started" : ""
      } ${glow ? "typing-subheading-glow" : ""} ${className ?? ""}`}
      style={depthStyle}
      aria-live="polite"
    >
      <span className="typing-subheading-text">
        <span className="typing-subheading-phrase">{display}</span>
        <span
          className={`typing-subheading-cursor ${
            started ? "typing-subheading-cursor-visible" : ""
          } ${isTypingBurst ? "typing-subheading-cursor-typing" : ""}`}
          aria-hidden
        >
          |
        </span>
      </span>
    </div>
  );
};

export default TypingSubheading;
