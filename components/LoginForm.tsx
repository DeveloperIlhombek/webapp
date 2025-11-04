'use client'

import { LogIn, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '../lib/store/auth'

export default function LoginForm() {
	const [isLogin, setIsLogin] = useState(true)
	const [formData, setFormData] = useState({
		username: '',
		email: '',
		password: '',
		full_name: '',
	})
	const { login, register, isLoading } = useAuthStore()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		try {
			if (isLogin) {
				await login(formData.username, formData.password)
			} else {
				await register(formData)
				await login(formData.username, formData.password)
			}
		} catch (error) {
			console.error('Auth error:', error)
		}
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData(prev => ({
			...prev,
			[e.target.name]: e.target.value,
		}))
	}

	return (
		<div className='bg-white rounded-lg shadow-lg p-6'>
			<h2 className='text-2xl font-bold text-center mb-6'>
				{isLogin ? 'Sign In' : 'Create Account'}
			</h2>

			<form onSubmit={handleSubmit} className='space-y-4'>
				{!isLogin && (
					<>
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-1'>
								Full Name
							</label>
							<input
								type='text'
								name='full_name'
								value={formData.full_name}
								onChange={handleChange}
								className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
								required
							/>
						</div>
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-1'>
								Email
							</label>
							<input
								type='email'
								name='email'
								value={formData.email}
								onChange={handleChange}
								className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
								required
							/>
						</div>
					</>
				)}

				<div>
					<label className='block text-sm font-medium text-gray-700 mb-1'>
						Username
					</label>
					<input
						type='text'
						name='username'
						value={formData.username}
						onChange={handleChange}
						className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
						required
					/>
				</div>

				<div>
					<label className='block text-sm font-medium text-gray-700 mb-1'>
						Password
					</label>
					<input
						type='password'
						name='password'
						value={formData.password}
						onChange={handleChange}
						className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
						required
					/>
				</div>

				<button
					type='submit'
					disabled={isLoading}
					className='w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-lg transition-colors'
				>
					{isLoading ? (
						<div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
					) : isLogin ? (
						<LogIn className='w-4 h-4' />
					) : (
						<UserPlus className='w-4 h-4' />
					)}
					<span>
						{isLoading ? 'Loading...' : isLogin ? 'Sign In' : 'Create Account'}
					</span>
				</button>
			</form>

			<div className='mt-4 text-center'>
				<button
					onClick={() => setIsLogin(!isLogin)}
					className='text-blue-600 hover:text-blue-700 text-sm'
				>
					{isLogin
						? "Don't have an account? Sign up"
						: 'Already have an account? Sign in'}
				</button>
			</div>
		</div>
	)
}
