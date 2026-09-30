import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack config (Next.js 16 default)
  turbopack: {},

  // Transpile Three.js ecosystem
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    dangerouslyAllowSVG: false,
  },

  // Compression
  compress: true,

  // Strict mode for React
  reactStrictMode: true,

  // Experimental features
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
