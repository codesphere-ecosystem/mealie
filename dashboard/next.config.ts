import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/dashboard",
  allowedDevOrigins: [process.env.WORKSPACE_DEV_DOMAIN],
};

export default nextConfig;
