'use client'

import { useEffect } from 'react'
import { useAuthStore } from '../lib/store/auth'

export default function TelegramInit() {
	const { telegramLogin } = useAuthStore()

	useEffect(() => {
		// Telegram Web App ni ishga tushiramiz
		if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
			window.Telegram.WebApp.ready()
			window.Telegram.WebApp.expand()

			const tg = window.Telegram.WebApp
			const user = tg.initDataUnsafe?.user

			if (user) {
				// Telegram foydalanuvchi ma'lumotlarini olamiz
				const telegramData = {
					telegram_id: user.id.toString(),
					first_name: user.first_name,
					last_name: user.last_name,
					username: user.username,
				}

				// Backendga telegram login so'rovini yuboramiz
				telegramLogin(telegramData).catch(console.error)
			}
		}
	}, [telegramLogin])

	return null
}
