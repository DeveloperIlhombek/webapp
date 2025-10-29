/* eslint-disable @typescript-eslint/no-explicit-any */
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
	const [status, setStatus] = useState<string>('')

	useEffect(() => {
		const initTelegram = async () => {
			const tg = window.Telegram?.WebApp

			if (!tg) {
				setInfo('❌ Telegram WebApp topilmadi')
				return
			}

			tg.expand()
			tg.ready()

			const initData = tg.initData
			const initDataUnsafe = tg.initDataUnsafe
			const userData = initDataUnsafe?.user

			if (userData) {
				setUser(userData)
				setStatus('📡 Ma’lumot yuborilmoqda...')
			} else {
				setInfo('❌ Foydalanuvchi ma’lumotlari yo‘q')
				return
			}

			// ✅ Backendga jo‘natamiz
			try {
				const res = await fetch(
					'https://helminthoid-clumsily-xuan.ngrok-free.dev/api/telegram/verify',
					{
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							id: userData.id,
							first_name: userData.first_name,
							last_name: userData.last_name,
							username: userData.username,
							auth_date: initDataUnsafe.auth_date,
							hash: initDataUnsafe.hash,
						}),
					}
				)

				const result = await res.json()

				if (res.ok) {
					setStatus('✅ Ro‘yxatdan o‘tish muvaffaqiyatli!')
					localStorage.setItem('token', result.access_token)
					console.log('Auth javobi:', result)
				} else {
					setStatus(`❌ Xatolik: ${result.detail || 'Server xatosi'}`)
				}
			} catch (error) {
				console.error('❌ Server bilan aloqa yo‘q:', error)
				setStatus('❌ Server bilan aloqa yo‘q')
			}

			// 👁 Ma’lumotlarni chiqarish
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

		if (window.Telegram?.WebApp) {
			initTelegram()
		} else {
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

					{status && (
						<p className='text-center mb-4 text-blue-600 font-medium'>
							{status}
						</p>
					)}

					{user && (
						<div className='bg-green-50 border border-green-200 rounded-lg p-4 mb-6'>
							<h2 className='text-xl font-semibold text-green-800 mb-2'>
								👤 Foydalanuvchi Ma’lumotlari
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

					<pre className='bg-gray-100 p-3 rounded-lg text-sm overflow-auto'>
						{info}
					</pre>
				</div>
			</div>
		</div>
	)
}
