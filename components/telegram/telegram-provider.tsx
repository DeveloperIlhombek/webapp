/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { createContext, ReactNode, useEffect, useState } from 'react'

interface TelegramContextType {
	isTelegramLoaded: boolean
	webApp: any
	user: any
	initData: string
}

export const TelegramContext = createContext<TelegramContextType>({
	isTelegramLoaded: false,
	webApp: null,
	user: null,
	initData: '',
})

export function TelegramProvider({ children }: { children: ReactNode }) {
	const [isTelegramLoaded, setIsTelegramLoaded] = useState(false)
	const [webApp, setWebApp] = useState<any>(null)
	const [user, setUser] = useState<any>(null)
	const [initData, setInitData] = useState<string>('')

	useEffect(() => {
		const initTelegram = () => {
			const tg = window.Telegram?.WebApp

			if (tg) {
				tg.ready()
				tg.expand()

				// BackButton ni tekshirish va sozlash
				if (tg.BackButton) {
					tg.BackButton.show()
					tg.BackButton.onClick(() => {
						window.history.back()
					})
				}

				setWebApp(tg)
				setUser(tg.initDataUnsafe?.user)
				setInitData(tg.initData || '')
				setIsTelegramLoaded(true)
			} else {
				console.log('❌ Telegram WebApp not found')
				setIsTelegramLoaded(true) // Telegram bo'lmasa ham loadingni to'xtatamiz
			}
		}

		// Telegram script yuklanganligini tekshirish
		if (window.Telegram?.WebApp) {
			initTelegram()
		} else {

			const script = document.createElement('script')
			script.src = 'https://telegram.org/js/telegram-web-app.js'
			script.async = true

			script.onload = () => {
				setTimeout(() => {
					initTelegram()
				}, 500)
			}

			script.onerror = error => {
				console.error('❌ Failed to load Telegram script:', error)
				setIsTelegramLoaded(true) // Xatolik bo'lsa ham loadingni to'xtatamiz
			}

			document.head.appendChild(script)
		}
	}, [])

	return (
		<TelegramContext.Provider
			value={{ isTelegramLoaded, webApp, user, initData }}
		>
			{children}
		</TelegramContext.Provider>
	)
}
