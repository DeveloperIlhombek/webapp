import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	env: {
		NEXT_PUBLIC_API_URL:
			process.env.NEXT_PUBLIC_API_URL ||
			'https://helminthoid-clumsily-xuan.ngrok-free.dev',
	},
}

export default nextConfig
