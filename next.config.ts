import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  experimental: {
    turbo: {
      root: process.cwd(),
    },
  },
};

export default nextConfig;
