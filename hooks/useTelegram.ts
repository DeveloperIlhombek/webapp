'use client'

import { TelegramContext } from '@/components/telegram/telegram-provider'
import { useContext } from 'react'

export function useTelegram() {
	const context = useContext(TelegramContext)
	if (context === undefined) {
		throw new Error('useTelegram must be used within a TelegramProvider')
	}
	return context
}
