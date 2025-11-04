import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'EduSystem - Telegram Web App',
	description: 'Educational System with Telegram Integration',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang='en'>
			<head>
				<Script
					src='https://telegram.org/js/telegram-web-app.js'
					strategy='beforeInteractive'
				/>
			</head>
			<body className={inter.className}>{children}</body>
		</html>
	)
}
