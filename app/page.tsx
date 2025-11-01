/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect } from 'react'
import TelegramInit from '../components/TelegramInit'
import UserProfile from '../components/UserProfile'
import { useTelegram } from '../hooks/useTelegram'
import { useAuthStore } from '../lib/store/auth'
// import LoginForm from '../components/LoginForm';

export default function Home() {
	const { user, isAuthenticated, isLoading, error, clearError, checkAuth } =
		useAuthStore()
	const { isTelegramAvailable } = useTelegram()

	useEffect(() => {
		// Agar Telegram mavjud bo'lmasa, oddiy auth tekshirish
		if (!isTelegramAvailable) {
			checkAuth()
		}
	}, [isTelegramAvailable, checkAuth])

	return (
		<div className='min-h-screen bg-liner-to-br from-blue-50 to-indigo-100'>
			<TelegramInit />

			<div className='container mx-auto px-4 py-8'>
				{/* Header */}
				<header className='text-center mb-8'>
					<h1 className='text-4xl font-bold text-gray-800 mb-2'>EduSystem</h1>
					<p className='text-gray-600'>
						{isTelegramAvailable ? 'Telegram Web App' : 'Web Platform'}
					</p>
					{isTelegramAvailable && (
						<div className='mt-2 inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm'>
							<span className='w-2 h-2 bg-green-500 rounded-full mr-2'></span>
							Telegram Mode Active
						</div>
					)}
				</header>

				{/* Xato ko'rsatish */}
				{error && (
					<div className='max-w-md mx-auto mb-4 p-4 bg-red-50 border border-red-200 rounded-lg'>
						<div className='flex items-center justify-between'>
							<div className='flex items-center'>
								{/* <span className='text-red-600 font-medium'>{error}</span> */}
								<span className='text-red-600 font-medium'>Xatolik xabari</span>
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
						<LoadingScreen isTelegram={isTelegramAvailable} />
					) : isAuthenticated && user ? (
						<UserProfile user={user} isTelegram={isTelegramAvailable} />
					) : isTelegramAvailable ? (
						<TelegramWaitingScreen />
					) : (
						"Login qilish formasi shu yerda bo'ladi"
						// <LoginForm />
					)}
				</div>

				{/* Debug Information */}
				{process.env.NODE_ENV === 'development' && (
					<DebugInfo
						isTelegramAvailable={isTelegramAvailable}
						isAuthenticated={isAuthenticated}
						isLoading={isLoading}
						user={user}
					/>
				)}
			</div>
		</div>
	)
}

// Yuklanish ekrani komponenti
function LoadingScreen({ isTelegram }: { isTelegram: boolean }) {
	return (
		<div className='bg-white rounded-lg shadow-lg p-6 text-center'>
			<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
			<p className='text-gray-600'>
				{isTelegram ? 'Connecting to Telegram...' : 'Loading...'}
			</p>
			<p className='text-sm text-gray-500 mt-2'>Please wait...</p>
		</div>
	)
}

// Telegram kutish ekrani
function TelegramWaitingScreen() {
	return (
		<div className='bg-white rounded-lg shadow-lg p-6 text-center'>
			<div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
				<span className='text-2xl'>📱</span>
			</div>
			<h2 className='text-xl font-semibold text-gray-800 mb-2'>
				Telegram Authentication
			</h2>
			<p className='text-gray-600 mb-4'>Setting up your Telegram account...</p>
			<div className='animate-pulse text-sm text-gray-500'>
				Initializing Telegram Web App
			</div>
		</div>
	)
}

// Debug ma'lumotlari komponenti
function DebugInfo({
	isTelegramAvailable,
	isAuthenticated,
	isLoading,
	user,
}: any) {
	return (
		<div className='mt-8 max-w-md mx-auto bg-gray-50 border border-gray-200 rounded-lg p-4'>
			<h3 className='font-semibold text-gray-800 mb-2'>Debug Information:</h3>
			<div className='text-xs text-gray-600 space-y-1'>
				<div>
					<strong>Telegram Available:</strong>{' '}
					{isTelegramAvailable ? 'Yes' : 'No'}
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
					<strong>Window.Telegram:</strong>{' '}
					{typeof window !== 'undefined' && window.Telegram ? 'Yes' : 'No'}
				</div>
				{typeof window !== 'undefined' && window.Telegram?.WebApp && (
					<>
						<div>
							<strong>Init Data:</strong>{' '}
							{window.Telegram.WebApp.initData ? 'Exists' : 'Empty'}
						</div>
						<div>
							<strong>User Data:</strong>{' '}
							{window.Telegram.WebApp.initDataUnsafe?.user ? 'Exists' : 'None'}
						</div>
					</>
				)}
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
	)
}
