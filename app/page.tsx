'use client'

import { useEffect, useState } from 'react'
// import LoginForm from '../components/LoginForm'
import TelegramInit from '../components/TelegramInit'
import UserProfile from '../components/UserProfile'
import { useAuthStore } from '../lib/store/auth'

export default function Home() {
	const { user, isAuthenticated, isLoading, error, clearError } = useAuthStore()
	const [isTelegram] = useState(() =>
		typeof window !== 'undefined' && window.Telegram?.WebApp ? true : false
	)

	useEffect(() => {
		if (isTelegram) {
			console.log('🔹 Running in Telegram Web App')
		} else {
			console.log('🔹 Running in regular browser')
			// Regular web auth check
			useAuthStore.getState().checkAuth()
		}
	}, [isTelegram])

	// Xatolarni ko'rsatish
	useEffect(() => {
		if (error) {
			console.error('🔴 Auth Error:', error)
		}
	}, [error])

	return (
		<div className='min-h-screen bg-liner-to-br from-blue-50 to-indigo-100'>
			<TelegramInit />

			<div className='container mx-auto px-4 py-8'>
				{/* Header */}
				<header className='text-center mb-8'>
					<h1 className='text-4xl font-bold text-gray-800 mb-2'>EduSystem</h1>
					<p className='text-gray-600'>
						{isTelegram ? 'Telegram Web App' : 'Web Platform'}
					</p>
					{isTelegram && (
						<div className='mt-2 inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm'>
							Telegram Mode
						</div>
					)}
				</header>

				{/* Xato ko'rsatish */}
				{error && (
					<div className='max-w-md mx-auto mb-4 p-4 bg-red-50 border border-red-200 rounded-lg'>
						<div className='flex items-center justify-between'>
							<div className='flex items-center'>
								<span className='text-red-600 font-medium'>{error}</span>
							</div>
							<button
								onClick={clearError}
								className='text-red-600 hover:text-red-800'
							>
								✕
							</button>
						</div>
					</div>
				)}

				{/* Asosiy kontent */}
				<div className='max-w-md mx-auto'>
					{isLoading ? (
						<div className='bg-white rounded-lg shadow-lg p-6 text-center'>
							<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
							<p className='text-gray-600'>
								{isTelegram ? 'Logging in via Telegram...' : 'Loading...'}
							</p>
							<p className='text-sm text-gray-500 mt-2'>Please wait...</p>
						</div>
					) : isAuthenticated && user ? (
						<UserProfile user={user} isTelegram={isTelegram} />
					) : isTelegram ? (
						<div className='bg-white rounded-lg shadow-lg p-6 text-center'>
							<div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
								<span className='text-2xl'>🤖</span>
							</div>
							<h2 className='text-xl font-semibold text-gray-800 mb-2'>
								Telegram Authentication
							</h2>
							<p className='text-gray-600 mb-4'>
								Were setting up your account with Telegram...
							</p>
							<div className='animate-pulse text-sm text-gray-500'>
								Processing your Telegram data
							</div>
						</div>
					) : (
						'Login'
						// <LoginForm />
					)}
				</div>

				{/* Debug Information */}
				{process.env.NODE_ENV === 'development' && (
					<div className='mt-8 max-w-md mx-auto bg-gray-50 border border-gray-200 rounded-lg p-4'>
						<h3 className='font-semibold text-gray-800 mb-2'>
							Debug Information:
						</h3>
						<div className='text-xs text-gray-600 space-y-1'>
							<div>
								<strong>Environment:</strong>{' '}
								{isTelegram ? 'Telegram WebApp' : 'Regular Browser'}
							</div>
							<div>
								<strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}
							</div>
							<div>
								<strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}
							</div>
							<div>
								<strong>User:</strong> {user ? user.username : 'None'}
							</div>
							<div>
								<strong>Telegram Available:</strong>{' '}
								{typeof window !== 'undefined' && window.Telegram?.WebApp
									? 'Yes'
									: 'No'}
							</div>
						</div>
						{user && (
							<details className='mt-2'>
								<summary className='cursor-pointer text-sm text-gray-700'>
									User Details
								</summary>
								<pre className='text-xs text-gray-600 mt-2 overflow-auto'>
									{JSON.stringify(user, null, 2)}
								</pre>
							</details>
						)}
					</div>
				)}
			</div>
		</div>
	)
}
