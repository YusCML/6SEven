import type { NextConfig } from "next";

const API_ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN ?? "http://localhost:4000";

const nextConfig: NextConfig = {
  reactCompiler: true,
  reactStrictMode: true,

  images: {
    qualities: [75, 85],

    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      // Hosts allowed for Hotspot cover photos supplied as URLs.
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },

  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${API_ORIGIN}/api/:path*` },
    ];
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
