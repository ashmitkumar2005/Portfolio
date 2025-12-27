import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["framer-motion"],
    turbopackUseSystemTlsCerts: true,
  },
};

export default nextConfig;
