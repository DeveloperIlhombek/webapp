'use client'

import Profile from '@/components/auth/profile'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProfilePage() {
	const { isAuthenticated, isLoading } = useAuthStore()
	const router = useRouter()

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			router.push('/auth/login')
		}
	}, [isAuthenticated, isLoading, router])

	if (isLoading) {
		return (
			<div className='flex items-center justify-center min-h-[60vh]'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
					<p className='mt-4 text-gray-600'>
						<LoadingSpinner />
					</p>
				</div>
			</div>
		)
	}

	if (!isAuthenticated) {
		return null
	}

	return (
		<div className='container mx-auto py-8'>
			<Profile />
		</div>
	)
}
