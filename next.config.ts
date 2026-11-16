import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // The shop (/sw, /en) and the admin panel have separate root layouts,
    // so unknown addresses get one shared 404 page (src/app/global-not-found.tsx).
    globalNotFound: true,
  },
  images: {
    // Photos are already shrunk to ~1200px in the browser before upload,
    // so they are served straight from Supabase Storage (no image-optimisation quota used).
    unoptimized: true,
  },
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
