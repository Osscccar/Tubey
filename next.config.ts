import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['image.mux.com'],
  },
  env: {
    MUX_TOKEN_ID: process.env.MUX_TOKEN_ID,
    MUX_TOKEN_SECRET: process.env.MUX_TOKEN_SECRET,
  },
};

export default nextConfig;
