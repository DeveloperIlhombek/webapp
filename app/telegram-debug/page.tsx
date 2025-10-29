/* eslint-disable @typescript-eslint/no-explicit-any */
// components/TelegramAuth.tsx
'use client'

import { useEffect, useState } from 'react'

declare global {
  interface Window {
    Telegram?: {
      WebApp: any
    }
  }
}

interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
}

interface AuthResponse {
  message: string
  user: {
    id: string
    first_name: string
    last_name: string
    email: string
    role: string
    telegram_id: string
  }
  access_token: string
  token_type: string
}

export default function TelegramAuth() {
  const [user, setUser] = useState<TelegramUser | null>(null)
  const [authResult, setAuthResult] = useState<AuthResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  const authenticateWithBackend = async (userData: TelegramUser, initDataUnsafe: any) => {
    setLoading(true)
    setError('')
    
    try {
      console.log('📤 Backendga yuborilayotgan maʼlumotlar:', {
        id: userData.id,
        first_name: userData.first_name,
        last_name: userData.last_name || '',
        username: userData.username || '',
        auth_date: initDataUnsafe.auth_date,
        hash: initDataUnsafe.hash,
      })

      const response = await fetch(
        'https://helminthoid-clumsily-xuan.ngrok-free.dev/api/telegram/verify',
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: userData.id,
            first_name: userData.first_name,
            last_name: userData.last_name || '',
            username: userData.username || '',
            auth_date: initDataUnsafe.auth_date,
            hash: initDataUnsafe.hash,
          }),
        }
      )

      console.log('📥 Response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Server error details:', errorText)
        throw new Error(`Server error: ${response.status} - ${errorText}`)
      }

      const result: AuthResponse = await response.json()
      console.log('✅ Authentication successful:', result)
      
      setAuthResult(result)
      
      // Token ni localStorageda saqlash
      localStorage.setItem('access_token', result.access_token)
      localStorage.setItem('user', JSON.stringify(result.user))
      
    } catch (err) {
      console.error('❌ Authentication error:', err)
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const initTelegram = () => {
      const tg = window.Telegram?.WebApp

      if (!tg) {
        setError('Telegram WebApp topilmadi')
        setLoading(false)
        return
      }

      console.log('🔍 Telegram WebApp topildi:', tg)

      // WebApp ni expand qilish
      tg.expand()
      tg.ready()

      const initDataUnsafe = tg.initDataUnsafe
      const userData = initDataUnsafe?.user

      console.log('📊 initDataUnsafe:', initDataUnsafe)
      console.log('👤 userData:', userData)

      if (userData) {
        setUser(userData)
        authenticateWithBackend(userData, initDataUnsafe)
      } else {
        setError('Foydalanuvchi maʼlumotlari topilmadi. initDataUnsafe.user mavjud emas.')
        setLoading(false)
      }
    }

    // Telegram scriptini yuklash
    if (window.Telegram?.WebApp) {
      console.log('🚀 Telegram WebApp allaqachon yuklangan')
      initTelegram()
    } else {
      console.log('📥 Telegram scriptini yuklayapman...')
      const script = document.createElement('script')
      script.src = 'https://telegram.org/js/telegram-web-app.js'
      script.async = true
      script.onload = () => {
        console.log('✅ Telegram script yuklandi')
        setTimeout(initTelegram, 500)
      }
      script.onerror = () => {
        console.error('❌ Telegram script yuklanmadi')
        setError('Telegram script yuklanmadi')
        setLoading(false)
      }
      document.head.appendChild(script)
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-liner-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Telegram bilan autentifikatsiya...</p>
          <p className="text-sm text-gray-500 mt-2">Iltimos kuting</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-liner-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full">
          <div className="text-red-500 text-center mb-4">
            <span className="text-4xl">❌</span>
            <h2 className="text-xl font-bold mt-2">Xatolik yuz berdi</h2>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-center">{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-200"
          >
            Qayta urinish
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-liner-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-2xl mx-auto">
        {authResult ? (
          <div className="bg-white rounded-2xl shadow-xl p-6 mt-8">
            <div className="text-green-500 text-center mb-6">
              <span className="text-4xl">✅</span>
              <h1 className="text-2xl font-bold mt-2">Muvaffaqiyatli Kirish!</h1>
              <p className="text-gray-600 mt-2">EduSystem ga xush kelibsiz</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-green-800 mb-3">
                  👤 Foydalanuvchi Malumotlari
                </h2>
                <div className="space-y-2">
                  <p><strong>ID:</strong> {authResult.user.id}</p>
                  <p><strong>Ism:</strong> {authResult.user.first_name}</p>
                  <p><strong>Familiya:</strong> {authResult.user.last_name}</p>
                  <p><strong>Email:</strong> {authResult.user.email}</p>
                  <p><strong>Rol:</strong> <span className="capitalize">{authResult.user.role}</span></p>
                  <p><strong>Telegram ID:</strong> {authResult.user.telegram_id}</p>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-blue-800 mb-3">
                  🔐 Token Malumotlari
                </h2>
                <div className="space-y-2">
                  <p><strong>Token:</strong> <code className="text-sm">{authResult.access_token.substring(0, 25)}...</code></p>
                  <p><strong>Token Turi:</strong> {authResult.token_type}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <button 
                onClick={() => {
                  // Asosiy ilovaga yo'naltirish
                  window.location.href = '/dashboard'
                }}
                className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold transition duration-200"
              >
                Dashboard ga tish
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-6 mt-8">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
              Telegram Foydalanuvchisi
            </h1>
            {user && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>Ism:</strong> {user.first_name}</p>
                <p><strong>Familiya:</strong> {user.last_name || "Yo'q"}</p>
                <p><strong>Username:</strong> @{user.username || "Yo'q"}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}