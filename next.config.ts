import type { NextConfig } from "next";

// Site 100 % statique : les pages sont générées au build (dossier `out/`),
// ce qui le rend très rapide et hébergeable gratuitement (Vercel, Netlify…).
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default nextConfig;
