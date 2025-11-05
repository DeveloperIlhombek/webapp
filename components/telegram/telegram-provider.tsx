/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { createContext, ReactNode, useEffect, useState } from 'react'

interface TelegramContextType {
	isTelegramLoaded: boolean
	webApp: any
	user: any
}

export const TelegramContext = createContext<TelegramContextType>({
	isTelegramLoaded: false,
	webApp: null,
	user: null,
})

export function TelegramProvider({ children }: { children: ReactNode }) {
	const [isTelegramLoaded, setIsTelegramLoaded] = useState(false)
	const [webApp, setWebApp] = useState<any>(null)
	const [user, setUser] = useState<any>(null)

	useEffect(() => {
		const initTelegram = () => {
			const tg = window.Telegram?.WebApp
			if (tg) {
				tg.ready()
				tg.expand()
				setWebApp(tg)
				setUser(tg.initDataUnsafe?.user)
				setIsTelegramLoaded(true)
				console.log('✅ Telegram WebApp initialized in provider')
			}
		}

		if (window.Telegram?.WebApp) {
			initTelegram()
		} else {
			const script = document.createElement('script')
			script.src = 'https://telegram.org/js/telegram-web-app.js'
			script.async = true
			script.onload = () => {
				setTimeout(initTelegram, 100)
			}
			script.onerror = () => {
				console.error('❌ Failed to load Telegram script')
			}
			document.head.appendChild(script)
		}
	}, [])

	return (
		<TelegramContext.Provider value={{ isTelegramLoaded, webApp, user }}>
			{children}
		</TelegramContext.Provider>
	)
}
