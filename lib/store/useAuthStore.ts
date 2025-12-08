/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { create } from 'zustand'

export interface User {
	id: string
	email: string
	username: string
	full_name?: string
	telegram_id?: string
}

interface AuthState {
	user: User | null
	isAuthenticated: boolean
	isLoading: boolean
	error: string | null
	login: (username: string, password: string) => Promise<void>
	telegramLogin: (telegramData: any) => Promise<void>
	register: (userData: any) => Promise<void>
	logout: () => void
	checkAuth: () => Promise<void>
	clearError: () => void
}

const API_URL =
	process.env.NEXT_PUBLIC_API_URL ||
	'https://helminthoid-clumsily-xuan.ngrok-free.dev'

export const useAuthStore = create<AuthState>(set => ({
	user: null,
	isAuthenticated: false,
	isLoading: false,
	error: null,

	login: async (username: string, password: string) => {
		set({ isLoading: true, error: null })

		try {
			const response = await fetch(`${API_URL}/api/auth/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password }),
			})

			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(errorData.detail || 'Login failed')
			}

			const data = await response.json()

			if (!data.access_token) {
				throw new Error('Token not found')
			}

			localStorage.setItem('access_token', data.access_token)

			if (data.refresh_token) {
				localStorage.setItem('refresh_token', data.refresh_token)
			}

			// User ma'lumotlarini olish
			const userResponse = await fetch(`${API_URL}/api/users/me`, {
				headers: {
					Authorization: `Bearer ${data.access_token}`,
					'Content-Type': 'application/json',
				},
			})

			if (userResponse.ok) {
				// Content-Type tekshirish
				const contentType = userResponse.headers.get('content-type')
				if (contentType && contentType.includes('application/json')) {
					const userData = await userResponse.json()
					set({ user: userData, isAuthenticated: true, isLoading: false })
				} else {
					// Agar JSON bo'lmasa, HTML xato sahifasi qaytgan bo'lishi mumkin
					// Bunda user ni null qilib, lekin isAuthenticated ni true qilamiz
					set({ user: null, isAuthenticated: true, isLoading: false })
				}
			} else {
				set({ isAuthenticated: true, isLoading: false })
			}
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Login failed'
			set({ isLoading: false, error: errorMessage })
			throw error
		}
	},

	telegramLogin: async (telegramData: any) => {
		set({ isLoading: true, error: null })

		try {
			const backendTelegramData = {
				id: String(telegramData.id),
				first_name: telegramData.first_name,
				last_name: telegramData.last_name || null,
				username: telegramData.username || null,
				language_code: telegramData.language_code || null,
			}

			const response = await fetch(`${API_URL}/api/auth/telegram-login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				body: JSON.stringify(backendTelegramData),
			})

			const contentType = response.headers.get('content-type')

			if (!response.ok) {
				let errorData: any
				if (contentType?.includes('application/json')) {
					errorData = await response.json()
					throw new Error(
						errorData.detail || `Telegram login failed: ${response.status}`
					)
				} else {
					const text = await response.text()
					throw new Error(
						`Server error (${response.status}): ${text.slice(0, 100)}`
					)
				}
			}

			if (!contentType?.includes('application/json')) {
				const text = await response.text()
				throw new Error(`Expected JSON but got: ${text.slice(0, 100)}`)
			}

			const data = await response.json()

			if (!data.access_token) {
				throw new Error('No access token received')
			}

			// Tokenlarni saqlash
			localStorage.setItem('access_token', data.access_token)
			if (data.refresh_token) {
				localStorage.setItem('refresh_token', data.refresh_token)
			}

			// User ma'lumotlarini olish
			const userResponse = await fetch(`${API_URL}/api/users/me`, {
				headers: {
					Authorization: `Bearer ${data.access_token}`,
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
			})

			if (userResponse.ok) {
				const userData = await userResponse.json()
				set({
					user: userData,
					isAuthenticated: true,
					isLoading: false,
					error: null,
				})
			} else {
				// Agar user ma'lumotlari olinmasa, tokendan chiqaramiz
				const userFromToken = extractUserFromToken(data.access_token)
				set({
					user: userFromToken,
					isAuthenticated: true,
					isLoading: false,
					error: null,
				})
			}
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Telegram login failed'
			set({
				isLoading: false,
				error: errorMessage,
			})
			throw error
		}
	},

	register: async (userData: any) => {
		set({ error: null, isLoading: true })
		try {
			const response = await fetch(`${API_URL}/api/auth/register`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(userData),
			})

			const contentType = response.headers.get('content-type')

			if (!response.ok) {
				let errorData
				if (contentType?.includes('application/json')) {
					errorData = await response.json()
				} else {
					const text = await response.text()
					throw new Error(`Server error: ${response.status} ${text}`)
				}
				throw new Error(errorData.detail || 'Registration failed')
			}

			if (!contentType?.includes('application/json')) {
				const text = await response.text()
				throw new Error(`Server json qaytarmqyapti : ${text}`)
			}

			const result = await response.json()
			set({ isLoading: false })
			return result
		} catch (error) {
			console.error('❌ Registration error:', error)
			set({
				isLoading: false,
				error: error instanceof Error ? error.message : 'Registration failed',
			})
			throw error
		}
	},

	logout: () => {
		console.log('🚪 Logging out...')
		localStorage.removeItem('access_token')
		localStorage.removeItem('refresh_token')
		set({
			user: null,
			isAuthenticated: false,
			isLoading: false,
			error: null,
		})
	},

	checkAuth: async () => {
		const token = localStorage.getItem('access_token')

		if (!token) {
			set({ user: null, isAuthenticated: false, isLoading: false })
			return
		}

		set({ isLoading: true })

		try {
			const response = await fetch(`${API_URL}/api/users/me`, {
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			})

			if (response.ok) {
				const contentType = response.headers.get('content-type')
				if (contentType && contentType.includes('application/json')) {
					const user = await response.json()
					set({ user, isAuthenticated: true, isLoading: false })
				} else {
					// Agar JSON bo'lmasa, user ni null qilib qo'yamiz, lekin token borligi uchun isAuthenticated true
					set({ user: null, isAuthenticated: true, isLoading: false })
				}
			} else {
				localStorage.removeItem('access_token')
				localStorage.removeItem('refresh_token')
				set({ user: null, isAuthenticated: false, isLoading: false })
			}
		} catch {
			localStorage.removeItem('access_token')
			localStorage.removeItem('refresh_token')
			set({ user: null, isAuthenticated: false, isLoading: false })
		}
	},

	clearError: () => set({ error: null }),
}))
function extractUserFromToken(token: string): User | null {
	try {
		const base64Url = token.split('.')[1]
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split('')
				.map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
				.join('')
		)

		const payload = JSON.parse(jsonPayload)

		return {
			id: payload.id || 0,
			email: payload.email || '',
			username: payload.username || payload.sub || '',
			full_name: payload.full_name || payload.name || undefined,
			telegram_id: payload.telegram_id || undefined,
		}
	} catch {
		return null
	}
}
