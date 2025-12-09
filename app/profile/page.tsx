'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/lib/store/useAuthStore'

//const user profile

// const user = {
// 	id: 1,
// 	email: 'user@example.com',
// 	username: 'user123',
// 	full_name: 'John Doe',
// 	telegram_id: '123456789',
// 	created_at: '2023-01-01T00:00:00Z',
// 	updated_at: '2023-01-01T00:00:00Z',
// }

export default function Profile() {
	const { user, logout } = useAuthStore()
	console.log('user' + user)

	if (!user) {
		return "Ma'lumotlar topilmadi"
	}

	return (
		<Card className='w-full max-w-2xl mx-auto'>
			<CardHeader>
				<CardTitle className='text-2xl font-bold'>Profile</CardTitle>
			</CardHeader>
			<CardContent className='space-y-4'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div>
						<label className='text-sm font-medium text-gray-500'>ID</label>
						<p className='text-lg'>{user.id}</p>
					</div>
					<div>
						<label className='text-sm font-medium text-gray-500'>Email</label>
						<p className='text-lg'>{user.email}</p>
					</div>
					<div>
						<label className='text-sm font-medium text-gray-500'>
							Username
						</label>
						<p className='text-lg'>{user.username}</p>
					</div>
					<div>
						<label className='text-sm font-medium text-gray-500'>
							Full Name
						</label>
						<p className='text-lg'>{user.full_name || 'Not provided'}</p>
					</div>
					{user.telegram_id && (
						<div>
							<label className='text-sm font-medium text-gray-500'>
								Telegram ID
							</label>
							<p className='text-lg'>{user.telegram_id}</p>
						</div>
					)}
				</div>

				<Button onClick={logout} variant='outline' className='w-full md:w-auto'>
					Logout
				</Button>
			</CardContent>
		</Card>
	)
}
