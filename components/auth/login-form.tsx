'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/lib/store/useAuthStore'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginForm() {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const { login, isLoading, error, clearError } = useAuthStore()
	const router = useRouter()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!username.trim() || !password.trim()) {
			alert('Please fill in all fields')
			return
		}

		clearError()
		try {
			await login(username, password)
			// ✅ Login muvaffaqiyatli bo'lgandan so'ng dashboardga yo'naltiramiz
			console.log('✅ Login successful, redirecting to dashboard...')
			router.push('/dashboard')
		} catch (err) {
			// Error store tomonidan boshqariladi
			console.error('Login error in form:', err)
		}
	}

	return (
		<Card className='w-full max-w-md mx-auto'>
			<CardHeader>
				<CardTitle className='text-2xl font-bold text-center'>Login</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className='space-y-4'>
					{error && (
						<Alert variant='destructive'>
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<div className='space-y-2'>
						<label htmlFor='username' className='text-sm font-medium'>
							Username
						</label>
						<Input
							id='username'
							type='text'
							value={username}
							onChange={e => {
								clearError()
								setUsername(e.target.value)
							}}
							required
							placeholder='Enter your username'
							disabled={isLoading}
						/>
					</div>

					<div className='space-y-2'>
						<label htmlFor='password' className='text-sm font-medium'>
							Password
						</label>
						<Input
							id='password'
							type='password'
							value={password}
							onChange={e => {
								clearError()
								setPassword(e.target.value)
							}}
							required
							placeholder='Enter your password'
							disabled={isLoading}
						/>
					</div>

					<Button type='submit' disabled={isLoading} className='w-full'>
						{isLoading ? (
							<div className='flex items-center space-x-2'>
								<div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
								<span>Logging in...</span>
							</div>
						) : (
							'Login'
						)}
					</Button>

					<div className='text-center'>
						<p className='text-sm text-gray-600'>
							Dont have an account?{' '}
							<Link
								href='/auth/register'
								className='text-blue-600 hover:underline'
							>
								Sign up
							</Link>
						</p>
					</div>
				</form>
			</CardContent>
		</Card>
	)
}
