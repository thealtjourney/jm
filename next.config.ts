import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root; without it Next walks up and finds an unrelated
  // lockfile in the home directory.
  turbopack: { root: __dirname },
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
