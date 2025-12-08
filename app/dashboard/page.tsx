// app/dashboard/page.tsx
'use client'

import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRequireAuth } from '@/hooks/useAuth'
import { useAuthStore, User } from '@/lib/store/useAuthStore'
import { Mail, MessageSquare, User2, UserCircle } from 'lucide-react'
export default function DashboardPage() {
	const { user, logout } = useAuthStore()
	const { isLoading } = useRequireAuth()

	//User ma'lumotlari mavjudligini tekshirish
	if (!user) {
		return (
			<div className='container mx-auto py-8'>
				<div className='max-w-4xl mx-auto text-center'>
					<h1 className='text-2xl font-bold text-gray-900 mb-4'>
						User information not available
					</h1>
					<p className='text-gray-600 mb-6'>
						Please try logging in again or contact support.
					</p>
					<Button onClick={logout}>Logout</Button>
				</div>
			</div>
		)
	}
	if (isLoading) {
		return <LoadingSpinner />
	}

	return (
		<div className='container mx-auto py-8'>
			<div className='max-w-4xl mx-auto'>
				{/* Welcome Section */}
				<div className='text-center mb-8'>
					<h1 className='text-3xl font-bold text-gray-900 mb-2'>
						Welcome back, ! 👋
					</h1>
					<p className='text-gray-600'>
						You have successfully logged in to your account.
					</p>
				</div>

				{/* Profile Information */}
				{user && (
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
						<ProfileCard user={user} />
						<ActionsCard onLogout={logout} />
					</div>
				)}

				{/* Recent Activity */}
				<ActivityCard />
			</div>
		</div>
	)
}

// Profile Card Component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ProfileCard({ user }: { user: User }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className='flex items-center gap-2'>
					<User2 className='w-5 h-5' />
					Profile Information
				</CardTitle>
			</CardHeader>
			<CardContent className='space-y-4'>
				<InfoItem
					icon={<UserCircle />}
					label='Username'
					value={user.username}
				/>
				<InfoItem icon={<Mail />} label='Email' value={user.email} />
				{user.full_name && (
					<InfoItem icon={<User2 />} label='Full Name' value={user.full_name} />
				)}
				{user.telegram_id && (
					<InfoItem
						icon={<MessageSquare />}
						label='Telegram ID'
						value={user.telegram_id}
					/>
				)}
			</CardContent>
		</Card>
	)
}

// Info Item Component
function InfoItem({
	icon,
	label,
	value,
}: {
	icon: React.ReactNode
	label: string
	value: string
}) {
	return (
		<div className='flex items-start space-x-3'>
			<div className='text-gray-500 mt-0.5'>{icon}</div>
			<div className='flex-1'>
				<p className='text-sm font-medium text-gray-500'>{label}</p>
				<p className='text-lg'>{value}</p>
			</div>
		</div>
	)
}

// Actions Card Component
function ActionsCard({ onLogout }: { onLogout: () => void }) {
	return (
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
			<CardContent className='space-y-3'>
				<Button className='w-full' variant='outline'>
					Edit Profile
				</Button>
				<Button className='w-full' variant='outline'>
					Change Password
				</Button>
				<Button className='w-full' variant='outline' onClick={onLogout}>
					Logout
				</Button>
			</CardContent>
		</Card>
	)
}

// Activity Card Component
function ActivityCard() {
	return (
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
	)
}
