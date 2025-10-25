declare global {
	interface TelegramUser {
		id: number
		is_bot?: boolean
		first_name: string
		last_name?: string
		username?: string
		language_code?: string
	}

	interface TelegramWebApp {
		initDataUnsafe?: {
			user?: TelegramUser
		}
		expand: () => void
	}

	interface Window {
		Telegram?: {
			WebApp?: TelegramWebApp
		}
	}
}

export function getTelegramWebApp() {
	if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
		return window.Telegram.WebApp
	}
	return null
}

export function expandWebApp() {
	const tg = getTelegramWebApp()
	if (tg) tg.expand()
}

export function getTelegramUser() {
	const tg = getTelegramWebApp()
	if (tg?.initDataUnsafe?.user) {
		return tg.initDataUnsafe.user
	}
	return null
}
// 8446903617:AAE9ULmrxvRuzus8061n1sz4lJrL_PPIFTU
