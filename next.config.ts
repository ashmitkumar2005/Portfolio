import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // @ts-expect-error: turbopack option is valid in Next.js 16 but types might be lagging
    turbopack: {
      root: __dirname,
    },
  },
};

export default nextConfig;
