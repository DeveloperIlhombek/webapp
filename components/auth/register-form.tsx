'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { useState } from 'react'

export default function RegisterForm() {
	const [formData, setFormData] = useState({
		email: '',
		username: '',
		full_name: '',
		password: '',
		confirmPassword: '',
	})
	const { register, isLoading, error, clearError } = useAuthStore()

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value })
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		clearError()

		if (formData.password !== formData.confirmPassword) {
			alert('Passwords do not match')
			return
		}

		try {
			await register({
				email: formData.email,
				username: formData.username,
				full_name: formData.full_name,
				password: formData.password,
			})
			alert('Registration successful! Please login.')
		} catch (err) {
			// Error handled in store
		}
	}

	return (
		<Card className='w-full max-w-md mx-auto'>
			<CardHeader>
				<CardTitle className='text-2xl font-bold text-center'>
					Register
				</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className='space-y-4'>
					{error && (
						<Alert variant='destructive'>
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<div className='space-y-2'>
						<label htmlFor='email' className='text-sm font-medium'>
							Email
						</label>
						<Input
							id='email'
							name='email'
							type='email'
							value={formData.email}
							onChange={handleChange}
							required
							placeholder='Enter your email'
						/>
					</div>

					<div className='space-y-2'>
						<label htmlFor='username' className='text-sm font-medium'>
							Username
						</label>
						<Input
							id='username'
							name='username'
							type='text'
							value={formData.username}
							onChange={handleChange}
							required
							placeholder='Choose a username'
						/>
					</div>

					<div className='space-y-2'>
						<label htmlFor='full_name' className='text-sm font-medium'>
							Full Name
						</label>
						<Input
							id='full_name'
							name='full_name'
							type='text'
							value={formData.full_name}
							onChange={handleChange}
							placeholder='Enter your full name'
						/>
					</div>

					<div className='space-y-2'>
						<label htmlFor='password' className='text-sm font-medium'>
							Password
						</label>
						<Input
							id='password'
							name='password'
							type='password'
							value={formData.password}
							onChange={handleChange}
							required
							placeholder='Create a password'
						/>
					</div>

					<div className='space-y-2'>
						<label htmlFor='confirmPassword' className='text-sm font-medium'>
							Confirm Password
						</label>
						<Input
							id='confirmPassword'
							name='confirmPassword'
							type='password'
							value={formData.confirmPassword}
							onChange={handleChange}
							required
							placeholder='Confirm your password'
						/>
					</div>

					<Button type='submit' disabled={isLoading} className='w-full'>
						{isLoading ? 'Creating account...' : 'Register'}
					</Button>
				</form>
			</CardContent>
		</Card>
	)
}
