'use client'

import {
	CheckCircle,
	LogOut,
	Mail,
	Smartphone,
	User as UserIcon,
} from 'lucide-react'
import { useAuthStore, User } from '../lib/store/auth'

interface UserProfileProps {
	user: User
	isTelegram: boolean
}

export default function UserProfile({ user, isTelegram }: UserProfileProps) {
	const { logout } = useAuthStore()

	const handleLogout = async () => {
		await logout()
	}

	return (
		<div className='bg-white rounded-lg shadow-lg p-6'>
			{/* Sarlavha */}
			<div className='text-center mb-6'>
				<div className='w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
					{isTelegram ? (
						<span className='text-2xl'>🤖</span>
					) : (
						<UserIcon className='w-10 h-10 text-blue-600' />
					)}
				</div>
				<h2 className='text-2xl font-bold text-gray-800'>
					{user.full_name || user.username}
				</h2>
				<p className='text-gray-600'>@{user.username}</p>
				{isTelegram && (
					<div className='inline-flex items-center mt-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm'>
						<CheckCircle className='w-4 h-4 mr-1' />
						Telegram Login
					</div>
				)}
			</div>

			{/* User ma'lumotlari */}
			<div className='space-y-4 mb-6'>
				<div className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg'>
					<Mail className='w-5 h-5 text-gray-400' />
					<div>
						<p className='text-sm text-gray-500'>Email</p>
						<p className='font-medium text-gray-800'>{user.email}</p>
					</div>
				</div>

				{user.telegram_id && (
					<div className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg'>
						<Smartphone className='w-5 h-5 text-gray-400' />
						<div>
							<p className='text-sm text-gray-500'>Telegram ID</p>
							<p className='font-medium text-gray-800'>{user.telegram_id}</p>
						</div>
					</div>
				)}

				<div className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg'>
					<UserIcon className='w-5 h-5 text-gray-400' />
					<div>
						<p className='text-sm text-gray-500'>User ID</p>
						<p className='font-medium text-gray-800'>#{user.id}</p>
					</div>
				</div>
			</div>

			{/* Muvaffaqiyat xabari */}
			<div className='mb-4 p-3 bg-green-50 border border-green-200 rounded-lg'>
				<div className='flex items-center'>
					<CheckCircle className='w-5 h-5 text-green-600 mr-2' />
					<div>
						<p className='text-green-800 font-medium'>Success!</p>
						<p className='text-green-700 text-sm'>
							{isTelegram
								? 'Telegram login successful! User data saved to database.'
								: 'Regular login successful!'}
						</p>
					</div>
				</div>
			</div>

			{/* Logout tugmasi */}
			<button
				onClick={handleLogout}
				className='w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition-colors'
			>
				<LogOut className='w-5 h-5' />
				<span>Logout</span>
			</button>
		</div>
	)
}
