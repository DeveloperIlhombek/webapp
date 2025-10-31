'use client'

import TelegramInit from '@/components/TelegramInit'
import { useEffect } from 'react'
import { useAuthStore } from '../lib/store/auth'

export default function Home() {
	const { user, isAuthenticated, checkAuth } = useAuthStore()

	useEffect(() => {
		// Brauzer orqali kirgan foydalanuvchilarni tekshirish
		checkAuth()
	}, [checkAuth])

	return (
		<div className='min-h-screen bg-gray-100'>
			<TelegramInit />
			<div className='container mx-auto px-4 py-8'>
				<h1 className='text-3xl font-bold text-center mb-8'>EduSystem</h1>
				{isAuthenticated ? (
					<div className='max-w-md mx-auto bg-white rounded-lg shadow-md p-6'>
						<h2 className='text-xl font-semibold mb-4'>User Profile</h2>
						<p>
							<strong>ID:</strong> {user?.id}
						</p>
						<p>
							<strong>Username:</strong> {user?.username}
						</p>
						<p>
							<strong>Email:</strong> {user?.email}
						</p>
						<p>
							<strong>Full Name:</strong> {user?.full_name}
						</p>
						<p>
							<strong>Telegram ID:</strong> {user?.telegram_id}
						</p>
					</div>
				) : (
					<div className='text-center'>
						<p>Please log in...</p>
						{/* Agar Telegram Web App bo'lmasa, oddiy login form ko'rsatish mumkin */}
					</div>
				)}
			</div>
		</div>
	)
}
