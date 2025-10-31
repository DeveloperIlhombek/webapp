'use client'

import { useEffect } from 'react'
import { useTelegram } from '../hooks/useTelegram'
import { useAuthStore } from '../lib/store/auth'

export default function TelegramInit() {
	const { telegramLogin, user: authUser } = useAuthStore()
	const { user: telegramUser, isLoading, isTelegramAvailable } = useTelegram()

	useEffect(() => {
		const loginWithTelegram = async () => {
			if (telegramUser && !authUser) {
				console.log('🔹 Starting Telegram login process...')

				const telegramData = {
					telegram_id: telegramUser.id.toString(),
					first_name: telegramUser.first_name,
					last_name: telegramUser.last_name || '',
					username: telegramUser.username || `user_${telegramUser.id}`,
				}

				console.log('🔹 Prepared Telegram data:', telegramData)

				try {
					await telegramLogin(telegramData)
					console.log('✅ Telegram login successful')
				} catch (error) {
					console.error('❌ Telegram login failed:', error)
				}
			}
		}

		if (!isLoading && telegramUser) {
			loginWithTelegram()
		}
	}, [telegramUser, authUser, isLoading, telegramLogin])

	// Loading holati
	if (isLoading && isTelegramAvailable) {
		return (
			<div className='mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center'>
						<div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2'></div>
						<span className='text-blue-700'>Loading Telegram data...</span>
					</div>
				</div>
			</div>
		)
	}

	// Telegram mavjud emas
	if (!isTelegramAvailable && !isLoading) {
		return (
			<div className='mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
				<div className='text-yellow-700'>
					<strong>Note:</strong> Running in regular browser mode.
					{typeof window !== 'undefined' &&
						!window.Telegram &&
						' Telegram WebApp not detected.'}
				</div>
			</div>
		)
	}

	// Debug ma'lumotlari
	if (process.env.NODE_ENV === 'development' && telegramUser) {
		return (
			<div className='mb-4 p-4 bg-green-50 border border-green-200 rounded-lg'>
				<h3 className='font-semibold text-green-800 mb-2'>
					✅ Telegram Data Loaded:
				</h3>
				<div className='text-xs text-green-700 space-y-1'>
					<div>
						<strong>User ID:</strong> {telegramUser.id}
					</div>
					<div>
						<strong>Name:</strong> {telegramUser.first_name}{' '}
						{telegramUser.last_name}
					</div>
					<div>
						<strong>Username:</strong> {telegramUser.username || 'N/A'}
					</div>
					<div>
						<strong>Language:</strong> {telegramUser.language_code || 'N/A'}
					</div>
				</div>
			</div>
		)
	}

	return null
}
