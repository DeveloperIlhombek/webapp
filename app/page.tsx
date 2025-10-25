'use client'
import { expandWebApp, getTelegramUser } from '@/lib/telegram'
import { startTransition, useEffect, useState } from 'react'

export default function HomePage() {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [user, setUser] = useState<any>(null)

	useEffect(() => {
		expandWebApp()
		const tgUser = getTelegramUser()
		startTransition(() => {
			setUser(tgUser)
		})
	}, [])

	if (!user) return <p>Loading Telegram user...</p>

	return (
		<main className='flex flex-col items-center justify-center min-h-screen text-center'>
			<h1 className='text-2xl font-bold'>Salom, {user.first_name}! 👋</h1>
			<p className='text-gray-500'>Telegram ID: {user.id}</p>
		</main>
	)
}
