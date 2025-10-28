/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/telegram.ts - Ishonchli helper
export function initTelegramWebApp() {
	return new Promise(resolve => {
		const tg = (window as any).Telegram?.WebApp

		if (tg) {
			tg.expand()
			tg.ready()
			resolve(tg)
			return
		}

		// Script yo'q bo'lsa, yuklash
		const script = document.createElement('script')
		script.src = 'https://telegram.org/js/telegram-web-app.js'
		script.async = true
		script.onload = () => {
			const loadedTg = (window as any).Telegram.WebApp
			loadedTg.expand()
			loadedTg.ready()
			resolve(loadedTg)
		}
		document.head.appendChild(script)
	})
}
