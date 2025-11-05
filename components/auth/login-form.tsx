'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { useState } from 'react'

export default function LoginForm() {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const { login, isLoading, error, clearError } = useAuthStore()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		clearError()
		try {
			await login(username, password)
		} catch (err) {
			// Error handled in store
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
							onChange={e => setUsername(e.target.value)}
							required
							placeholder='Enter your username'
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
							onChange={e => setPassword(e.target.value)}
							required
							placeholder='Enter your password'
						/>
					</div>

					<Button type='submit' disabled={isLoading} className='w-full'>
						{isLoading ? 'Logging in...' : 'Login'}
					</Button>
				</form>
			</CardContent>
		</Card>
	)
}
