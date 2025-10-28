/* eslint-disable @typescript-eslint/no-explicit-any */
// app/telegram-debug/page.tsx - YANGI VERSIYA
'use client'

import { useEffect, useState } from 'react'

export default function TelegramDebugPage() {
	const [info, setInfo] = useState<string>('Loading...')
	const [scriptLoaded, setScriptLoaded] = useState(false)

	useEffect(() => {
		// Telegram scriptini qo'lda yuklash
		const script = document.createElement('script')
		script.src = 'https://telegram.org/js/telegram-web-app.js'
		script.async = true
		script.onload = () => {
			console.log('✅ Telegram script loaded!')
			setScriptLoaded(true)
			checkTelegram()
		}
		script.onerror = () => {
			console.log('❌ Telegram script load failed')
			checkTelegram()
		}
		document.head.appendChild(script)

		function checkTelegram() {
			const tg = (window as any).Telegram?.WebApp
			const userAgent = navigator.userAgent
			const location = window.location.href
			const referrer = document.referrer
			const isIframe = window.top !== window.self
			const urlParams = new URLSearchParams(window.location.search)

			const result = {
				'✅ Telegram obyekt bormi?': !!(window as any).Telegram,
				'✅ Telegram.WebApp bormi?': !!tg,
				'📦 Script yuklandimi?': scriptLoaded,
				'🧩 WebApp properties': tg ? Object.keys(tg) : 'yo‘q',
				'🌐 UserAgent': userAgent,
				'📍 URL': location,
				'🔗 URL Parametrlari': Object.fromEntries(urlParams),
				'↩️ Referrer': referrer || 'bo‘sh',
				'🪟 WebView ichidami?': isIframe ? 'ha' : 'yo‘q',
				'📱 InitData mavjudmi?': tg?.initData || 'yo‘q',
				'👤 User mavjudmi?': tg?.initDataUnsafe?.user ? 'ha' : 'yo‘q',
			}

			setInfo(JSON.stringify(result, null, 2))

			// Agar Telegram WebApp mavjud bo'lsa, uni ishga tushirish
			if (tg) {
				tg.expand()
				tg.ready()
				console.log('Telegram WebApp initialized!')
			}
		}

		// 2 soniyadan keyin ham tekshirish
		setTimeout(checkTelegram, 2000)
	}, [scriptLoaded])

	return (
		<div className='flex items-center justify-center min-h-screen bg-gray-100 p-4'>
			<div className='bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl'>
				<h1 className='text-2xl font-bold mb-4 text-center'>
					Telegram WebApp Debug
				</h1>
				<pre className='text-sm text-left whitespace-pre-wrap break-all'>
					{info}
				</pre>

				{/* Qo'shimcha tekshiruv tugmasi */}
				<button
					onClick={() => window.location.reload()}
					className='mt-4 bg-blue-500 text-white px-4 py-2 rounded w-full'
				>
					Yangilash
				</button>
			</div>
		</div>
	)
}
