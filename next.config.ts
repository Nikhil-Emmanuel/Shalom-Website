import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Photos are landscape phone captures; these widths cover 375 -> 1440 layouts.
    deviceSizes: [375, 640, 828, 1080, 1200, 1440, 1920],
  },
};

export default nextConfig;
