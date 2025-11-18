import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "86.48.2.198",
        port: "",
        pathname: "/images/company_images/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
