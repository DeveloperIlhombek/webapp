/* eslint-disable @typescript-eslint/no-explicit-any */
// components/TelegramAuth.tsx
'use client'

import { useEffect, useState } from 'react'

declare global {
	interface Window {
		Telegram?: {
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

interface AuthResponse {
	access_token: string
	token_type: string
	user: {
		id: string
		first_name: string
		last_name: string
		username?: string
		email?: string
		role: string
		telegram_id: string
		is_active: boolean
		created_at: string
	}
}

export default function TelegramAuth() {
	const [user, setUser] = useState<TelegramUser | null>(null)
	const [authResult, setAuthResult] = useState<AuthResponse | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string>('')

	const authenticateWithBackend = async (
		userData: TelegramUser,
		initDataUnsafe: any
	) => {
		try {
			const response = await fetch(
				'http://127.0.0.1:8000/api/auth/telegram/login',
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						telegram_id: userData.id.toString(),
						first_name: userData.first_name,
						last_name: userData.last_name || '',
						username: userData.username || '',
						auth_date: initDataUnsafe.auth_date,
						hash: initDataUnsafe.hash,
					}),
				}
			)

			if (!response.ok) {
				throw new Error(`Server error: ${response.status}`)
			}

			const result: AuthResponse = await response.json()
			setAuthResult(result)

			// Token va user ma'lumotlarini saqlash
			localStorage.setItem('access_token', result.access_token)
			localStorage.setItem('user', JSON.stringify(result.user))

			console.log('✅ Telegram authentication successful:', result)
		} catch (err) {
			console.error('❌ Authentication error:', err)
			setError(err instanceof Error ? err.message : 'Authentication failed')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		const initTelegram = () => {
			const tg = window.Telegram?.WebApp

			if (!tg) {
				setError('Telegram WebApp topilmadi')
				setLoading(false)
				return
			}

			// WebApp ni sozlash
			tg.expand()
			tg.ready()

			const initDataUnsafe = tg.initDataUnsafe
			const userData = initDataUnsafe?.user

			if (userData) {
				setUser(userData)
				authenticateWithBackend(userData, initDataUnsafe)
			} else {
				setError('Foydalanuvchi maʼlumotlari topilmadi')
				setLoading(false)
			}
		}

		if (window.Telegram?.WebApp) {
			initTelegram()
		} else {
			const script = document.createElement('script')
			script.src = 'https://telegram.org/js/telegram-web-app.js'
			script.async = true
			script.onload = () => setTimeout(initTelegram, 100)
			document.head.appendChild(script)
		}
	}, [])

	if (loading) {
		return <div>Telegram bilan autentifikatsiya...</div>
	}

	if (error) {
		return <div>Xatolik: {error}</div>
	}

	return (
		<div>
			{authResult ? (
				<div>
					<h1>Muvaffaqiyatli Kirish!</h1>
					<p>
						Foydalanuvchi: {authResult.user.first_name}{' '}
						{authResult.user.last_name}
					</p>
					<p>Role: {authResult.user.role}</p>
					<p>Telegram ID: {authResult.user.telegram_id}</p>
				</div>
			) : (
				<div>
					<h1>Telegram Foydalanuvchisi</h1>
					{user && (
						<div>
							<p>Ism: {user.first_name}</p>
							<p>Familiya: {user.last_name || "Yo'q"}</p>
							<p>Username: @{user.username || "Yo'q"}</p>
						</div>
					)}
				</div>
			)}
		</div>
	)
}
