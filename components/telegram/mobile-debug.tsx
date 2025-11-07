'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'

const API_URL =
	process.env.NEXT_PUBLIC_API_URL ||
	'https://helminthoid-clumsily-xuan.ngrok-free.dev'

export default function MobileDebug() {
	const [debugInfo, setDebugInfo] = useState<string>('')
	const [isTesting, setIsTesting] = useState(false)

	const testBackendConnection = async () => {
		setIsTesting(true)
		setDebugInfo('Testing backend connection...\n\n')

		try {
			// Test 1: Health check
			setDebugInfo(prev => prev + '🔍 Testing /api/auth/health...\n')
			const healthResponse = await fetch(`${API_URL}/api/auth/health`)
			const healthText = await healthResponse.text()
			setDebugInfo(prev => prev + `📨 Status: ${healthResponse.status}\n`)
			setDebugInfo(
				prev => prev + `📨 Response: ${healthText.substring(0, 200)}\n\n`
			)

			// Test 2: Test telegram login endpoint
			setDebugInfo(prev => prev + '🔍 Testing /api/auth/telegram-login...\n')
			const testData = {
				id: '123456789',
				first_name: 'Test',
				last_name: 'User',
				username: 'testuser',
				language_code: 'en',
			}

			const loginResponse = await fetch(`${API_URL}/api/auth/telegram-login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(testData),
			})

			const loginText = await loginResponse.text()
			setDebugInfo(prev => prev + `📨 Status: ${loginResponse.status}\n`)
			setDebugInfo(
				prev => prev + `📨 Response: ${loginText.substring(0, 200)}\n\n`
			)
		} catch (error) {
			console.error('Mobile debug error:', error)
			setDebugInfo(prev => prev + `❌ Error: ${error}\n\n`)
		} finally {
			setIsTesting(false)
		}
	}

	return (
		<Card className='w-full max-w-md mx-auto'>
			<CardHeader>
				<CardTitle className='text-lg font-bold text-center'>
					Backend Connection Test
				</CardTitle>
			</CardHeader>
			<CardContent className='space-y-4'>
				<div className='text-sm text-gray-600'>
					<p>
						<strong>API URL:</strong> {API_URL}
					</p>
				</div>

				<Button
					onClick={testBackendConnection}
					disabled={isTesting}
					className='w-full'
					variant='outline'
				>
					{isTesting ? 'Testing...' : 'Test Backend Connection'}
				</Button>

				{debugInfo && (
					<div className='mt-4 p-3 bg-gray-100 rounded-lg'>
						<pre className='text-xs whitespace-pre-wrap'>{debugInfo}</pre>
					</div>
				)}

				<div className='text-xs text-gray-600'>
					<p>
						<strong>Common Issues:</strong>
					</p>
					<ul className='list-disc list-inside mt-2 space-y-1'>
						<li>Backend server not running</li>
						<li>Wrong API URL</li>
						<li>CORS configuration</li>
						<li>Network connectivity</li>
					</ul>
				</div>
			</CardContent>
		</Card>
	)
}
