// types/telegram.d.ts
interface TelegramUser {
	id: number
	first_name: string
	last_name?: string
	username?: string
	language_code?: string
	is_premium?: boolean
}

interface TelegramWebApp {
	initDataUnsafe?: {
		user?: TelegramUser
	}
	expand: () => void
}

interface TelegramWindow extends Window {
	Telegram?: {
		WebApp?: TelegramWebApp
	}
}

declare const window: TelegramWindow
