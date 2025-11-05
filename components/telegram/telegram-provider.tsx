/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react'

interface TelegramContextType {
	isTelegramLoaded: boolean
	webApp: any
	user: any
}

const TelegramContext = createContext<TelegramContextType | undefined>(
	undefined
)

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
			document.head.appendChild(script)
		}
	}, [])

	return (
		<TelegramContext.Provider value={{ isTelegramLoaded, webApp, user }}>
			{children}
		</TelegramContext.Provider>
	)
}

export function useTelegram() {
	const context = useContext(TelegramContext)
	if (context === undefined) {
		throw new Error('useTelegram must be used within a TelegramProvider')
	}
	return context
}
