import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants'
import type { NextConfig } from 'next'

export default function nextConfig(phase: string): NextConfig {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    initOpenNextCloudflareForDev()
  }

  return {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: `${process.env.API_BACKEND_URL ?? 'http://localhost:8787'}/api/:path*`,
        },
      ]
    },
  }
}
