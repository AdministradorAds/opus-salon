import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Agenda e admin leem/escrevem data/db.json em runtime — sem Cache Components.
  cacheComponents: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
