/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand'

interface User {
	id: number
	email: string
	username: string
	full_name?: string
	telegram_id?: string
}

interface AuthState {
	user: User | null
	isAuthenticated: boolean
	login: (username: string, password: string) => Promise<void>
	telegramLogin: (telegramData: any) => Promise<void>
	register: (userData: any) => Promise<void>
	logout: () => Promise<void>
	checkAuth: () => Promise<void>
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const useAuthStore = create<AuthState>(set => ({
	user: null,
	isAuthenticated: false,
	login: async (username: string, password: string) => {
		const response = await fetch(`${API_URL}/api/auth/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({ username, password }),
		})
		if (!response.ok) {
			throw new Error('Login failed')
		}
		const data = await response.json()
		// Access tokenni localStorageda saqlaymiz
		localStorage.setItem('access_token', data.access_token)
		set({ isAuthenticated: true })

		// Foydalanuvchi ma'lumotlarini olish
		const userResponse = await fetch(`${API_URL}/api/users/me`, {
			headers: {
				Authorization: `Bearer ${data.access_token}`,
			},
		})
		const user = await userResponse.json()
		set({ user })
	},
	telegramLogin: async (telegramData: any) => {
		const response = await fetch(`${API_URL}/api/auth/telegram-login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify(telegramData),
		})
		if (!response.ok) {
			throw new Error('Telegram login failed')
		}
		const data = await response.json()
		localStorage.setItem('access_token', data.access_token)
		set({ isAuthenticated: true })

		const userResponse = await fetch(`${API_URL}/api/users/me`, {
			headers: {
				Authorization: `Bearer ${data.access_token}`,
			},
		})
		const user = await userResponse.json()
		set({ user })
	},
	register: async (userData: any) => {
		const response = await fetch(`${API_URL}/api/auth/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(userData),
		})
		if (!response.ok) {
			throw new Error('Registration failed')
		}
	},
	logout: async () => {
		await fetch(`${API_URL}/api/auth/logout`, {
			method: 'POST',
			credentials: 'include',
		})
		localStorage.removeItem('access_token')
		set({ user: null, isAuthenticated: false })
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
}))
