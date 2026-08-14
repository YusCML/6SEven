import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  reactStrictMode: true,

  images: {
    qualities: [75, 85],
  },

  async redirects() {
    return [
      { source: "/", destination: "/home", permanent: false },

      { source: "/about_us", destination: "/about-us", permanent: true },
      { source: "/commuter_guide", destination: "/commuter-guide", permanent: true },
    ];
  },
};

export default nextConfig;
