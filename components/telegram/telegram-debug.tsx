/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useCallback, useEffect, useState } from 'react'

const TELEGRAM_SCRIPT_URL = 'https://telegram.org/js/telegram-web-app.js'

interface DebugInfo {
	status: string
	user?: any
	initDataExists: boolean
	initDataLength: number
	initDataUnsafeKeys: string[]
	platform: string
	version: string
	viewportHeight: number
	viewportStableHeight: number
	isExpanded: boolean
	themeParams: any
}

export default function TelegramDebug() {
	const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [scriptLoaded, setScriptLoaded] = useState(false)

	const initializeTelegram = useCallback(() => {
		try {
			const tg = (window as any).Telegram?.WebApp

			if (!tg) {
				setError('Telegram WebApp object not found')
				setLoading(false)
				return
			}

			// Safe initialization
			tg.expand?.()
			tg.ready?.()

			const userData = tg.initDataUnsafe?.user

			const info: DebugInfo = {
				status: 'Telegram WebApp is working! ✅',
				user: userData,
				initDataExists: !!tg.initData,
				initDataLength: tg.initData?.length || 0,
				initDataUnsafeKeys: tg.initDataUnsafe
					? Object.keys(tg.initDataUnsafe)
					: [],
				platform: tg.platform || 'unknown',
				version: tg.version || 'unknown',
				viewportHeight: tg.viewportHeight,
				viewportStableHeight: tg.viewportStableHeight,
				isExpanded: tg.isExpanded,
				themeParams: tg.themeParams,
			}

			setDebugInfo(info)
			setError(null)
		} catch (err) {
			setError(
				`Initialization error: ${
					err instanceof Error ? err.message : 'Unknown error'
				}`
			)
		} finally {
			setLoading(false)
		}
	}, [])

	const loadTelegramScript = useCallback(() => {
		// Check if script is already loaded
		if ((window as any).Telegram?.WebApp) {
			setScriptLoaded(true)
			initializeTelegram()
			return
		}

		// Check if script is already in DOM
		const existingScript = document.querySelector(
			`script[src="${TELEGRAM_SCRIPT_URL}"]`
		)
		if (existingScript) {
			setScriptLoaded(true)
			setTimeout(initializeTelegram, 100)
			return
		}

		// Load new script
		const script = document.createElement('script')
		script.src = TELEGRAM_SCRIPT_URL
		script.async = true

		const loadTimeout = setTimeout(() => {
			setError('Script loading timeout')
			setLoading(false)
		}, 5000)

		script.onload = () => {
			clearTimeout(loadTimeout)
			setScriptLoaded(true)
			setTimeout(initializeTelegram, 100)
		}

		script.onerror = () => {
			clearTimeout(loadTimeout)
			setError('Failed to load Telegram script')
			setLoading(false)
		}

		document.head.appendChild(script)
	}, [initializeTelegram])

	useEffect(() => {
		loadTelegramScript()
	}, [loadTelegramScript])

	const formatDebugInfo = (info: DebugInfo) => {
		return {
			'🚀 Status': info.status,
			'👤 User': info.user
				? {
						ID: info.user.id,
						'First Name': info.user.first_name,
						'Last Name': info.user.last_name || 'Not provided',
						Username: info.user.username
							? `@${info.user.username}`
							: 'Not provided',
						Language: info.user.language_code || 'Not provided',
				  }
				: 'No user data',
			'📡 Init Data': {
				Exists: info.initDataExists ? 'Yes ✅' : 'No ❌',
				Length: `${info.initDataLength} characters`,
				'Unsafe Keys':
					info.initDataUnsafeKeys.length > 0
						? info.initDataUnsafeKeys.join(', ')
						: 'None',
			},
		}
	}

	if (loading) {
		return (
			<div className='mt-8 p-4 border rounded-lg'>
				<h3 className='text-lg font-medium mb-2'>Telegram Debug</h3>
				<p>Loading Telegram WebApp...</p>
			</div>
		)
	}

	return (
		<div className='mt-8 p-4 border rounded-lg'>
			<div
				className={`p-4 rounded-lg mb-4 ${
					error
						? 'bg-red-50 border border-red-200'
						: 'bg-green-50 border border-green-200'
				}`}
			>
				<h3
					className={`text-lg font-medium mb-2 ${
						error ? 'text-red-600' : 'text-green-600'
					}`}
				>
					{error
						? '❌ Telegram WebApp Error'
						: '✅ Telegram WebApp Successful!'}
				</h3>
				<p className='text-sm'>
					{error ? error : 'Your Telegram WebApp is working correctly'}
				</p>
			</div>

			{debugInfo?.user && (
				<div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4'>
					<h4 className='text-md font-semibold text-blue-800 mb-2'>
						👤 Telegram User Information
					</h4>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-2 text-sm'>
						<div>
							<strong className='text-gray-700'>ID:</strong> {debugInfo.user.id}
						</div>
						<div>
							<strong className='text-gray-700'>First Name:</strong>{' '}
							{debugInfo.user.first_name}
						</div>
						<div>
							<strong className='text-gray-700'>Last Name:</strong>{' '}
							{debugInfo.user.last_name || 'Not provided'}
						</div>
						<div>
							<strong className='text-gray-700'>Username:</strong>{' '}
							{debugInfo.user.username
								? `@${debugInfo.user.username}`
								: 'Not provided'}
						</div>
						{debugInfo.user.language_code && (
							<div>
								<strong className='text-gray-700'>Language:</strong>{' '}
								{debugInfo.user.language_code}
							</div>
						)}
					</div>
				</div>
			)}

			{debugInfo && (
				<div className='mt-4'>
					<h4 className='text-md font-medium mb-2'>Debug Information</h4>
					<pre className='whitespace-pre-wrap bg-gray-100 p-3 rounded text-sm overflow-x-auto'>
						{JSON.stringify(formatDebugInfo(debugInfo), null, 2)}
					</pre>
				</div>
			)}
		</div>
	)
}
