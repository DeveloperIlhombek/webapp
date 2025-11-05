/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useCallback, useEffect, useState } from 'react'

// Constants
const TELEGRAM_SCRIPT_URL = 'https://telegram.org/js/telegram-web-app.js'
const SCRIPT_LOAD_TIMEOUT = 5000

interface DebugInfo {
	status: string
	user?: TelegramUser
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

export default function TelegramDebugPage() {
	const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const initializeTelegram = useCallback(() => {
		try {
			const tg = window.Telegram?.WebApp

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
		if (window.Telegram?.WebApp) {
			initializeTelegram()
			return
		}

		// Check if script is already in DOM
		const existingScript = document.querySelector(
			`script[src="${TELEGRAM_SCRIPT_URL}"]`
		)
		if (existingScript) {
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
		}, SCRIPT_LOAD_TIMEOUT)

		script.onload = () => {
			clearTimeout(loadTimeout)
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

	if (loading) {
		return (
			<div className='min-h-screen bg-liner-to-br from-blue-50 to-green-50 flex items-center justify-center'>
				<div className='bg-white rounded-2xl shadow-xl p-8 text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4'></div>
					<p className='text-gray-600'>Loading Telegram WebApp...</p>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-liner-to-br from-blue-50 to-green-50 p-4'>
			<div className='max-w-4xl mx-auto'>
				<div className='bg-white rounded-2xl shadow-xl p-6 mt-8'>
					<div
						className={`p-4 rounded-lg mb-6 ${
							error
								? 'bg-red-50 border border-red-200'
								: 'bg-green-50 border border-green-200'
						}`}
					>
						<h1
							className={`text-3xl font-bold text-center mb-2 ${
								error ? 'text-red-600' : 'text-green-600'
							}`}
						>
							{error
								? '❌ Telegram WebApp Error'
								: '✅ Telegram WebApp Successful!'}
						</h1>
						<p className='text-center text-gray-600'>
							{error ? error : 'Your Telegram WebApp is working correctly'}
						</p>
					</div>

					{debugInfo?.user && (
						<div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
							<h2 className='text-xl font-semibold text-blue-800 mb-3'>
								👤 User Information
							</h2>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
								<div>
									<strong className='text-gray-700'>ID:</strong>{' '}
									{debugInfo.user.id}
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
				</div>
			</div>
		</div>
	)
}
