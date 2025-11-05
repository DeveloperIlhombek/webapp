'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
	const { user, isAuthenticated, isLoading, logout } = useAuthStore()
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
					<p className='mt-4 text-gray-600'>Loading...</p>
				</div>
			</div>
		)
	}

	if (!isAuthenticated || !user) {
		return null
	}

	return (
		<div className='container mx-auto py-8'>
			<div className='max-w-4xl mx-auto'>
				<div className='text-center mb-8'>
					<h1 className='text-3xl font-bold text-gray-900 mb-2'>
						Welcome back, {user.full_name || user.username}! 👋
					</h1>
					<p className='text-gray-600'>
						You have successfully logged in to your account.
					</p>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<svg
									className='w-5 h-5'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
									/>
								</svg>
								Profile Information
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-3'>
							<div>
								<label className='text-sm font-medium text-gray-500'>
									Username
								</label>
								<p className='text-lg'>{user.username}</p>
							</div>
							<div>
								<label className='text-sm font-medium text-gray-500'>
									Email
								</label>
								<p className='text-lg'>{user.email}</p>
							</div>
							{user.full_name && (
								<div>
									<label className='text-sm font-medium text-gray-500'>
										Full Name
									</label>
									<p className='text-lg'>{user.full_name}</p>
								</div>
							)}
							{user.telegram_id && (
								<div>
									<label className='text-sm font-medium text-gray-500'>
										Telegram ID
									</label>
									<p className='text-lg'>{user.telegram_id}</p>
								</div>
							)}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<svg
									className='w-5 h-5'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
									/>
								</svg>
								Account Actions
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							<Button className='w-full' variant='outline'>
								Edit Profile
							</Button>
							<Button className='w-full' variant='outline'>
								Change Password
							</Button>
							<Button className='w-full' variant='outline' onClick={logout}>
								Logout
							</Button>
						</CardContent>
					</Card>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Recent Activity</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-gray-500 text-center py-8'>
							No recent activity. Start exploring the app!
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
