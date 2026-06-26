import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/djx2rkfte/**",
      },
    ],
  },
  experimental: {
    // Slike proizvoda/radnje idu kroz server akcije (multipart) → veći limit.
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
