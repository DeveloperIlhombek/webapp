'use client'

import { LogOut, Mail, Smartphone, User as UserIcon } from 'lucide-react'
import { useAuthStore, User } from '../lib/store/auth'

interface UserProfileProps {
	user: User
	isTelegram: boolean
}

export default function UserProfile({ user, isTelegram }: UserProfileProps) {
	const { logout } = useAuthStore()

	return (
		<div className='bg-white rounded-lg shadow-lg p-6'>
			<div className='text-center mb-6'>
				<div className='w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
					<UserIcon className='w-10 h-10 text-blue-600' />
				</div>
				<h2 className='text-2xl font-bold text-gray-800'>
					{user.full_name || user.username}
				</h2>
				<p className='text-gray-600'>@{user.username}</p>
				{isTelegram && (
					<span className='inline-block mt-2 bg-green-100 text-green-800 px-2 py-1 rounded text-sm'>
						Telegram User
					</span>
				)}
			</div>

			<div className='space-y-3 mb-6'>
				<div className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg'>
					<Mail className='w-5 h-5 text-gray-400' />
					<div>
						<p className='text-sm text-gray-500'>Email</p>
						<p className='font-medium'>{user.email}</p>
					</div>
				</div>

				{user.telegram_id && (
					<div className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg'>
						<Smartphone className='w-5 h-5 text-gray-400' />
						<div>
							<p className='text-sm text-gray-500'>Telegram ID</p>
							<p className='font-medium'>{user.telegram_id}</p>
						</div>
					</div>
				)}
			</div>

			<button
				onClick={logout}
				className='w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors'
			>
				<LogOut className='w-4 h-4' />
				<span>Logout</span>
			</button>
		</div>
	)
}
