import type { NextConfig } from 'next'
 
const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Allowed URLs
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's6.imgcdn.dev',
        pathname: '**',
      },
    ],
  },
}
 
export default nextConfig