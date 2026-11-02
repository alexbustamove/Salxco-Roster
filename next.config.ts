import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "salxco.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
