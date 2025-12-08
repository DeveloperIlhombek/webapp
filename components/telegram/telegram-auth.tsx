'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTelegram } from '@/hooks/useTelegram'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { useRouter } from 'next/navigation'

export default function TelegramAuth() {
	const { isTelegramLoaded, user: telegramUser, webApp } = useTelegram()
	const { telegramLogin, isLoading, error } = useAuthStore()
	const router = useRouter()

	// Mobile Telegram platformasini aniqlash
	const isMobileTelegram = webApp?.platform === 'tdesktop' ? false : true

	const handleTelegramLogin = async () => {
		if (!telegramUser) {
			alert('Telegram user data not available')
			return
		}

		try {
			console.log('📱 Mobile Telegram login started...')

			await telegramLogin({
				id: telegramUser.id,
				first_name: telegramUser.first_name,
				last_name: telegramUser.last_name || '',
				username: telegramUser.username || '',
				language_code: telegramUser.language_code || 'en',
			})

			console.log('✅ Mobile Telegram login successful')
			router.push('/profile')
		} catch (err) {
			console.error('❌ Mobile Telegram login failed:', err)

			// Normalize unknown error to a string message
			const message =
				err instanceof Error ? err.message : String(err ?? 'Unknown error')

			// Mobile uchun user-friendly xabar
			if (message.includes('Network error') || message.includes('timeout')) {
				alert(
					'Internet bilan aloqa muammosi. Iltimos, internet aloqangizni tekshiring.'
				)
			}
		}
	}

	if (!isTelegramLoaded) {
		return (
			<Card className='w-full max-w-md mx-auto'>
				<CardContent className='p-6'>
					<div className='text-center'>
						<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4'></div>
						<p className='text-gray-600'>Loading Telegram...</p>
					</div>
				</CardContent>
			</Card>
		)
	}

	if (!telegramUser) {
		return (
			<Card className='w-full max-w-md mx-auto'>
				<CardHeader>
					<CardTitle className='text-center text-yellow-600'>
						Telegram User Data Not Available
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className='text-sm text-gray-600 text-center mb-4'>
						{isMobileTelegram
							? "Make sure you're opening this app from Telegram mobile app"
							: "Make sure you're opening this app from Telegram"}
					</p>
					<div className='text-xs bg-yellow-50 p-3 rounded'>
						<p>
							<strong>Troubleshooting:</strong>
						</p>
						<ul className='list-disc list-inside mt-1 space-y-1'>
							<li>Open this app from Telegram</li>
							<li>Check if the bot is properly configured</li>
							<li>Try refreshing the page</li>
						</ul>
					</div>
				</CardContent>
			</Card>
		)
	}

	return (
		<Card className='w-full max-w-md mx-auto'>
			<CardHeader>
				<CardTitle className='text-xl font-bold text-center'>
					{isMobileTelegram ? 'Mobile Telegram' : 'Telegram'} Login
				</CardTitle>
			</CardHeader>
			<CardContent className='space-y-4'>
				<div className='text-center'>
					<p className='text-sm text-gray-600 mb-2'>
						Hello, <strong>{telegramUser.first_name}</strong>!
					</p>
					<p className='text-xs text-gray-500 mb-4'>
						Telegram ID: {telegramUser.id}
						{isMobileTelegram && ' • Mobile App'}
					</p>

					{error && (
						<Alert variant='destructive' className='mb-4'>
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<Button
						onClick={handleTelegramLogin}
						disabled={isLoading}
						className='w-full bg-blue-500 hover:bg-blue-600'
						size='lg'
					>
						{isLoading ? (
							<div className='flex items-center space-x-2 justify-center'>
								<div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
								<span>Connecting...</span>
							</div>
						) : (
							`Continue with Telegram${isMobileTelegram ? ' Mobile' : ''}`
						)}
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}
