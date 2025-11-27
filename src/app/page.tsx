import localFont from "next/font/local";
import {
  AnimatedButtons,
  AnimatedTagline,
  AnimatedText,
} from "@/components/HeroAnimations";
import TypingSubheading from "@/components/TypingSubheading";

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
    <main className="relative w-full h-screen">
      <section className="w-full h-full flex flex-col items-center justify-center text-center px-4 sm:px-8 md:px-16">
        <h1
          className={`${casanova.className} text-6xl sm:text-8xl md:text-9xl font-extrabold tracking-tight mb-4 text-white`}
        >
          <AnimatedText text="Ashmit Kumar" />
        </h1>

        <AnimatedTagline>
          <TypingSubheading
            className={`${axuno.className} text-gray-100 text-2xl font-semibold mb-6 leading-relaxed`}
            phrases={[
              "Building things people enjoy using",
              "Turning ideas into immersive experiences",
              "Making technology feel human",
              "Crafting clean, elegant digital products",
            ]}
          />
        </AnimatedTagline>

        <AnimatedButtons>
          <a
            href="https://github.com/ashmitkumar2005"
            target="_blank"
            className="px-5 py-2 rounded-xl bg-gray-100 text-gray-900 font-semibold transition-colors duration-200"
          >
            GitHub
          </a>

          <a
            href="mailto:ashmitkumar2005@gmail.com"
            className="px-5 py-2 rounded-xl border border-gray-500 text-gray-300 transition-colors duration-200"
          >
            Let’s Connect
          </a>
        </AnimatedButtons>
      </section>
    </main>
  );
}
