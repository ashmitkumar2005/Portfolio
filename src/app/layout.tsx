import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import BackgroundParallax from "@/components/BackgroundParallax";
import GalaxyBackground from "@/components/GalaxyBackground";
import CustomCursor from "@/components/CustomCursor";
import ContactSection from "@/components/ContactSection";
import SmoothScroll from "@/components/SmoothScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ashmit Kumar – Developer Portfolio",
  description:
    "I’m Ashmit, a developer crafting intelligent, beautiful web experiences with Next.js, React, and AI.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-black">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} antialiased min-h-screen bg-black text-gray-100 relative`}
      >
        <SmoothScroll />
        <CustomCursor />
        <BackgroundParallax />
        <GalaxyBackground />
        <Navbar />
        {children}
        <ContactSection />
        <footer className={`mt-16 mb-8 text-center relative z-10 ${outfit.className}`}>
          <a
            href="https://github.com/ashmitkumar2005"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg hover:bg-white/10 transition-all duration-300 group cursor-pointer hover:scale-105 hover:shadow-blue-500/20"
          >
            <span className="text-sm text-gray-300 tracking-wide">Made with</span>
            <span className="text-red-500 animate-pulse text-lg drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">❤️</span>
            <span className="text-sm text-gray-300 tracking-wide">by</span>
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-200 via-white to-blue-200 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Ashmit Kumar
            </span>
          </a>
        </footer>
      </body>
    </html>
  );
}
