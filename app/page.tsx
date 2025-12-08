'use client'

// import MobileTelegramDebug from '@/components/telegram/mobile-debug'
import TelegramAuth from '@/components/telegram/telegram-auth'
// import TelegramDebug from '@/components/telegram/telegram-debug'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
export default function HomePage() {
	const { checkAuth, isAuthenticated, isLoading } = useAuthStore()
	const router = useRouter()

	useEffect(() => {
		checkAuth()
	}, [checkAuth])

	// ✅ Agar foydalanuvchi allaqachon authenticated bo'lsa, uni dashboardga yo'naltiramiz
	useEffect(() => {
		if (isAuthenticated && !isLoading) {
			console.log('✅ User is authenticated, redirecting to dashboard...')
			router.push('/dashboard')
		}
	}, [isAuthenticated, isLoading, router])

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

	// ✅ Agar foydalanuvchi authenticated bo'lsa, loading ko'rsatamiz (redirect bo'ladi)
	if (isAuthenticated) {
		return (
			<div className='flex items-center justify-center min-h-[60vh]'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
					<p className='mt-4 text-gray-600'>Redirecting to dashboard...</p>
				</div>
			</div>
		)
	}

	return (
		<div className='space-y-8'>
			{/* Hero Section */}
			<div className='text-center'>
				<h1 className='text-4xl font-bold text-gray-900 mb-4'>
					Telegram WebAppga Xush kelibsiz
				</h1>
				<p className='text-xl text-gray-600 max-w-2xl mx-auto'>
					Oddiy kir yoki telegram orqali kir
				</p>
			</div>

			{/* Auth Forms */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-start'>
				<div className='space-y-8'>
					<TelegramAuth />
				</div>
			</div>
			{/* Mobile Debug - faqat development uchun */}
			{/* {process.env.NODE_ENV === 'development' && <MobileTelegramDebug />} */}
			{/* Debug Information */}
			{/* <TelegramDebug /> */}
		</div>
	)
}
