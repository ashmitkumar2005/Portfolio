import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black text-white relative overflow-hidden">
            {/* Background Stars */}
            <div className="absolute inset-0 opacity-50">
                <div className="absolute top-10 left-20 w-1 h-1 bg-white rounded-full animate-pulse" />
                <div className="absolute top-40 right-40 w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-75" />
                <div className="absolute bottom-20 left-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse delay-150" />
            </div>

            <div className="relative z-10 text-center px-4">
                <h1 className="text-9xl font-bold mb-4 bg-gradient-to-b from-white to-gray-600 bg-clip-text text-transparent">
                    404
                </h1>
                <h2 className="text-2xl md:text-4xl font-semibold mb-6 text-blue-200">
                    Lost in Space?
                </h2>
                <p className="text-gray-400 max-w-md mx-auto mb-10 text-lg">
                    The page you are looking for seems to have drifted into a black hole.
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-bold hover:scale-105 transition-transform duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                >
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
                        <path d="m12 19-7-7 7-7" />
                        <path d="M19 12H5" />
                    </svg>
                    Return to Base
                </Link>
            </div>

            {/* Decorative Planet */}
            <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-tr from-blue-900/40 to-purple-900/40 blur-3xl" />
        </div>
    );
}
