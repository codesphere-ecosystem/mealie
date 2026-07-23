import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/dashboard",
  allowedDevOrigins: ["257-3000.1.csa.codesphere-demo.com"],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
