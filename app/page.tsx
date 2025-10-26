'use client'

import { useEffect, useState } from 'react'

export default function HomePage() {
	const [status, setStatus] = useState('Tekshirilmoqda...')

	useEffect(() => {
		if (typeof window === 'undefined') return

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const tg = (window as any).Telegram?.WebApp
		console.log('Telegram obyekt:', tg)

		if (!tg) {
			setTimeout(() => {
				setStatus('❌ Telegram WebApp topilmadi (Telegram ichida ochilmadi)')
			}, 0)
			return
		}

		if (tg.initDataUnsafe?.user) {
			console.log('User:', tg.initDataUnsafe.user)
			setTimeout(() => {
				setStatus(
					'✅ Telegram user topildi: ' + tg.initDataUnsafe.user.first_name
				)
			}, 0)
		} else {
			console.log('initDataUnsafe:', tg.initDataUnsafe)
			setTimeout(() => {
				setStatus('⚠️ Telegram WebApp bor, lekin user maʼlumotlari yo‘q')
			}, 0)
		}
	}, [])

	return (
		<div className='flex items-center justify-center h-screen text-center'>
			<p className='text-lg font-semibold'>{status}</p>
		</div>
	)
}
