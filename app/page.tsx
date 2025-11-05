'use client'

import LoginForm from '@/components/auth/login-form'
import Profile from '@/components/auth/profile'
import RegisterForm from '@/components/auth/register-form'
import TelegramAuth from '@/components/telegram/telegram-auth'
import TelegramDebug from '@/components/telegram/telegram-debug'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { useEffect } from 'react'

export default function HomePage() {
	const { checkAuth, isAuthenticated, isLoading } = useAuthStore()

	useEffect(() => {
		checkAuth()
	}, [checkAuth])

	if (isLoading) {
		return (
			<div className='flex items-center justify-center min-h-[60vh]'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
					<p className='mt-4 text-gray-600'>Loading...</p>
				</div>
			</div>
		)
	}

	return (
		<div className='space-y-8'>
			{isAuthenticated ? (
				<Profile />
			) : (
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-start'>
					<div className='space-y-8'>
						<TelegramAuth />
						<LoginForm />
					</div>
					<RegisterForm />
				</div>
			)}

			<TelegramDebug />
		</div>
	)
}
