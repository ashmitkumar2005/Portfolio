import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import BackgroundWrapper from "@/components/BackgroundWrapper";
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

const sfPro = localFont({
  src: "./fonts/SF-Pro-Display-Regular.otf",
  variable: "--font-sf-pro",
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
        className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} ${sfPro.variable} antialiased min-h-screen bg-black text-gray-100 relative`}
      >
        <SmoothScroll />
        <CustomCursor />
        <BackgroundWrapper />
        <Navbar />
        {children}
        <ContactSection />
        <footer className={`mt-16 mb-8 text-center relative z-10 ${outfit.className}`}>
          <p className="text-xs text-white/40 uppercase tracking-widest font-light hover:text-white/60 transition-colors">
            Copyright &copy; {new Date().getFullYear()} Ashmit Kumar. All Rights Reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}
