import type { NextConfig } from "next";
import { getSiteConfig } from "./src/lib/site-config";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  devIndicators: false,
  outputFileTracingRoot: process.cwd(),
  async headers() {
    const { isIndexable } = getSiteConfig();
    return [
      {
        source: "/:path*",
        headers: [
          ...(isIndexable
            ? []
            : [
                {
                  key: "X-Robots-Tag",
                  value:
                    "noindex, nofollow, noarchive, nosnippet, noimageindex",
                },
              ]),
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
