import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  reactStrictMode: true,

  images: {
    // Next 16 defaults this to [75] and silently coerces anything else to the
    // nearest allowed value, so the hero's quality={85} needs listing here.
    qualities: [75, 85],
  },

  async redirects() {
    return [
      // `/` and `/home` used to render the same page. Redirect instead, so the
      // landing page has a single canonical URL.
      { source: "/", destination: "/home", permanent: false },

      // Routes were snake_case before v0.3.0; keep old links working.
      { source: "/about_us", destination: "/about-us", permanent: true },
      { source: "/commuter_guide", destination: "/commuter-guide", permanent: true },
    ];
  },
};

export default nextConfig;
