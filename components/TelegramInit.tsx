'use client'

import { useEffect } from 'react'
import { useTelegram } from '../hooks/useTelegram'
import { useAuthStore } from '../lib/store/auth'

export default function TelegramInit() {
	const { telegramLogin, user: authUser } = useAuthStore()
	const { user: telegramUser, isLoading, isTelegramAvailable } = useTelegram()

	useEffect(() => {
		if (telegramUser && !authUser && isTelegramAvailable) {
			const telegramData = {
				telegram_id: telegramUser.id.toString(),
				first_name: telegramUser.first_name,
				last_name: telegramUser.last_name || '',
				username: telegramUser.username || `user_${telegramUser.id}`,
			}

			telegramLogin(telegramData).catch(console.error)
		}
	}, [telegramUser, authUser, isTelegramAvailable, telegramLogin])

	if (isLoading && isTelegramAvailable) {
		return (
			<div className='p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4'>
				<div className='flex items-center'>
					<div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2'></div>
					<span className='text-blue-700'>Loading Telegram...</span>
				</div>
			</div>
		)
	}

	return null
}
