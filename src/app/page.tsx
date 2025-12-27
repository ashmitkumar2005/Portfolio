import localFont from "next/font/local";
import {

  AnimatedTagline,
  AnimatedText,
} from "@/components/HeroAnimations";
import TypingSubheading from "@/components/TypingSubheading";

import WorkSection from "@/components/WorkSection";
import SocialsSection from "@/components/SocialsSection";
import SubtleButton from "@/components/ui/subtle-button";

const casanova = localFont({
  src: "./fonts/Crysthel.otf",
  weight: "400",
  style: "normal",
});

const axuno = localFont({
  src: "./fonts/AxunoDemo-Regular-BF68fb7b9e28f8c.otf",
  weight: "400",
  style: "normal",
});

export default function Home() {
  return (
    <main className="relative w-full min-h-screen">
      <section className="w-full h-screen flex flex-col items-center justify-center text-center px-4 sm:px-8 md:px-16">
        <h1
          className={`${casanova.className} text-6xl sm:text-8xl md:text-9xl font-extrabold tracking-tight mb-4 text-white`}
        >
          <AnimatedText text="Ashmit Kumar" />
        </h1>

        <AnimatedTagline>
          <TypingSubheading
            className={`${axuno.className} text-gray-100 text-lg sm:text-2xl font-semibold mb-6 leading-relaxed`}
            phrases={[
              "Building things people enjoy using",
              "Turning ideas into immersive experiences",
              "Making technology feel human",
              "Crafting clean, elegant digital products",
            ]}
          />
        </AnimatedTagline>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-10 sm:mt-12">
          <SubtleButton href="#">
            Resume
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:translate-x-0.5"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </SubtleButton>

          <SubtleButton href="#work">
            My Work
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:translate-x-0.5"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 16 16 12 12 8" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          </SubtleButton>
        </div>


      </section>

      <WorkSection />
      <SocialsSection />
    </main>
  );
}
