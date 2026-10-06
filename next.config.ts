import type { NextConfig } from 'next'

/*
 * GitHub Pages serves this project from a subpath — /github-multitopic-explorer
 * for a project site — so every asset URL and route needs that prefix baked in.
 * The deploy workflow reads the real path off the Pages site and exports it as
 * NEXT_PUBLIC_BASE_PATH; it is empty locally, so `next dev` serves from the
 * root with no prefix.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

const nextConfig: NextConfig = {
  // Emits a fully static ./out directory for upload-pages-artifact to publish.
  // Pages serves files only, so there is no server runtime at all.
  output: 'export',

  basePath,

  /*
   * Directory URLs, so /v1.0/ resolves to out/v1.0/index.html instead of
   * relying on Pages to guess at v1.0.html. The versioned pages under app/v1.x
   * all carry a dot in their segment, which extensionless resolution handles
   * unreliably; trailingSlash sidesteps that entirely.
   */
  trailingSlash: true,

  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },

  images: {
    // No image optimiser exists in a static export, so next/image falls back to
    // a plain <img> pointing at the original URL. Remote patterns are therefore
    // not consulted — app/v1.4 loads s6.imgcdn.dev directly.
    unoptimized: true,
  },
}

export default nextConfig