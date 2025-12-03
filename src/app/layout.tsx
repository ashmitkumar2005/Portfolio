import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import BackgroundParallax from "@/components/BackgroundParallax";
import GalaxyBackground from "@/components/GalaxyBackground";
import CustomCursor from "@/components/CustomCursor";
import ContactSection from "@/components/ContactSection";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-black text-gray-100 relative`}
      >
        <CustomCursor />
        <BackgroundParallax />
        <GalaxyBackground />
        <Navbar />
        {children}
        <ContactSection />
        <footer className="mt-6 mb-4 text-sm text-gray-500 text-center relative z-10">
          {new Date().getFullYear()} Ashmit Kumar. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
