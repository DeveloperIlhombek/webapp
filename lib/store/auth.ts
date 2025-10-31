/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { create } from 'zustand'

export interface User {
	id: number
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
	logout: () => Promise<void>
	checkAuth: () => Promise<void>
	clearError: () => void
}

const API_URL = 'https://helminthoid-clumsily-xuan.ngrok-free.dev'

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
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({ username, password }),
			})

			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(errorData.detail || 'Login failed')
			}

			const data = await response.json()
			localStorage.setItem('access_token', data.access_token)

			// Get user data
			const userResponse = await fetch(`${API_URL}/api/users/me`, {
				headers: {
					Authorization: `Bearer ${data.access_token}`,
				},
			})

			if (userResponse.ok) {
				const user = await userResponse.json()
				set({ user, isAuthenticated: true, isLoading: false })
			} else {
				throw new Error('Failed to get user data')
			}
		} catch (error) {
			set({
				isLoading: false,
				error: error instanceof Error ? error.message : 'Login failed',
			})
			throw error
		}
	},

	telegramLogin: async (telegramData: any) => {
		set({ isLoading: true, error: null })
		try {
			console.log('🔄 Sending Telegram login request...', telegramData)

			const response = await fetch(`${API_URL}/api/auth/telegram-login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify(telegramData),
			})

			console.log('🔹 Response status:', response.status)

			if (!response.ok) {
				const errorText = await response.text()
				console.error('❌ Response error text:', errorText)

				let errorDetail = 'Telegram login failed'
				try {
					const errorData = JSON.parse(errorText)
					errorDetail = errorData.detail || errorText
				} catch {
					errorDetail = errorText || 'Unknown error'
				}

				throw new Error(errorDetail)
			}

			const data = await response.json()
			console.log('✅ Telegram login response:', data)

			localStorage.setItem('access_token', data.access_token)

			// Get user data
			const userResponse = await fetch(`${API_URL}/api/users/me`, {
				headers: {
					Authorization: `Bearer ${data.access_token}`,
				},
			})

			if (userResponse.ok) {
				const user = await userResponse.json()
				console.log('✅ User data received:', user)
				set({ user, isAuthenticated: true, isLoading: false })
			} else {
				throw new Error('Failed to get user data after login')
			}
		} catch (error) {
			console.error('❌ Telegram login error:', error)
			set({
				isLoading: false,
				error: error instanceof Error ? error.message : 'Telegram login failed',
			})
			throw error
		}
	},

	register: async (userData: any) => {
		set({ error: null })
		const response = await fetch(`${API_URL}/api/auth/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(userData),
		})

		if (!response.ok) {
			const errorData = await response.json()
			throw new Error(errorData.detail || 'Registration failed')
		}

		return await response.json()
	},

	logout: async () => {
		try {
			await fetch(`${API_URL}/api/auth/logout`, {
				method: 'POST',
				credentials: 'include',
			})
		} catch (error) {
			console.error('Logout error:', error)
		} finally {
			localStorage.removeItem('access_token')
			set({ user: null, isAuthenticated: false })
		}
	},

	checkAuth: async () => {
		const token = localStorage.getItem('access_token')
		if (token) {
			try {
				const response = await fetch(`${API_URL}/api/users/me`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})

				if (response.ok) {
					const user = await response.json()
					set({ user, isAuthenticated: true })
				} else {
					localStorage.removeItem('access_token')
					set({ user: null, isAuthenticated: false })
				}
			} catch (error) {
				console.log(error)

				localStorage.removeItem('access_token')
				set({ user: null, isAuthenticated: false })
			}
		}
	},

	clearError: () => set({ error: null }),
}))
