import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  reactStrictMode: true,

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
