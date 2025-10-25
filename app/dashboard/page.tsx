'use client'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { getTelegramUser } from '@/lib/telegram'
import { startTransition, useEffect, useState } from 'react'

export default function DashboardPage() {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [user, setUser] = useState<any>(null)

	useEffect(() => {
		const tgUser = getTelegramUser()
		startTransition(() => setUser(tgUser))
	}, [])

	if (!user)
		return <p className='text-center mt-10'>Loading Telegram user...</p>

	return (
		<main className='flex flex-col items-center justify-center min-h-screen p-6 space-y-4 bg-gray-50'>
			<h1 className='text-2xl font-bold'>👋 Salom, {user.first_name}</h1>

			<Card className='w-full max-w-md p-4 shadow-lg'>
				<h2 className='font-semibold mb-2'>🎯 XP Ballaringiz</h2>
				<Progress value={65} />
				<p className='text-sm text-gray-500 mt-1'>Level: Intermediate</p>
			</Card>

			<Card className='w-full max-w-md p-4 shadow-lg'>
				<h2 className='font-semibold mb-2'>📚 So‘nggi test natijalari</h2>
				<div className='space-y-2'>
					<div className='flex justify-between'>
						<span>Python asoslari</span>
						<Badge>85%</Badge>
					</div>
					<div className='flex justify-between'>
						<span>HTML test</span>
						<Badge>92%</Badge>
					</div>
				</div>
			</Card>

			<Card className='w-full max-w-md p-4 shadow-lg'>
				<h2 className='font-semibold mb-2'>📅 Davomat</h2>
				<div className='flex space-x-2'>
					<Badge color='green'>✅ 12 ta qatnashgan</Badge>
					<Badge color='red'>❌ 2 ta yo‘q</Badge>
					<Badge color='yellow'>⏰ 1 kechikkan</Badge>
				</div>
			</Card>
		</main>
	)
}
