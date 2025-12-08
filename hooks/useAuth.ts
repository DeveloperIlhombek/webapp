// hooks/useAuth.ts
import { useAuthStore } from '@/lib/store/useAuthStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function useRequireAuth(redirectTo = '/auth/login') {
	const { isAuthenticated, isLoading, checkAuth } = useAuthStore()
	const router = useRouter()

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			router.push(redirectTo)
		}
	}, [isAuthenticated, isLoading, router, redirectTo])

	useEffect(() => {
		checkAuth()
	}, [checkAuth])

	return { isAuthenticated, isLoading }
}
