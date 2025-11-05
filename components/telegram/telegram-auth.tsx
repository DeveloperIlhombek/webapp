'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { useTelegram } from './telegram-provider'

export default function TelegramAuth() {
	const { isTelegramLoaded, user: telegramUser } = useTelegram()
	const { telegramLogin, isLoading } = useAuthStore()

	const handleTelegramLogin = async () => {
		if (!telegramUser) return

		try {
			await telegramLogin({
				id: telegramUser.id,
				first_name: telegramUser.first_name,
				last_name: telegramUser.last_name,
				username: telegramUser.username,
				language_code: telegramUser.language_code,
			})
		} catch (error) {
			console.error('Telegram login failed:', error)
		}
	}

	if (!isTelegramLoaded || !telegramUser) {
		return null
	}

	return (
		<Card className='w-full max-w-md mx-auto'>
			<CardHeader>
				<CardTitle className='text-xl font-bold text-center'>
					Telegram Login Available
				</CardTitle>
			</CardHeader>
			<CardContent className='space-y-4'>
				<div className='text-center'>
					<p className='text-sm text-gray-600 mb-4'>
						Hello, {telegramUser.first_name}! You can login with your Telegram
						account.
					</p>
					<Button
						onClick={handleTelegramLogin}
						disabled={isLoading}
						className='w-full'
					>
						{isLoading ? 'Logging in...' : 'Login with Telegram'}
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}
