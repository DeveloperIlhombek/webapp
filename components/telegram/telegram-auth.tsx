'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTelegram } from '@/hooks/useTelegram'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function TelegramAuth() {
	const { isTelegramLoaded, user: telegramUser } = useTelegram()
	const { telegramLogin, isLoading, isAuthenticated } = useAuthStore()
	const router = useRouter()

	useEffect(() => {
		if (isAuthenticated) {
			router.push('/profile')
		}
	}, [isAuthenticated, router])

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
			// Login muvaffaqiyatli bo'lgandan so'ng, profile sahifasiga yo'naltiramiz
			router.push('/profile')
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
