import Header from '@/components/layout/header'
import { TelegramProvider } from '@/components/telegram/telegram-provider'
import TelegramInit from '@/components/ui/TelegramInit'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
	title: 'Telegram WebApp',
	description: 'A Next.js application for Telegram WebApp',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<TelegramProvider>
					<TelegramInit />
					<div className='min-h-screen bg-gray-50'>
						<Header />
						<main className='container mx-auto py-8 px-4'>{children}</main>
					</div>
				</TelegramProvider>
			</body>
		</html>
	)
}
