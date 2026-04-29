import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/amp/:path*",
        destination: "/",
        permanent: true
      }
    ];
  }
};

export default nextConfig;
