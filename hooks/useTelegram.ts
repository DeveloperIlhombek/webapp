/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'

interface TelegramUser {
	id: number
	first_name: string
	last_name?: string
	username?: string
	language_code?: string
	is_premium?: boolean
}

interface TelegramWebApp {
	initData: string
	initDataUnsafe: {
		user?: TelegramUser
	}
	ready: () => void
	expand: () => void
	close: () => void
	MainButton: any
	BackButton: any
}

export const useTelegram = () => {
	const [telegram, setTelegram] = useState<TelegramWebApp | null>(null)
	const [user, setUser] = useState<TelegramUser | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const initTelegram = () => {
			try {
				if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
					const tg = window.Telegram.WebApp as TelegramWebApp

					console.log('🔹 Telegram WebApp detected')
					console.log('🔹 Init Data:', tg.initData)
					console.log('🔹 Unsafe User Data:', tg.initDataUnsafe?.user)

					// Telegram WebApp ni ishga tushirish
					tg.ready()
					tg.expand()

					setTelegram(tg)

					// User ma'lumotlarini olish
					if (tg.initDataUnsafe?.user) {
						setUser(tg.initDataUnsafe.user)
						console.log('✅ Telegram user data loaded:', tg.initDataUnsafe.user)
					} else {
						console.log('❌ No user data in initDataUnsafe')

						// Alternative: initData ni parse qilish
						try {
							const urlParams = new URLSearchParams(tg.initData)
							const userParam = urlParams.get('user')
							if (userParam) {
								const parsedUser = JSON.parse(userParam)
								setUser(parsedUser)
								console.log('✅ User data parsed from initData:', parsedUser)
							}
						} catch (parseError) {
							console.error('❌ Failed to parse initData:', parseError)
						}
					}
				} else {
					console.log('❌ Telegram WebApp not available')
				}
			} catch (error) {
				console.error('❌ Telegram initialization error:', error)
			} finally {
				setIsLoading(false)
			}
		}

		// Telegram skripti yuklanganligini tekshirish
		const checkTelegram = () => {
			if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
				initTelegram()
			} else {
				// Agar skript hali yuklanmagan bo'lsa, kutish
				setTimeout(checkTelegram, 100)
			}
		}

		// Dastlabki tekshirish
		checkTelegram()

		// Qo'shimcha: window load event ini kutish
		window.addEventListener('load', checkTelegram)

		return () => {
			window.removeEventListener('load', checkTelegram)
		}
	}, [])

	return {
		telegram,
		user,
		isLoading,
		isTelegramAvailable: !!telegram,
	}
}
