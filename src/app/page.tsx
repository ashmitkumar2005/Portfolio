export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-100 px-4">
      <section className="flex flex-col items-center text-center max-w-2xl">
        <div className="w-32 h-32 mb-6 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700 shadow-md">
          <span className="text-gray-400 text-5xl">🧠</span>
        </div>

        <h1 className="text-5xl font-extrabold tracking-tight mb-3">
          Ashmit Kumar
        </h1>

        <p className="text-gray-400 text-lg mb-6 leading-relaxed">
          🚀 I’m a passionate developer crafting intelligent and beautiful web experiences.
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

      <footer className="absolute bottom-4 text-sm text-gray-500">
        © {new Date().getFullYear()} Ashmit Kumar. All rights reserved.
      </footer>
    </main>
  );
}
