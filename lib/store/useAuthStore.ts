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

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	isAuthenticated: false,
	isLoading: false,
	error: null,

	login: async (username: string, password: string) => {
		set({ isLoading: true, error: null })
		try {
			console.log('🔄 Login attempt:', { username })

			const response = await fetch(`${API_URL}/api/auth/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username, password }),
			})

			// Response content type ni tekshiramiz
			const contentType = response.headers.get('content-type')
			console.log('📨 Response content-type:', contentType)

			if (!response.ok) {
				let errorData
				if (contentType?.includes('application/json')) {
					errorData = await response.json()
				} else {
					const text = await response.text()
					console.error('❌ Non-JSON error response:', text.substring(0, 200))
					throw new Error(
						`Server error: ${response.status} ${response.statusText}`
					)
				}
				throw new Error(errorData.detail || `Login failed: ${response.status}`)
			}

			// JSON response ni o'qishdan oldin tekshiramiz
			if (!contentType?.includes('application/json')) {
				const text = await response.text()
				console.error('❌ Expected JSON but got:', text.substring(0, 200))
				throw new Error('Server returned non-JSON response')
			}

			const data = await response.json()
			console.log('✅ Login successful, tokens received')

			if (!data.access_token) {
				throw new Error('No access token in response')
			}

			localStorage.setItem('access_token', data.access_token)
			if (data.refresh_token) {
				localStorage.setItem('refresh_token', data.refresh_token)
			}

			// User ma'lumotlarini olish
			console.log('🔄 Fetching user data...')
			const userResponse = await fetch(`${API_URL}/api/users/me`, {
				headers: {
					Authorization: `Bearer ${data.access_token}`,
					'Content-Type': 'application/json',
				},
			})

			if (userResponse.ok) {
				const userData = await userResponse.json()
				console.log('✅ User data received:', userData)
				set({
					user: userData,
					isAuthenticated: true,
					isLoading: false,
					error: null,
				})
			} else {
				console.error('❌ Failed to get user data:', userResponse.status)
				// User ma'lumotlari olinmasa ham, token borligi uchun authenticated deb hisoblaymiz
				set({ isAuthenticated: true, isLoading: false, error: null })
			}
		} catch (error) {
			console.error('❌ Login error:', error)
			const errorMessage =
				error instanceof Error ? error.message : 'Login failed'
			set({
				isLoading: false,
				error: errorMessage,
			})
			throw error
		}
	},

	telegramLogin: async (telegramData: any) => {
		set({ isLoading: true, error: null })
		try {
			console.log('🔄 Telegram login attempt:', telegramData)
			const controller = new AbortController()
			const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 soniya

			// Backendga mos formatda ma'lumot yuborish
			const backendTelegramData = {
				id: String(telegramData.id), // string formatda
				first_name: telegramData.first_name,
				last_name: telegramData.last_name || null,
				username: telegramData.username || null,
				language_code: telegramData.language_code || null,
			}

			console.log('📤 Sending to:', `${API_URL}/api/auth/telegram-login`)

			const response = await fetch(`${API_URL}/api/auth/telegram-login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(backendTelegramData),
				signal: controller.signal,
			})
			clearTimeout(timeoutId)

			const contentType = response.headers.get('content-type')
			console.log('📨 Response status:', response.status)
			console.log('📨 Content-Type:', contentType)

			if (!response.ok) {
				const errorText = await response.text()
				console.error('❌ Server error response:', errorText)

				// Agar HTML qaytarsa
				if (errorText.includes('<!DOCTYPE') || errorText.includes('<html')) {
					throw new Error(
						'Server returned HTML instead of JSON. Please check backend configuration.'
					)
				}

				try {
					const errorData = JSON.parse(errorText)
					throw new Error(
						errorData.detail || `Server error: ${response.status}`
					)
				} catch {
					throw new Error(
						`Server error: ${response.status} - ${errorText.substring(0, 100)}`
					)
				}
			}

			if (!contentType?.includes('application/json')) {
				const text = await response.text()
				console.error('❌ Expected JSON but got:', text.substring(0, 200))
				throw new Error('Server returned non-JSON response')
			}

			const data = await response.json()
			console.log('✅ Telegram login successful, tokens received')

			if (!data.access_token) {
				throw new Error('No access token in response')
			}

			localStorage.setItem('access_token', data.access_token)
			if (data.refresh_token) {
				localStorage.setItem('refresh_token', data.refresh_token)
			}

			// User ma'lumotlarini olish
			console.log('🔄 Fetching user data...')
			const userResponse = await fetch(`${API_URL}/api/users/me`, {
				headers: {
					Authorization: `Bearer ${data.access_token}`,
					'Content-Type': 'application/json',
				},
			})

			if (userResponse.ok) {
				const userData = await userResponse.json()
				console.log('✅ User data received:', userData)
				set({
					user: userData,
					isAuthenticated: true,
					isLoading: false,
					error: null,
				})
			} else {
				console.error('❌ Failed to get user data:', userResponse.status)
				set({ isAuthenticated: true, isLoading: false, error: null })
			}
		} catch (error) {
			console.error('❌ Telegram login error:', error)
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
			console.log('🔄 Registration attempt:', userData)

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
					throw new Error(`Server error: ${response.status}`)
				}
				throw new Error(errorData.detail || 'Registration failed')
			}

			if (!contentType?.includes('application/json')) {
				const text = await response.text()
				throw new Error('Server returned non-JSON response')
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
		console.log('🔍 Checking auth, token exists:', !!token)

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
				const user = await response.json()
				console.log('✅ Auth check successful, user:', user)
				set({ user, isAuthenticated: true, isLoading: false })
			} else {
				console.log('❌ Auth check failed, clearing tokens')
				localStorage.removeItem('access_token')
				localStorage.removeItem('refresh_token')
				set({ user: null, isAuthenticated: false, isLoading: false })
			}
		} catch (error) {
			console.error('❌ Auth check error:', error)
			localStorage.removeItem('access_token')
			localStorage.removeItem('refresh_token')
			set({ user: null, isAuthenticated: false, isLoading: false })
		}
	},

	clearError: () => set({ error: null }),
}))
