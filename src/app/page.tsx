import GalaxyBackground from "@/components/GalaxyBackground";
import localFont from "next/font/local";

const casanova = localFont({
  src: "./fonts/Casanova.ttf",
  weight: "400",
  style: "normal",
});

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-4 pt-24 md:pt-28">
      {/* Fullscreen animated galaxy section behind content */}
      <GalaxyBackground />

      <section className="flex flex-col items-center text-center max-w-2xl">
        <h1 className={`${casanova.className} text-5xl font-extrabold tracking-tight mb-3 text-white drop-shadow-[0_0_18px_rgba(37,99,235,0.9)]`}>
          Ashmit Kumar
        </h1>

        <p className="text-gray-400 text-lg mb-6 leading-relaxed">
          I’m a passionate developer crafting intelligent and beautiful web experiences.
          Exploring AI, design, and code — building stuff that matters.
        </p>

        <div className="flex gap-4">
          <a
            href="https://github.com/ashmitkumar2005"
            target="_blank"
            className="px-5 py-2 rounded-xl bg-gray-100 text-gray-900 font-semibold hover:bg-white transition"
          >
            GitHub
          </a>

          <a
            href="mailto:ashmitkumar2005@gmail.com"
            className="px-5 py-2 rounded-xl border border-gray-500 text-gray-300 hover:bg-gray-800 transition"
          >
            Let’s Connect
          </a>
        </div>
      </section>

      <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 text-sm text-gray-500">
        © {new Date().getFullYear()} Ashmit Kumar. All rights reserved.
      </footer>
    </main>
  );
}
