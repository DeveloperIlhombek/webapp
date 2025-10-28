/* eslint-disable @typescript-eslint/no-explicit-any */
// app/telegram-debug/page.tsx - YANGILANGAN
'use client'

import { useEffect, useState } from 'react'

declare global {
	interface Window {
		Telegram: {
			WebApp: any
		}
	}
}

export default function TelegramDebugPage() {
	const [info, setInfo] = useState<string>('Loading...')
	const [user, setUser] = useState<any>(null)

	useEffect(() => {
		const initTelegram = () => {
			const tg = window.Telegram?.WebApp

			if (!tg) {
				setInfo('❌ Telegram WebApp topilmadi')
				return
			}

			// Telegram WebApp ni ishga tushirish
			tg.expand()
			tg.ready()

			// InitData ni olish
			const initData = tg.initData
			const initDataUnsafe = tg.initDataUnsafe
			const userData = initDataUnsafe?.user

			if (userData) {
				setUser(userData)
			}

			const result = {
				'🚀 STATUS': 'TELEGRAM WEBAPP ISHLAYAPTI! ✅',
				'👤 Foydalanuvchi': userData
					? {
							ID: userData.id,
							Ism: userData.first_name,
							Familiya: userData.last_name || "Yo'q",
							Username: userData.username || "Yo'q",
					  }
					: "Foydalanuvchi ma'lumotlari yo'q",
				'📡 InitData mavjudmi?': !!initData,
				'🔐 InitData uzunligi': initData?.length || 0,
				'📊 InitDataUnsafe': initDataUnsafe
					? Object.keys(initDataUnsafe)
					: "yo'q",
				'🌐 Platforma': tg.platform,
				'📱 Versiya': tg.version,
				'🎨 Theme': tg.themeParams,
				'📏 Viewport': tg.viewportHeight,
			}

			setInfo(JSON.stringify(result, null, 2))
		}

		// Script mavjudligini tekshirish
		if (window.Telegram?.WebApp) {
			initTelegram()
		} else {
			// Scriptni yuklash
			const script = document.createElement('script')
			script.src = 'https://telegram.org/js/telegram-web-app.js'
			script.async = true
			script.onload = () => {
				setTimeout(initTelegram, 100)
			}
			document.head.appendChild(script)
		}
	}, [])

	return (
		<div className='min-h-screen bg-liner-to-br from-blue-50 to-green-50 p-4'>
			<div className='max-w-2xl mx-auto'>
				<div className='bg-white rounded-2xl shadow-xl p-6 mt-8'>
					<h1 className='text-3xl font-bold text-center text-green-600 mb-2'>
						✅ Telegram WebApp Muvaffaqiyatli!
					</h1>

					{user && (
						<div className='bg-green-50 border border-green-200 rounded-lg p-4 mb-6'>
							<h2 className='text-xl font-semibold text-green-800 mb-2'>
								👤 Foydalanuvchi Malumotlari
							</h2>
							<p>
								<strong>ID:</strong> {user.id}
							</p>
							<p>
								<strong>Ism:</strong> {user.first_name}
							</p>
							<p>
								<strong>Familiya:</strong> {user.last_name || "Yo'q"}
							</p>
							<p>
								<strong>Username:</strong> @{user.username || "Yo'q"}
							</p>
						</div>
					)}

				</div>
			</div>
		</div>
	)
}
