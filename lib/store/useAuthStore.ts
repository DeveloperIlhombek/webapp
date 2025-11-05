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
	logout: () => Promise<void>
	checkAuth: () => Promise<void>
	clearError: () => void
}

const API_URL = 'https://helminthoid-clumsily-xuan.ngrok-free.dev'

export const useAuthStore = create<AuthState>((set, get) => ({
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
				body: JSON.stringify({ username, password }),
			})

			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(errorData.detail || 'Login failed')
			}

			const data = await response.json()
			localStorage.setItem('access_token', data.access_token)
			localStorage.setItem('refresh_token', data.refresh_token)

			await get().checkAuth()
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
			console.log('🔄 Telegram login:', telegramData)

			const response = await fetch(`${API_URL}/api/auth/telegram-login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(telegramData),
			})

			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(errorData.detail || 'Telegram login failed')
			}

			const data = await response.json()
			localStorage.setItem('access_token', data.access_token)
			localStorage.setItem('refresh_token', data.refresh_token)

			await get().checkAuth()
		} catch (error) {
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
		localStorage.removeItem('access_token')
		localStorage.removeItem('refresh_token')
		set({ user: null, isAuthenticated: false })
	},

	checkAuth: async () => {
		const token = localStorage.getItem('access_token')

		if (!token) {
			set({ user: null, isAuthenticated: false })
			return
		}

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
				localStorage.removeItem('refresh_token')
				set({ user: null, isAuthenticated: false })
			}
		} catch (error) {
			console.log(error)

			localStorage.removeItem('access_token')
			localStorage.removeItem('refresh_token')
			set({ user: null, isAuthenticated: false })
		}
	},

	clearError: () => set({ error: null }),
}))
