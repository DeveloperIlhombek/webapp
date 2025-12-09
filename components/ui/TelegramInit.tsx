'use client'

import { useEffect, useState } from 'react'

export default function TelegramInit() {
	const [isInitialized, setIsInitialized] = useState(false)

	useEffect(() => {
		const initTelegram = () => {
			const tg = window.Telegram?.WebApp
			if (tg) {
				tg.ready()
				tg.expand()
				setIsInitialized(true)
				console.log('✅ Telegram WebApp yuritildi')
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

	return null // This component doesn't render anything
}
