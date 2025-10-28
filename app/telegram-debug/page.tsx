/* eslint-disable @typescript-eslint/no-explicit-any */
// app/telegram/page.tsx - PRODUCTION READY
'use client'

import { useEffect, useState } from 'react'

declare global {
	interface Window {
		Telegram: {
			WebApp: any
		}
	}
}

interface TelegramUser {
	id: number
	first_name: string
	last_name?: string
	username?: string
	language_code?: string
}

export default function TelegramApp() {
	const [user, setUser] = useState<TelegramUser | null>(() => {
		if (typeof window !== 'undefined') {
			const tg = window.Telegram?.WebApp
			return tg?.initDataUnsafe?.user || null
		}
		return null
	})
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const tg = window.Telegram?.WebApp

		if (tg) {
			// WebApp ni sozlash
			tg.expand()
			tg.ready()
			tg.enableClosingConfirmation()

			// Theme change event
			tg.onEvent('themeChanged', () => {
				document.documentElement.style.setProperty(
					'--tg-theme-bg-color',
					tg.themeParams.bg_color
				)
			})

			// Back button
			tg.BackButton.show()
			tg.BackButton.onClick(() => {
				tg.close()
			})
		}

		// Set loading to false after setup or if no WebApp
		setTimeout(() => setIsLoading(false), 0)
	}, [])

	const sendDataToBot = () => {
		const tg = window.Telegram?.WebApp
		if (tg) {
			tg.sendData(
				JSON.stringify({
					action: 'button_click',
					user_id: user?.id,
					timestamp: Date.now(),
				})
			)
			tg.showAlert("Ma'lumot botga yuborildi! ✅")
		}
	}

	if (isLoading) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-liner-to-br from-blue-500 to-purple-600'>
				<div className='text-white text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4'></div>
					<p>Yuklanmoqda...</p>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-liner-to-br from-blue-500 to-purple-600 text-white'>
			{/* Header */}
			<header className='bg-white/10 backdrop-blur-lg p-4 sticky top-0'>
				<div className='max-w-4xl mx-auto flex justify-between items-center'>
					<h1 className='text-xl font-bold'>Mening WebAppim</h1>
					{user && (
						<div className='text-right'>
							<p className='font-semibold'>{user.first_name}</p>
							<p className='text-sm opacity-80'>@{user.username}</p>
						</div>
					)}
				</div>
			</header>

			{/* Main Content */}
			<main className='p-4 max-w-4xl mx-auto'>
				{/* Welcome Section */}
				<div className='bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 text-center'>
					<h2 className='text-2xl font-bold mb-2'>Xush kelibsiz! 👋</h2>
					<p className='opacity-90'>
						Telegram WebApp ga muvaffaqiyatli ulandingiz
					</p>
				</div>

				{/* User Info Card */}
				{user && (
					<div className='bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6'>
						<h3 className='text-xl font-bold mb-4'>👤 Profil Malumotlari</h3>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div>
								<p className='text-sm opacity-80'>ID</p>
								<p className='font-semibold'>{user.id}</p>
							</div>
							<div>
								<p className='text-sm opacity-80'>Ism</p>
								<p className='font-semibold'>{user.first_name}</p>
							</div>
							<div>
								<p className='text-sm opacity-80'>Familiya</p>
								<p className='font-semibold'>
									{user.last_name || 'Mavjud emas'}
								</p>
							</div>
							<div>
								<p className='text-sm opacity-80'>Username</p>
								<p className='font-semibold'>
									@{user.username || 'Mavjud emas'}
								</p>
							</div>
						</div>
					</div>
				)}

				{/* Actions */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
					<button
						onClick={sendDataToBot}
						className='bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-2xl font-semibold transition-colors'
					>
						📨 Botga Xabar Yuborish
					</button>
					<button
						onClick={() =>
							window.Telegram?.WebApp.showConfirm(
								'Haqiqatan ham chiqmoqchimisiz?',
								() => window.Telegram?.WebApp.close()
							)
						}
						className='bg-red-500 hover:bg-red-600 text-white py-4 px-6 rounded-2xl font-semibold transition-colors'
					>
						❌ Dasturdan Chiqish
					</button>
				</div>

				{/* Features */}
				<div className='bg-white/10 backdrop-blur-lg rounded-2xl p-6'>
					<h3 className='text-xl font-bold mb-4'>✨ Imkoniyatlar</h3>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
						<div className='text-center p-4 bg-white/5 rounded-xl'>
							<div className='text-2xl mb-2'>🔐</div>
							<p>Avtomatik login</p>
						</div>
						<div className='text-center p-4 bg-white/5 rounded-xl'>
							<div className='text-2xl mb-2'>📱</div>
							<p>Mobile optimized</p>
						</div>
						<div className='text-center p-4 bg-white/5 rounded-xl'>
							<div className='text-2xl mb-2'>⚡</div>
							<p>Tez va yengil</p>
						</div>
					</div>
				</div>
			</main>

			{/* Footer */}
			<footer className='p-4 text-center opacity-70'>
				<p>Powered by Telegram WebApp & Next.js</p>
			</footer>
		</div>
	)
}
