import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/.well-known/stellar.toml",
        destination: "/api/stellar",
      },
    ];
  },
};

export default nextConfig;
