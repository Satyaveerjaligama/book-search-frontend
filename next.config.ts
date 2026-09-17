import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    API_URL: process.env.API_URL,
  },
  basePath: '/book-search',
};

export default nextConfig;
