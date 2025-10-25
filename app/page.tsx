'use client'

import Image from 'next/image'
import { startTransition, useEffect, useState } from 'react'

interface TelegramUser {
	id: number
	first_name: string
	last_name?: string
	username?: string
	photo_url?: string
}

export default function HomePage() {
	const [user, setUser] = useState<TelegramUser | null>(null)

	useEffect(() => {
		if (typeof window !== 'undefined') {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const tg = (window as any).Telegram?.WebApp
			console.log('✅ Telegram WebApp obyekt:', tg)

			if (tg) {
				tg.ready()
				tg.expand()
				console.log('🧩 initDataUnsafe:', tg.initDataUnsafe)
				console.log('👤 Telegram foydalanuvchi:', tg.initDataUnsafe?.user)
				startTransition(() => {
					setUser(tg.initDataUnsafe?.user || null)
				})
			} else {
				console.warn('❌ Telegram WebApp topilmadi!')
			}
		}
	}, [])

	if (!user) {
		return (
			<div className='flex h-screen items-center justify-center text-lg font-semibold'>
				Loading Telegram user...
			</div>
		)
	}

	return (
		<div className='flex flex-col items-center justify-center h-screen'>
			<h1 className='text-2xl font-bold mb-4'>👋 Salom, {user.first_name}!</h1>
			<p className='text-gray-700'>Telegram ID: {user.id}</p>
			{user.username && <p>@{user.username}</p>}
			{user.photo_url && (
				<Image
					src={user.photo_url}
					alt={user.first_name}
					className='mt-4 rounded-full w-24 h-24'
				/>
			)}
		</div>
	)
}
