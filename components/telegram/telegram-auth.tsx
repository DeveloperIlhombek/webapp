'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTelegram } from '@/hooks/useTelegram'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { useRouter } from 'next/navigation'

export default function TelegramAuth() {
	const { isTelegramLoaded, user: telegramUser } = useTelegram()
	const { telegramLogin, isLoading, error } = useAuthStore()
	const router = useRouter()

	const handleTelegramLogin = async () => {
		if (!telegramUser) return

		try {
			console.log('🔄 Starting telegram login with user:', telegramUser)

			await telegramLogin({
				id: telegramUser.id,
				first_name: telegramUser.first_name,
				last_name: telegramUser.last_name || '',
				username: telegramUser.username || '',
				language_code: telegramUser.language_code || '',
			})

			console.log('✅ Telegram login successful, redirecting to dashboard...')
			router.push('/dashboard')
		} catch (error) {
			console.error('❌ Telegram login failed:', error)
		}
	}

	if (!isTelegramLoaded || !telegramUser) {
		return null
	}

	return (
		<Card className='w-full max-w-md mx-auto'>
			<CardHeader>
				<CardTitle className='text-xl font-bold text-center'>
					Telegram Authentication
				</CardTitle>
			</CardHeader>
			<CardContent className='space-y-4'>
				<div className='text-center'>
					<p className='text-sm text-gray-600 mb-2'>
						Hello, <strong>{telegramUser.first_name}</strong>!
					</p>
					<p className='text-sm text-gray-600 mb-4'>
						Telegram ID: {telegramUser.id}
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
					>
						{isLoading ? (
							<div className='flex items-center space-x-2 justify-center'>
								<div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
								<span>Authenticating...</span>
							</div>
						) : (
							'Continue with Telegram'
						)}
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}
