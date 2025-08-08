import type { NextConfig } from "next";
import { hostname } from "os";

const nextConfig: NextConfig = {

  images:{
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
  experimental: {
    ppr: "incremental",
  },
  devIndicators:{
    appIsrStatus: true,
    buildActivity : true,
    buildActivityPosition : 'bottom-right'
  }
};

export default nextConfig;
