'use client'

import { Button } from '@/components/ui/button'
import { useTelegram } from '@/hooks/useTelegram'
import { useAuthStore } from '@/lib/store/useAuthStore'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

export default function Header() {
	const { user, isAuthenticated, logout, isLoading } = useAuthStore()
	const { user: telegramUser } = useTelegram()
	const [isDropdownOpen, setIsDropdownOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)

	// Dropdown ni tashqariga click qilganda yopish
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsDropdownOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	const handleLogout = () => {
		logout()
		setIsDropdownOpen(false)
	}

	const getDisplayName = () => {
		if (user?.full_name) return user.full_name
		if (user?.username) return user.username
		if (telegramUser?.first_name) return telegramUser.first_name
		return 'User'
	}

	const getAvatarText = () => {
		return getDisplayName().charAt(0).toUpperCase()
	}

	return (
		<header className='bg-white shadow-sm border-b sticky top-0 z-50'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex justify-between items-center h-16'>
					{/* Logo va brand */}
					<div className='flex items-center space-x-3'>
						<div className='shrink-0'>
							<div className='w-8 h-8 bg-liner-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center'>
								<span className='text-white font-bold text-sm'>T</span>
							</div>
						</div>
						<div>
							<h1 className='text-xl font-bold text-gray-900'>
								Telegram WebApp
							</h1>
							<p className='text-xs text-gray-500 hidden sm:block'>
								{telegramUser ? 'Telegram Mode' : 'Web Mode'}
							</p>
						</div>
					</div>

					{/* Navigation va user actions */}
					<div className='flex items-center space-x-4'>
						{isLoading ? (
							<div className='flex items-center space-x-2'>
								<div className='animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600'></div>
								<span className='text-sm text-gray-500'>Loading...</span>
							</div>
						) : isAuthenticated && user ? (
							<div className='relative' ref={dropdownRef}>
								<button
									onClick={() => setIsDropdownOpen(!isDropdownOpen)}
									className='flex items-center space-x-3 bg-gray-50 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors duration-200'
								>
									<div className='flex items-center space-x-2'>
										<div className='w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center'>
											<span className='text-white font-medium text-sm'>
												{getAvatarText()}
											</span>
										</div>
										<div className='text-left hidden md:block'>
											<p className='text-sm font-medium text-gray-900'>
												{getDisplayName()}
											</p>
											<p className='text-xs text-gray-500'>
												@{user.username || telegramUser?.username || 'user'}
											</p>
										</div>
									</div>
									<svg
										className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
											isDropdownOpen ? 'rotate-180' : ''
										}`}
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M19 9l-7 7-7-7'
										/>
									</svg>
								</button>

								{/* Dropdown menu */}
								{isDropdownOpen && (
									<div className='absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50'>
										{/* User info */}
										<div className='px-4 py-3 border-b border-gray-100'>
											<p className='text-sm font-medium text-gray-900'>
												{getDisplayName()}
											</p>
											<p className='text-sm text-gray-500 truncate'>
												{user.email}
											</p>
											{telegramUser && (
												<div className='flex items-center space-x-1 mt-1'>
													<span className='text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full'>
														Telegram User
													</span>
												</div>
											)}
										</div>

										{/* Menu items */}
										<div className='py-2'>
											<Link
												href='/profile'
												className='flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50'
												onClick={() => setIsDropdownOpen(false)}
											>
												<svg
													className='w-4 h-4'
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
												<span>Profile</span>
											</Link>

											<Link
												href='/settings'
												className='flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50'
												onClick={() => setIsDropdownOpen(false)}
											>
												<svg
													className='w-4 h-4'
													fill='none'
													stroke='currentColor'
													viewBox='0 0 24 24'
												>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
													/>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
													/>
												</svg>
												<span>Settings</span>
											</Link>
										</div>

										{/* Logout */}
										<div className='border-t border-gray-100 pt-2'>
											<button
												onClick={handleLogout}
												className='flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50'
											>
												<svg
													className='w-4 h-4'
													fill='none'
													stroke='currentColor'
													viewBox='0 0 24 24'
												>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
													/>
												</svg>
												<span>Logout</span>
											</button>
										</div>
									</div>
								)}
							</div>
						) : (
							<div className='flex space-x-3'>
								<Button
									asChild
									variant='outline'
									size='sm'
									className='hidden sm:flex'
								>
									<Link href='/auth/login'>Login</Link>
								</Button>
								<Button
									asChild
									variant={'destructive'}
									size='sm'
									className='bg-liner-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
								>
									<Link href='/auth/register'>Get Started</Link>
								</Button>

								{/* Mobile menu button */}
								<div className='sm:hidden'>
									<Button asChild variant='outline' size='sm'>
										<a href='/auth/login'>
											<svg
												className='w-4 h-4'
												fill='none'
												stroke='currentColor'
												viewBox='0 0 24 24'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1'
												/>
											</svg>
										</a>
									</Button>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</header>
	)
}
