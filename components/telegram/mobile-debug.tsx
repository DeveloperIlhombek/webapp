'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'

export default function MobileDebug() {
	const [debugInfo, setDebugInfo] = useState<string>('')
	const [isTesting, setIsTesting] = useState(false)

	const testBackendConnection = async () => {
		setIsTesting(true)
		setDebugInfo('Testing backend connection...\n')

		try {
			const API_URL = 'https://helminthoid-clumsily-xuan.ngrok-free.dev'

			setDebugInfo(prev => prev + `🔗 API URL: ${API_URL}\n`)

			// Test 1: Backend health check
			setDebugInfo(prev => prev + '🔄 Testing backend health...\n')
			const healthResponse = await fetch(`${API_URL}/api/auth/health`)
			setDebugInfo(
				prev => prev + `🏥 Health status: ${healthResponse.status}\n`
			)

			if (healthResponse.ok) {
				const healthData = await healthResponse.json()
				setDebugInfo(
					prev => prev + `🏥 Health data: ${JSON.stringify(healthData)}\n`
				)
			}

			// Test 2: Test request
			setDebugInfo(prev => prev + '🔄 Testing POST request...\n')
			const testResponse = await fetch(`${API_URL}/api/auth/telegram-login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					id: 'test_mobile_user',
					first_name: 'Mobile',
					last_name: 'Test',
					username: 'mobiletest',
				}),
			})

			setDebugInfo(
				prev => prev + `📨 Test response status: ${testResponse.status}\n`
			)

			if (testResponse.ok) {
				const testData = await testResponse.json()
				setDebugInfo(
					prev => prev + `✅ Test successful: ${JSON.stringify(testData)}\n`
				)
			} else {
				const errorText = await testResponse.text()
				setDebugInfo(prev => prev + `❌ Test failed: ${errorText}\n`)
			}
		} catch (error) {
			console.error('Mobile debug error:', error)
			setDebugInfo(prev => prev + `❌ Connection error: ${error}\n`)
		} finally {
			setIsTesting(false)
		}
	}

	return (
		<Card className='w-full max-w-md mx-auto mt-4'>
			<CardHeader>
				<CardTitle className='text-lg font-bold text-center'>
					Mobile Debug
				</CardTitle>
			</CardHeader>
			<CardContent className='space-y-4'>
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
						<strong>Common Mobile Issues:</strong>
					</p>
					<ul className='list-disc list-inside mt-2 space-y-1'>
						<li>Internet connection</li>
						<li>Backend server status</li>
						<li>CORS configuration</li>
						<li>SSL certificates</li>
						<li>Network timeouts</li>
					</ul>
				</div>
			</CardContent>
		</Card>
	)
}
