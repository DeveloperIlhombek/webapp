'use client'

import { expandWebApp, getTelegramUser } from '@/lib/telegram'
import { startTransition, useEffect, useState } from 'react'

interface TelegramUser {
	id: number
	first_name: string
	last_name?: string
	username?: string
}

export default function HomePage() {
	const [user, setUser] = useState<TelegramUser | null>(null)

	useEffect(() => {
		// Telegram WebApp’ni kengaytirish
		expandWebApp()

		// User ma’lumotlarini olish (faqat clientda)
		const tgUser = getTelegramUser()
		startTransition(() => {
			setUser(tgUser)
		})
	}, [])

	if (!user) {
		return (
			<div className='flex h-screen items-center justify-center text-lg font-semibold'>
				Loading Telegram user...
			</div>
		)
	}

	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6'>
			<h1 className='text-2xl font-bold mb-4'>
				👋 Welcome, {user.first_name}!
			</h1>
			{user.username && <p className='text-gray-600'>@{user.username}</p>}
			<p className='mt-2 text-sm text-gray-500'>Your Telegram ID: {user.id}</p>

			<button
				onClick={() => alert(`Hello ${user.first_name}!`)}
				className='mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition'
			>
				Tap me
			</button>
		</div>
	)
}
