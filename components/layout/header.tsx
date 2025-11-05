'use client'

import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/lib/store/useAuthStore'

export default function Header() {
	const { user, isAuthenticated, logout } = useAuthStore()

	return (
		<header className='bg-white shadow-sm border-b'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex justify-between items-center h-16'>
					<div className='flex items-center'>
						<h1 className='text-xl font-bold text-gray-900'>Telegram WebApp</h1>
					</div>

					<div className='flex items-center space-x-4'>
						{isAuthenticated && user ? (
							<>
								<span className='text-sm text-gray-700'>
									Welcome, {user.username}
								</span>
								<Button onClick={logout} variant='outline' size='sm'>
									Logout
								</Button>
							</>
						) : (
							<div className='flex space-x-2'>
								<Button asChild variant='outline' size='sm'>
									<a href='/auth/login'>Login</a>
								</Button>
								<Button asChild size='sm'>
									<a href='/auth/register'>Register</a>
								</Button>
							</div>
						)}
					</div>
				</div>
			</div>
		</header>
	)
}
