/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '../lib/store/auth'

export default function TelegramInit() {
	const { telegramLogin, user } = useAuthStore()
	const [telegramData, setTelegramData] = useState<any>(null)

	useEffect(() => {
		const initializeTelegram = async () => {
			try {
				// Telegram Web App mavjudligini tekshirish
				if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
					const tg = window.Telegram.WebApp

					// Telegram WebApp ni ishga tushirish
					tg.ready()
					tg.expand()

					console.log('🔹 Telegram WebApp initialized')
					console.log('🔹 Init data:', tg.initData)
					console.log('🔹 User data:', tg.initDataUnsafe?.user)

					// Telegram user ma'lumotlarini olish
					const tgUser = tg.initDataUnsafe?.user

					if (tgUser) {
						const userData = {
							telegram_id: tgUser.id.toString(),
							first_name: tgUser.first_name || '',
							last_name: tgUser.last_name || '',
							username: tgUser.username || `user_${tgUser.id}`,
						}

						console.log('🔹 Prepared Telegram data:', userData)
						setTelegramData(userData)

						// Agar user hali login qilmagan bo'lsa
						if (!user) {
							console.log('🔹 Attempting Telegram login...')
							try {
								await telegramLogin(userData)
								console.log('✅ Telegram login successful')
							} catch (error) {
								console.error('❌ Telegram login failed:', error)

								// Xatoni foydalanuvchiga ko'rsatish
								if (error instanceof Error) {
									alert(`Login failed: ${error.message}`)
								}
							}
						}
					} else {
						console.log('❌ No Telegram user data found')
					}
				} else {
					console.log(
						'❌ Telegram WebApp not detected - running in regular browser'
					)
				}
			} catch (error) {
				console.error('❌ Telegram initialization error:', error)
			}
		}

		initializeTelegram()
	}, [telegramLogin, user])

	// Debug ma'lumotlarni ko'rsatish
	if (process.env.NODE_ENV === 'development' && telegramData) {
		return (
			<div className='mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
				<h3 className='font-semibold text-blue-800 mb-2'>Telegram Data:</h3>
				<pre className='text-xs text-blue-700 overflow-auto'>
					{JSON.stringify(telegramData, null, 2)}
				</pre>
			</div>
		)
	}

	return null
}
