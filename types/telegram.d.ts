// types/telegram.d.ts
declare global {
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
			query_id?: string
			auth_date?: string
			hash?: string
		}
		ready: () => void
		expand: () => void
		close: () => void
		platform: string
		version: string
		viewportHeight: number
		viewportStableHeight: number
		isExpanded: boolean
		themeParams: {
			bg_color?: string
			text_color?: string
			hint_color?: string
			link_color?: string
			button_color?: string
			button_text_color?: string
		}
		MainButton: {
			text: string
			color: string
			textColor: string
			isVisible: boolean
			isActive: boolean
			show: () => void
			hide: () => void
			onClick: (callback: () => void) => void
			offClick: (callback: () => void) => void
		}
		BackButton: {
			isVisible: boolean
			show: () => void
			hide: () => void
			onClick: (callback: () => void) => void
			offClick: (callback: () => void) => void
		}
	}

	interface Window {
		Telegram?: {
			WebApp: TelegramWebApp
		}
	}
}

// File module bo'lishi uchun export qilamiz
export {}
