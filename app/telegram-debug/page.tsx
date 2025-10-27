/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { startTransition, useEffect, useState } from 'react'

export default function TelegramDebugPage() {
	const [info, setInfo] = useState<string>('Loading...')

	useEffect(() => {
		if (typeof window === 'undefined') return

		const tg = (window as any).Telegram?.WebApp
		const userAgent = navigator.userAgent
		const location = window.location.href
		const referrer = document.referrer
		const isIframe = window.top !== window.self

		const result = {
			'✅ Telegram obyekt bormi?': !!tg,
			'🧩 Telegram.WebApp': tg ? Object.keys(tg) : 'yo‘q',
			'🌐 UserAgent': userAgent,
			'📍 URL': location,
			'↩️ Referrer': referrer || 'bo‘sh',
			'🪟 WebView ichidami?': isIframe
				? 'ha (iframe ichida)'
				: 'yo‘q (to‘g‘ridan-to‘g‘ri browser)',
		}
		startTransition(() => {
			setInfo(JSON.stringify(result, null, 2))
		})
	}, [])

	return (
		<div className='flex items-center justify-center h-screen bg-gray-100 p-4'>
			<pre className='bg-white p-4 rounded-lg text-sm text-left whitespace-pre-wrap break-all shadow-md w-full max-w-lg'>
				{info}
			</pre>
		</div>
	)
}
