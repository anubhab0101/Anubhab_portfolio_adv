import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb"
    }
  },
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
