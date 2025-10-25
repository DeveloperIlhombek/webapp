// src/lib/telegram.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const tg = (window as any)?.Telegram?.WebApp

export const getTelegramUser = () => {
	if (!tg) return null
	return tg.initDataUnsafe?.user || null
}

export const expandWebApp = () => {
	if (tg) tg.expand()
}
